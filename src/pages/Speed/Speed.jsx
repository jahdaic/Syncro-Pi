import React, { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import Location from '../../components/Location';
import * as Utility from '../../scripts/utility';

import '../../css/speed.css';

const resolution = 100; // 100 milliseconds

export const Speed = props => {
	const [time, setTime] = useState(new Date());
	const [speed, setSpeed] = useState(0);
	const [run, setRun] = useState({start: null, end: null, topSpeed: null, to60: null, times: [], speeds: []});

	const getCurrentSpeed = () => String(Math.floor(speed || 0)).padStart(3, '0');

	const getTopSpeed = () => String(Math.floor(run.topSpeed || 0)).padStart(3, '0');

	const getAcceleration = () => run.to60 ? `${run.to60.toFixed(2)} s` : 'N/A';

	// if(!speed && speed !== 0) return (
	// 	<div id="weather">
	// 		<Location onUpdate={location => setSpeed(location?.speed)} />
	// 		<Icon.PinMap id="weather-icon" />
	// 		<div id="weather-description">
	// 				Error getting location
	// 		</div>
	// 	</div>
	// );

	return (
		<div id="speed">
			<Location onUpdate={location => setSpeed(location?.speed)} />
			<div id="speed-speed" className="show-unlit" unlit={Utility.generateUnlitLCD(getCurrentSpeed())}>
				{getCurrentSpeed()}
				<span id="speed-units" className="original-font">
					{localStorage.getItem('units') === 'imperial' ? 'MPH' : 'Km/H'}
				</span>
			</div>
			{/* <hr /> */}
			{/* <div id="speed-stats">
				<div>
					<span className="show-unlit" unlit={Utility.generateUnlitLCD(`${getTopSpeed()} mph`)}>
						{getTopSpeed()} mph
					</span>
					<span className="show-unlit" unlit={Utility.generateUnlitLCD('Top Spd')}>
						Top Spd
					</span>
				</div>
				<div>
					<span className="show-unlit" unlit={Utility.generateUnlitLCD(getAcceleration())}>
						{getAcceleration()}
					</span>
					<span className="show-unlit" unlit={Utility.generateUnlitLCD('00 - 60')}>
						00 - 60
					</span>
				</div>
			</div> */}
		</div>
	);
}

export default Speed;
