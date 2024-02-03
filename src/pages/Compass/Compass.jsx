import React, { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import Location from '../../components/Location';
import Gyroscope from '../../components/Gyroscope';
import * as Utility from '../../scripts/utility';
import { selectGPSState, selectSettingState } from '../../store/store.selectors';

import '../../css/compass.css';

export const Compass = (props) => {
	const settings = useSelector(selectSettingState);
	const location = useSelector(selectGPSState);
	// const [location, setLocation] = useState(null);
	const [position, setPosition] = useState(null);

	const getCompassSize = () => {
		const coordinateHeight = document.getElementById('compass-coordinates')?.clientHeight;
		const positionHeight = document.getElementById('compass-positioning')?.clientHeight;
		const topHeight = document.getElementById('top')?.clientHeight;
		const bottomHeight = document.getElementById('bottom')?.clientHeight;
		const contentHeight = document.getElementById('content')?.clientHeight;
		const contentWidth = document.getElementById('content')?.clientWidth;

		return Math.min(contentHeight - topHeight - bottomHeight - positionHeight - coordinateHeight, contentWidth);
	};

	const getDisplayLatitude = () => {
		if (!location?.latitude) return '';

		const direction = location?.latitude >= 0 ? 'N' : 'S';
		const latitude = Math.abs(location?.latitude).toFixed(3);

		return `${latitude}° ${direction}`;
	};

	const getDisplayLongitude = () => {
		if (!location?.longitude) return '';

		const direction = location?.latitude >= 0 ? 'E' : 'W';
		const longitude = Math.abs(location?.longitude).toFixed(3);

		return `${longitude}° ${direction}`;
	};

	const getDisplayAltitude = () => {
		const units = settings.units === 'imperial' ? 'ft' : 'm';
		const value = Math.floor(location?.altitude || 0);
		const sign = value < 0 ? '-' : '';
		let length = value < 0 ? 3 : 4;

		if (units === 'm') length++;

		return `${sign}${String(Math.abs(value)).padStart(length, '0')} ${units}`;
	};

	const getDisplaySpeed = () => {
		const units = settings.units === 'imperial' ? 'mph' : 'km/h';
		const value = Math.floor(location?.speed || 0);
		const sign = value < 0 ? '-' : '';
		let length = value < 0 ? 2 : 3;

		if (units === 'm') length--;

		return `${sign}${String(Math.abs(value)).padStart(length, '0')} ${units}`;
	};

	console.log('GPS', location);

	if (location === null)
		return (
			<div className="loading-screen">
				<Icon.Compass className="big-icon" />
				<div
					id="weather-description"
					className="show-unlit"
					data-unlit={Utility.generateUnlitLCD('Compass loading...')}
				>
					Compass loading...
				</div>
			</div>
		);

	if (location === -1)
		return (
			<div className="loading-screen">
				<Icon.PinMap className="big-icon" />
				<div
					id="weather-description"
					className="show-unlit"
					data-unlit={Utility.generateUnlitLCD('Error getting location')}
				>
					Error getting location
				</div>
			</div>
		);

	return (
		<div id="compass">
			<Gyroscope onUpdate={setPosition} />

			<div id="compass-coordinates">
				<span
					id="compass-coordinates-latitude"
					className="show-unlit"
					data-unlit={Utility.generateUnlitLCD(getDisplayLatitude())}
				>
					{getDisplayLatitude()}
				</span>

				<span
					id="compass-coordinates-longitude"
					className="show-unlit"
					data-unlit={Utility.generateUnlitLCD(getDisplayLongitude())}
				>
					{getDisplayLongitude()}
				</span>
			</div>

			<div id="compass-compass" style={{ height: getCompassSize(), width: getCompassSize() }}>
				<div id="compass-directions" style={{ transform: `rotate(${position?.heading || 0}deg)` }} />
				<div id="compass-tilt" style={{ transform: `rotate(${position?.tilt || 0}deg)` }} />
				<div id="compass-tilt-value">{`${Math.round(position?.tilt || 0)}°`}</div>
				<div id="compass-climb" style={{ backgroundPositionY: `${(-(position?.climb || 0) * 79) / 45 + 50}%` }} />
			</div>

			<div id="compass-positioning">
				<div id="compass-altitude" className="show-unlit" data-unlit={Utility.generateUnlitLCD(getDisplayAltitude())}>
					{getDisplayAltitude()}
					<br />
					{/* <span className="show-unlit" data-unlit={Utility.generateUnlitLCD('Altitude')}>
						Altitude
					</span> */}
				</div>

				<div id="compass-speed" className="show-unlit" data-unlit={Utility.generateUnlitLCD(getDisplaySpeed())}>
					{getDisplaySpeed()}
					<br />
					{/* <span className="show-unlit" data-unlit={Utility.generateUnlitLCD('Velocity')}>
					Velocity
					</span> */}
				</div>
			</div>
		</div>
	);
};

export default Compass;
