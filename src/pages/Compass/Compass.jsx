import React, { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import Location from '../../components/Location';
import Gyroscope from '../../components/Gyroscope';
import * as Utility from '../../scripts/utility';
import { selectGPSState, selectGyroState, selectSettingState } from '../../store/store.selectors';

import '../../css/compass.css';

export const Compass = (props) => {
	const settings = useSelector(selectSettingState);
	const location = useSelector(selectGPSState);
	const gyro = useSelector(selectGyroState);

	const getCompassSize = () => {
		const coordinateHeight = document.getElementById('compass-coordinates')?.clientHeight || 0;
		const positionHeight = document.getElementById('compass-positioning')?.clientHeight || 0;
		const topHeight = document.getElementById('top')?.clientHeight || 0;
		const bottomHeight = document.getElementById('bottom')?.clientHeight || 0;
		const contentHeight = document.getElementById('content')?.clientHeight || 0;
		const contentWidth = document.getElementById('content')?.clientWidth || 0;

		return Math.min(contentHeight - topHeight - bottomHeight - positionHeight - coordinateHeight, contentWidth);
	};

	const getDisplayLatitude = () => {
		// if (!location?.latitude) return '';

		const direction = location?.latitude >= 0 ? 'N' : 'S';
		const latitude = Math.abs(location?.latitude || 0).toFixed(3);

		return <>{latitude}<span className="units">° {direction}</span></>;
	};

	const getDisplayLongitude = () => {
		// if (!location?.longitude) return '';

		const direction = location?.latitude >= 0 ? 'E' : 'W';
		const longitude = Math.abs(location?.longitude || 0).toFixed(3);

		return <>{longitude}<span className="units">° {direction}</span></>;
	};

	const getDisplayAltitude = () => {
		const units = settings.units === 'imperial' ? 'ft' : 'm';
		const value = Math.floor(location?.altitude || 0);
		const sign = value < 0 ? '-' : '';
		let length = value < 0 ? 3 : 4;

		if (units === 'm') length++;

		return <>{sign}{String(Math.abs(value)).padStart(length, '0')}<span className="units"> {units}</span></>;
	};

	const getDisplaySpeed = () => {
		const units = settings.units === 'imperial' ? 'mph' : 'km/h';
		const value = Math.floor(location?.speed || 0);
		const sign = value < 0 ? '-' : '';
		let length = value < 0 ? 2 : 3;

		if (units === 'm') length--;

		return <>{sign}{String(Math.abs(value)).padStart(length, '0')}<span className="units"> {units}</span></>;
	};

	// if (location === null)
	// 	return (
	// 		<div className="loading-screen">
	// 			<Icon.Compass className="big-icon" />
	// 			<div
	// 				className="loading-text show-unlit"
	// 				data-unlit={Utility.generateUnlitLCD('Compass loading...')}
	// 			>
	// 				Compass loading...
	// 			</div>
	// 		</div>
	// 	);

	if (location.failure)
		return (
			<div className="loading-screen">
				<Icon.PinMap className="big-icon" />
				<div
					className="loading-text show-unlit"
					data-unlit={Utility.generateUnlitLCD('Error getting location')}
				>
					Error getting location
				</div>
			</div>
		);

	return (
		<div id="compass">
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
				<div id="compass-directions" style={{ transform: `rotate(${gyro?.heading || location?.heading || 0}deg)` }} />
				<div id="compass-tilt" style={{ transform: `rotate(${gyro?.tilt || location?.tilt || 0}deg)` }} />
				<div id="compass-tilt-value">{`${Math.round(gyro?.tilt || location?.tilt || 0)}°`}</div>
				<div
					id="compass-climb"
					style={{ backgroundPositionY: `${(-(gyro?.climb || location?.climb || 0) * 79) / 45 + 50}%` }}
				/>
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
