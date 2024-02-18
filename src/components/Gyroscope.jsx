import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Confirm from './Confirm';
import * as Utility from '../scripts/utility';
import storeActions, { initialState } from '../store/store.redux';
import { selectGyroState } from '../store/store.selectors';

const failureTolerance = 3;
const validMethods = ['orientation', 'gyroscope'];

export const Gyro = ({ interval = 1, ...props }) => {
	const dispatch = useDispatch();
	const gyro = useSelector(selectGyroState);
	const [method, setMethod] = useState('orientation');
	const [permitted, setPermitted] = useState(false);
	const [confirmed, setConfirmed] = useState(true);
	const [failures, setFailures] = useState(0);
	const [gyroscope, setGyroscope] = useState(null);

	const dataFailure = (err) => {
		// if(failures >= failureTolerance - 1) {
		// 	setMethod(currentMethod => {
		// 		const newMethod = currentMethod === 'gpsd' ? 'geolocation' : 'gpsd';
		// 		console.log(`Changing location method to ${newMethod}`);
		// 		return newMethod;
		// 	});
		// 	setFailures(0);
		// 	return;
		// }

		setFailures((currentFailures) => currentFailures + 1);
		console.log(`Failed to get position via ${method}`);
		console.error(err.type);
	};

	const cleanupGyroscopeData = (data) => ({
		heading: data.z,
		climb: data.y,
		tilt: data.x,
		method,
	});

	const cleanupDeviceOrientationData = (data) => {
		console.log('GYRO', gyro)
		return {
			heading: data.webkitCompassHeading || data.alpha || 0,
			climb: data.beta ? data.beta - 90 : 0,
			tilt: data.gamma || 0,
			method,
			failures,
		}
	};

	const getDataFromGyroscope = () => {
		if (navigator?.permissions?.query) {
			navigator.permissions
				.query({ name: 'gyroscope' })
				.then((permission) => {
					if (permission.state === 'granted' || permission.state === 'prompt') {
						console.log('Permission granted');
						setGyroscope(new window.Gyroscope({ frequency: interval }));

						gyroscope.addEventListener('reading', (ev) => {
							dispatch(storeActions.setGyro(cleanupGyroscopeData(gyroscope)));
							console.log(`Angular velocity along the X-axis ${gyroscope.x}`);
							console.log(`Angular velocity along the Y-axis ${gyroscope.y}`);
							console.log(`Angular velocity along the Z-axis ${gyroscope.z}`);
						});

						gyroscope.start();
					}
					else {
						dataFailure('Gyroscope API permission denied');
					}
				})
				.catch(dataFailure);
		}
		else if (window.Gyroscope) {
			console.log('Permission not granted');

			setGyroscope(new window.Gyroscope({ frequency: interval }));

			gyroscope.addEventListener('reading', (ev) => {
				dispatch(storeActions.setGyro(cleanupGyroscopeData(gyroscope)));
				console.log(`Angular velocity along the X-axis ${gyroscope.x}`);
				console.log(`Angular velocity along the Y-axis ${gyroscope.y}`);
				console.log(`Angular velocity along the Z-axis ${gyroscope.z}`);
			});

			gyroscope.start();
		}
	};

	const getDataFromDeviceOrientation = () => {
		if (DeviceMotionEvent.requestPermission) {
			DeviceMotionEvent.requestPermission()
				.then((permission) => {
					if (permission === 'granted') {
						setPermitted(true);
						window.addEventListener(
							'deviceorientation',
							(ev) => dispatch(storeActions.setGyro(cleanupDeviceOrientationData(ev)))
						);
					}
					else {
						setConfirmed(false);
						dataFailure('Device Motion API permission denied');
					}
				})
				.catch((err) => {
					if (err.name.includes('NotAllowedError')) setConfirmed(false);
					dataFailure(err);
				});
		}
		else {
			window.addEventListener(
				'deviceorientation',
				(ev) => dispatch(storeActions.setGyro(cleanupDeviceOrientationData(ev)))
			);
		}
	};

	const updatePosition = () => {
		if (method === 'orientation') getDataFromDeviceOrientation();
		if (method === 'gyroscope') getDataFromGyroscope();
	};

	// Just in case we need to reset bad persisted data
	useEffect(() => {
		if(gyro === null)
			dispatch(storeActions.setGyro(initialState.gyro));
	}, []);

	useEffect(updatePosition, []);

	if (!permitted && !confirmed)
		return (
			<Confirm
				onConfirm={() => {
					setConfirmed(true);
					updatePosition();
				}}
				onCancel={() => {
					setConfirmed(true);
				}}
			>
				<span className="show-unlit" data-unlit={Utility.fillUnlitLCD(3, 20)}>
					You must grant permission to access the gyroscope.
				</span>
			</Confirm>
		);

	return null;
};

Gyro.propTypes = {
	interval: PropTypes.number,
};

Gyro.defaultProps = {
	interval: 1,
};

export default Gyro;
