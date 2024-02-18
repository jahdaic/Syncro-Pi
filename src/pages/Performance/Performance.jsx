import React, { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import Location from '../../components/Location';
import * as Utility from '../../scripts/utility';
import { selectGPSState } from '../../store/store.selectors';


import '../../css/performance.css';

const resolution = 100; // 100 milliseconds

export const Performance = (props) => {
	const gps = useSelector(selectGPSState);
	const [time, setTime] = useState(new Date());
	const [run, setRun] = useState({ start: null, end: null, topSpeed: null, to60: null, times: [], speeds: [] });

	const updateTime = () => setTime(new Date());

	const logTime = () => {
		setRun((currentRun) => {
			if (currentRun.end) return { ...currentRun };

			const now = Date.now();
			setTimeout(logTime, resolution);

			return {
				...currentRun,
				start: currentRun.start || now,
				topSpeed: Math.max(gps?.speed, currentRun.topSpeed),
				to60: gps?.speed >= 60 && !currentRun.to60 ? gps?.speed : currentRun.to60,
				// times: [...currentRun.times, now],
				// speeds: [...currentRun.speeds, currentSpeed || 0]
			};
		});
	};

	const endTimer = () => setRun((currentRun) => ({ ...currentRun, end: Date.now() }));

	const restartTimer = () => {
		setRun((currentRun) => ({ ...currentRun, end: null }));
		logTime();
	};

	const resetTimer = () => setRun({ start: null, end: null, topSpeed: null, to60: null, times: [], speeds: [] });

	const getCurrentSpeed = () => String(Math.floor(gps.speed || 0)).padStart(3, '0');

	const getTopSpeed = () => String(Math.floor(run.topSpeed || 0)).padStart(3, '0');

	const getAcceleration = () => (run.to60 ? `${run.to60.toFixed(2)} s` : 'N/A');

	const getDisplayTime = () => {
		const now = Date.now();
		const duration = (run.end || now) - (run.start || now);
		const minutes = String(Math.floor(duration / 1000 / 60) || 0).padStart(2, '0');
		const seconds = String(Math.floor((duration / 1000) % 60) || 0).padStart(2, '0');
		const milliseconds = String(duration % 1000 || 0).padStart(3, '0');

		return `${minutes}:${seconds}.${milliseconds}`;
	};

	useEffect(() => {
		const interval = setInterval(updateTime, 1000); // 1 second

		return () => clearInterval(interval);
	}, []);

	if (gps.failure)
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
		<div id="performance">
			<div id="performance-speed" className="show-unlit" data-unlit={Utility.generateUnlitLCD(getCurrentSpeed())}>
				{getCurrentSpeed()}
			</div>
			<hr />
			<div id="performance-stats">
				<div>
					<span className="show-unlit" data-unlit={Utility.generateUnlitLCD(`${getTopSpeed()} mph`)}>
						{getTopSpeed()} mph
					</span>
					<span className="show-unlit" data-unlit={Utility.generateUnlitLCD('Top Spd')}>
						Top Spd
					</span>
				</div>
				<div>
					<span className="show-unlit" data-unlit={Utility.generateUnlitLCD(getAcceleration())}>
						{getAcceleration()}
					</span>
					<span className="show-unlit" data-unlit={Utility.generateUnlitLCD('00 - 60')}>
						00 - 60
					</span>
				</div>
				{/* <div>
					<span>1.2 G</span>
					<span>Top Acc</span>
				</div>
				<div>
					<span>12.3 s</span>
					<span>0-120</span>
				</div> */}
			</div>
			<hr />
			<div id="performance-timer" className="show-unlit" data-unlit={Utility.generateUnlitLCD(getDisplayTime(), [':'])}>
				{getDisplayTime()}
			</div>
			<div id="performance-buttons">
				{run.start && !run.end ? (
					<button type="button" onClick={endTimer}>
						Stop
					</button>
				) : (
					<button type="button" onClick={run.end ? restartTimer : logTime}>
						Start
					</button>
				)}
				<button type="button" onClick={resetTimer}>
					Reset
				</button>
			</div>
		</div>
	);
};

export default Performance;
