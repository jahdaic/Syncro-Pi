import React, { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import Location from '../../components/Location';
import * as Utility from '../../scripts/utility';
import { selectGPSState, selectSettingState } from '../../store/store.selectors';

import '../../css/speed.css';

const resolution = 100; // 100 milliseconds

export const Speed = (props) => {
	const settings = useSelector(selectSettingState);
	const gps = useSelector(selectGPSState);
	const [time, setTime] = useState(new Date());
	const [run, setRun] = useState({ start: null, end: null, topSpeed: null, to60: null, times: [], speeds: [] });

	const getCurrentSpeed = () => String(Math.floor(gps?.speed || 0)).padStart(3, '0');

	return (
		<div id="speed">
			<div id="speed-speed" className="show-unlit" data-unlit={Utility.generateUnlitLCD(getCurrentSpeed())}>
				{getCurrentSpeed()}
				<span id="speed-units" className="original-font">
					{settings.units === 'imperial' ? 'MPH' : 'Km/H'}
				</span>
			</div>
		</div>
	);
};

export default Speed;
