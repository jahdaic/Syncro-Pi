import React, { useEffect, useState } from 'react';
import * as Utility from '../scripts/utility';

const failureTolerance = 5;

export const Location = ({interval = 1000, onUpdate, ...props}) => {
	const [method, setMethod] = useState(process.env.REACT_APP_GPSD_SERVER_URL ? 'gpsd' : 'geolocation');
	const [failures, setFailures] = useState(0);

	const dataFailure = err => {
		if(failures >= failureTolerance - 1) {
			setMethod(currentMethod => {
				const newMethod = currentMethod === 'gpsd' ? 'geolocation' : 'gpsd';
				console.log(`Changing location method to ${newMethod}`);
				return newMethod;
			});
			setFailures(0);
			return;
		}

		setFailures(currentFailures => currentFailures + 1);
		console.log(`Failed to get location via ${method}`);
		console.error(err);
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
		fetch(process.env.REACT_APP_GPSD_SERVER_URL)
			.then(response => response.json())
			.then(cleanupGPSData)
			.then(onUpdate)
			.catch(dataFailure);
	};

	const getDataFromGeolocation = () => {
		if ( navigator?.permissions?.query) {
			navigator.permissions.query({ name: 'geolocation' })
				.then(permission => {
					if ( permission.state === 'granted' || permission.state === 'prompt' ) {
						navigator.geolocation.getCurrentPosition(
							location => onUpdate(cleanupGeolocationData(location)),
							dataFailure,
							{enableHighAccuracy: true}
						);
					}
					else {
						dataFailure('Geolocation API permission denied');
					}
				})
				.catch(dataFailure);
		}
		else if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				location => onUpdate(cleanupGeolocationData(location)),
				dataFailure,
				{enableHighAccuracy: true}
			);
		}
	};

	const updateLocation = () => {
		if(method === 'gpsd') getDataFromGPSD();
		if(method === 'geolocation') getDataFromGeolocation();
	};

	useEffect(() => {
		const loop = setInterval(updateLocation, interval); // 1 second default

		return () => clearInterval(loop);
	}, []);

	useEffect(updateLocation, []);

	return null;
}

export default Location;
