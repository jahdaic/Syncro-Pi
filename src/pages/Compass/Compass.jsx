import React, { useEffect, useState } from 'react';

import '../../css/compass.css';

export const Compass = props => {
	const [position, setPosition] = useState({
		heading: 0,
		tilt: 0,
		climb: 0,
		latitude: 0,
		longitude: 0,
		altitude: 0,
		speed: 0,
		accuracy: 0,
		altitudeAccuracy: 0
	});

	const getCompassSize = () => {
		const containerHeight = document.getElementById('content')?.clientHeight;
		const containerWidth = document.getElementById('content')?.clientWidth;
		const screenHeight = document.getElementsByTagName('body')[0].clientHeight;
		const screenWidth = document.getElementsByTagName('body')[0].clientWidth;

		return Math.min(containerHeight, containerWidth, screenHeight, screenWidth) * 0.8;
	};

	const getDisplayLatitude = () => `${Math.abs(position.latitude).toFixed(3)}° ${position.latitude >= 0 ? 'N' : 'S'}`;

	const getDisplayLongitude = () =>
		`${Math.abs(position.longitude).toFixed(3)}° ${position.longitude >= 0 ? 'E' : 'W'}`;

	const getDisplayAltitude = () => {
		const altitude = Math.round(position.altitude);
		const accuracy = position.altitudeAccuracy ? Math.round(position.altitudeAccuracy * 3.28084) : 0;

		return `${altitude} ${accuracy ? `±${accuracy}` : ''}ft`;
	}

	const updatePosition = () => {
		if(!navigator.geolocation) return;
		
		navigator.geolocation.getCurrentPosition(location => {
			const {heading, latitude, longitude, altitude, speed, accuracy, altitudeAccuracy} = location.coords;

			setPosition(prev => ({
				...prev,
				heading: prev.heading + Math.random() * (15 + 15) - 15,
				tilt: prev.tilt + Math.random() * (3 + 3) - 3,
				climb: prev.climb + Math.random() * (3 + 3) - 3,
				latitude, longitude, altitude, speed, accuracy, altitudeAccuracy
			}));
		}, () => {}, {enableHighAccuracy: true});
	};

	const askForLocationPermission = () => {
		// updatePosition();
		if ( navigator.permissions && navigator.permissions.query) {
			navigator.permissions.query({ name: 'geolocation' })
				.then(result => {
					if ( result.state === 'granted' || result.state === 'prompt' ) {
						updatePosition();
					}
				})
				.catch(err => {console.log(err)});
		}
		else if (navigator.geolocation) {
			updatePosition();
		}
	};

	useEffect(() => {
		const interval = setInterval(askForLocationPermission, 1000); // 1 second

		return () => clearInterval(interval);
	}, []);

	useEffect(askForLocationPermission, []);

	console.log(position);

	return (
		<div id="compass">
			<div id="compass-coordinates">
				<span id="compass-coordinates-latitude">{getDisplayLatitude()}</span>
				<span id="compass-coordinates-longitude">{getDisplayLongitude()}</span>
			</div>
			<div id="compass-compass" style={{height: getCompassSize(), width: getCompassSize()}}>
				<div id="compass-directions" style={{transform: `rotate(${position.heading}deg)`}} />
				<div id="compass-tilt" style={{transform: `rotate(${position.tilt}deg)`}} />
				<div id="compass-tilt-value">{`${Math.round(position.tilt || 0)}°`}</div>
				<div id="compass-climb" style={{backgroundPositionY: `${-position.climb * 79 / 45 + 50}%`}} />
			</div>
			<div id="compass-positioning">
				<div id="compass-altitude">{getDisplayAltitude()}</div>
				<div id="compass-altitude-accuracy">{`+/- ${Math.round(position.accuracy * 3.28084)} ft`}</div>
			</div>
		</div>
	);
}

export default Compass;
