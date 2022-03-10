import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Confirm from './Confirm';
import * as Utility from '../scripts/utility';

const failureTolerance = 3;
const validMethods = ['geolocation'];

if(process.env.REACT_APP_GPSD_SERVER_URL) validMethods.unshift('gpsd');

export const Location = ({interval = 1000, onUpdate, ...props}) => {
	const [method, setMethod] = useState(validMethods[0]);
	const [failedMethods, setFailedMethods] = useState([]);
	const [permitted, setPermitted] = useState(false);
	const [confirmed, setConfirmed] = useState(true);
	const [failures, setFailures] = useState(0);

	const dataFailure = (err, forceNext) => {
		console.log('Failure', method, failures, failureTolerance, forceNext, new Date().toLocaleTimeString());

		setFailures(currentFailures => {
			if(currentFailures >= failureTolerance - 1 || forceNext) {
				setMethod(currentMethod => {
					const newMethod = validMethods.find(m => !failedMethods.includes(m) && m !== currentMethod);

					if(!newMethod) return currentMethod;

					console.log(`Changing location method to ${newMethod}`);
					setFailedMethods(currentFailedMethods => [...currentFailedMethods, currentMethod]);
					return newMethod;
				});
			}
			else {
				console.log(`Failed to get location via ${method}`);
				console.error(err);
				return currentFailures + 1;
			}

			return currentFailures;
		});
	};

	const cleanupGPSData = response => ({
		latitude: response.lat,
		longitude: response.lon,
		altitude: Utility.metersToFeet(response.alt),
		heading: response.track,
		climb: response.climb,
		tilt: 0,
		speed: Utility.mpsToMPH(response.speed),
		accuracy: Utility.metersToFeet(Math.max(response.epx, response.epy)),
		altitudeAccuracy: Utility.metersToFeet(response.epv),
		method
	});

	const cleanupGeolocationData = location => ({
		latitude: location.coords.latitude,
		longitude: location.coords.longitude,
		altitude: Utility.metersToFeet(location.coords.altitude),
		heading: location.coords.heading,
		climb: 0,
		tilt: 0,
		speed: Utility.mpsToMPH(location.coords.speed),
		accuracy: Utility.metersToFeet(location.coords.accuracy),
		altitudeAccuracy: Utility.metersToFeet(location.coords.altitudeAccuracy),
		method
	});

	const getDataFromGPSD = () => {
		fetch(`${process.env.REACT_APP_GPSD_SERVER_URL}/gps`)
			.then(response => response.json())
			.then(cleanupGPSData)
			.then(onUpdate)
			.then(() => setTimeout(updateLocation, interval, method))
			.catch(dataFailure);
	};

	const getDataFromGeolocation = () => {
		if ( navigator?.permissions?.query) {
			navigator.permissions.query({ name: 'geolocation' })
				.then(permission => {
					if ( permission.state === 'granted' || permission.state === 'prompt' ) {
						setPermitted(true);
						navigator.geolocation.getCurrentPosition(
							location => {
								onUpdate(cleanupGeolocationData(location));
								setTimeout(updateLocation, interval);
							},
							dataFailure,
							{enableHighAccuracy: true}
						);
					}
					else {
						setConfirmed(false);
						dataFailure('Geolocation API permission denied by system');
					}
				})
				.catch(err => {
					if(!permitted) setConfirmed(false);
					else dataFailure(err);
				});
		}
		else if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				location => {
					onUpdate(cleanupGeolocationData(location));
					setTimeout(updateLocation, interval);
				},
				dataFailure,
				{enableHighAccuracy: true}
			);
		}
	};

	const updateLocation = (currentMethod = method) => {
		if(currentMethod === 'gpsd') getDataFromGPSD();
		if(currentMethod === 'geolocation') getDataFromGeolocation();
	};

	// useEffect(() => {
	// 	console.log(`Setting timeout from ${new Date().toLocaleTimeString()} - ${failures}/${method}/${failedMethods}`);
	// 	setTimeout(() => updateLocation(method), interval)
	// }, [failures]);

	useEffect(() => setFailures(0), [method]);

	useEffect(() => updateLocation(method), []);

	if(method === 'geolocation' && !permitted && !confirmed) return (
		<Confirm
			onConfirm={() => {
				setConfirmed(true);
				updateLocation();
			}}
			onCancel={() => {
				setConfirmed(true);
				dataFailure('Geolocation API permission denied by user', true);
			}}
		>
			<span
				className="show-unlit"
				unlit={Utility.fillUnlitLCD(3, 20)}
			>
				You must grant permission to access GPS.
			</span>
		</Confirm>);

	return null;
}

Location.propTypes = {
	interval: PropTypes.number,
	onUpdate: PropTypes.func.isRequired,
};

Location.defaultProps = {
	interval: 1000,
};


export default Location;