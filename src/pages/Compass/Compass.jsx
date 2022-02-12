import React, { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import Location from '../../components/Location';

import '../../css/compass.css';

export const Compass = props => {
	const [location, setLocation] = useState(null);

	const getCompassSize = () => {
		const coordinateHeight = document.getElementById('compass-coordinates')?.clientHeight;
		const positionHeight = document.getElementById('compass-positioning')?.clientHeight;
		const topHeight = document.getElementById('top')?.clientHeight;
		const bottomHeight = document.getElementById('bottom')?.clientHeight;
		const contentHeight = document.getElementById('content')?.clientHeight;
		const contentWidth = document.getElementById('content')?.clientWidth;

		return Math.min(
			contentHeight - topHeight - bottomHeight - positionHeight - coordinateHeight,
			contentWidth,
		);
	};

	const getDisplayLatitude = () => `${Math.abs(location?.latitude).toFixed(3)}° ${location?.latitude >= 0 ? 'N' : 'S'}`;

	const getDisplayLongitude = () =>
		`${Math.abs(location?.longitude).toFixed(3)}° ${location?.longitude >= 0 ? 'E' : 'W'}`;

	if(location === null) return (
		<div id="weather">
			<Location onUpdate={setLocation} />
			<Icon.Compass id="weather-icon" />
			<div id="weather-description">
				Compass loading...
			</div>
		</div>
	);

	if(location === -1) return (
		<div id="weather">
			<Icon.PinMap id="weather-icon" />
			<div id="weather-description">
				Error getting location
			</div>
		</div>
	);

	return (
		<div id="compass">
			<Location onUpdate={setLocation} />
			<div id="compass-coordinates">
				<span id="compass-coordinates-latitude">{getDisplayLatitude()}</span>
				<span id="compass-coordinates-longitude">{getDisplayLongitude()}</span>
			</div>
			<div id="compass-compass" style={{height: getCompassSize(), width: getCompassSize()}}>
				<div id="compass-directions" style={{transform: `rotate(${location?.heading || 0}deg)`}} />
				<div id="compass-tilt" style={{transform: `rotate(${location?.tilt || 0}deg)`}} />
				<div id="compass-tilt-value">{`${Math.round(location?.tilt || 0)}°`}</div>
				<div id="compass-climb" style={{backgroundPositionY: `${-(location?.climb || 0) * 79 / 45 + 50}%`}} />
			</div>
			<div id="compass-positioning">
				<div id="compass-altitude">{`${Math.floor(location?.altitude || 0)} ft`}</div>
				<div id="compass-speed">{`${Math.floor(location?.speed || 0)} mph`}</div>
			</div>
		</div>
	);
}

export default Compass;
