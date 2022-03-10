import React, { useEffect, useState } from 'react';
import Confirm from './Confirm';
import * as Utility from '../scripts/utility';

const failureTolerance = 3;
const validMethods = ['orientation', 'gyroscope'];

let gyroscope = null;

export const Gyro = ({interval = 1, onUpdate, ...props}) => {
	const [method, setMethod] = useState('orientation');
	const [permitted, setPermitted] = useState(false);
	const [confirmed, setConfirmed] = useState(true);
	const [failures, setFailures] = useState(0);

	const dataFailure = err => {
		// if(failures >= failureTolerance - 1) {
		// 	setMethod(currentMethod => {
		// 		const newMethod = currentMethod === 'gpsd' ? 'geolocation' : 'gpsd';
		// 		console.log(`Changing location method to ${newMethod}`);
		// 		return newMethod;
		// 	});
		// 	setFailures(0);
		// 	return;
		// }

		setFailures(currentFailures => currentFailures + 1);
		console.log(`Failed to get position via ${method}`);
		console.error(err.type);
	};

	const cleanupGyroscopeData = gyro => ({
		heading: gyro.z,
		climb: gyro.y,
		tilt: gyro.x,
		method
	});

	const cleanupDeviceOrientationData = gyro => ({
		heading: gyro.webkitCompassHeading || gyro.alpha,
		climb: gyro.beta,
		tilt: gyro.gamma,
		method,
		failures
	});

	const getDataFromGyroscope = () => {
		if (navigator?.permissions?.query) {
			navigator.permissions.query({ name: 'gyroscope' })
				.then(permission => {
					if ( permission.state === 'granted' || permission.state === 'prompt' ) {
						console.log('Permission granted');
						gyroscope = new window.Gyroscope({frequency: interval});

						gyroscope.addEventListener('reading', ev => {
							onUpdate(cleanupGyroscopeData(gyroscope));
							console.log(`Angular velocity along the X-axis ${  gyroscope.x}`);
							console.log(`Angular velocity along the Y-axis ${  gyroscope.y}`);
							console.log(`Angular velocity along the Z-axis ${  gyroscope.z}`);
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

			gyroscope = new window.Gyroscope({frequency: interval});

			gyroscope.addEventListener('reading', ev => {
				onUpdate(cleanupGyroscopeData(gyroscope));
				console.log(`Angular velocity along the X-axis ${  gyroscope.x}`);
				console.log(`Angular velocity along the Y-axis ${  gyroscope.y}`);
				console.log(`Angular velocity along the Z-axis ${  gyroscope.z}`);
			});

			gyroscope.start();
		}
	};

	const getDataFromDeviceOrientation = () => {
		if (DeviceMotionEvent.requestPermission) {
			DeviceMotionEvent.requestPermission()
				.then(permission => {
					if (permission === 'granted') {
						setPermitted(true);
						window.addEventListener('deviceorientation', ev => onUpdate(cleanupDeviceOrientationData(ev)), {});
					}
					else {
						setConfirmed(false);
						dataFailure('Device Motion API permission denied');
					}
				})
				.catch(err => {
					if(err.name.includes('NotAllowedError')) setConfirmed(false);
					dataFailure(err);
				});
		}
		else {
			window.addEventListener('deviceorientation', ev => onUpdate(cleanupDeviceOrientationData(ev)));
		}
	};

	const updatePosition = () => {
		if(method === 'orientation') getDataFromDeviceOrientation();
		if(method === 'gyroscope') getDataFromGyroscope();
	};

	useEffect(updatePosition, []);

	if(!permitted && !confirmed) return (
		<Confirm onConfirm={() => {setConfirmed(true); updatePosition();}} onCancel={() => {setConfirmed(true);}}>
			<span
				className="show-unlit"
				unlit={Utility.fillUnlitLCD(3, 20)}
			>
				You must grant permission to access the gyroscope.
			</span>
		</Confirm>);

	return null;
}

export default Gyro;
