import React, { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import * as Utility from '../../scripts/utility';

import '../../css/performance.css';

const resolution = 250; // 100 milliseconds

export const Performance = props => {
	const [time, setTime] = useState(new Date());
	const [speed, setSpeed] = useState(null);
	const [run, setRun] = useState({start: null, end: null, times: [], speeds: []});

	const updateTime = () => {
		setTime(new Date());
	};

	useEffect(() => {
		const interval = setInterval(updateTime, 1000); // 1 second

		return () => clearInterval(interval);
	}, []);

	const logTime = () => {
		navigator.geolocation.getCurrentPosition(location => {
			setRun(currentRun => {
				if(currentRun.end) return{...currentRun};

				const now = Date.now();

				setSpeed(location.coords.speed);
				setTimeout(logTime, resolution);

				return {
					...currentRun,
					start: currentRun.start || now,
					times: [...currentRun.times, now],
					speeds: [...currentRun.speeds, location.coords.speed || 0]
				};
			});
		}, err => {
			console.error(err);
			setSpeed(-1);
			endTimer();
		}, {enableHighAccuracy: true});
	}

	const endTimer = () => setRun(currentRun => ({ ...currentRun, end: Date.now() }));

	const resetTimer = () => setRun({start: null, end: null, times: [], speeds: []});

	const getTopSpeed = () => Utility.mpsToMPH(run.speeds.reduce((a, b) => Math.max(a, b), 0) || 0);

	const getAcceleration = () => {
		let timeTo60 = null;

		run.speeds.forEach((s, i) => {
			if( Utility.mpsToMPH(s) >= 60 ) timeTo60 = run.times[i]; 
		});

		if(timeTo60 === null) return 'N/A';

		return `${Number((timeTo60 - run.start) / 1000).toFixed(2)} s`;
	};

	const getDisplayTime = () => {
		const now = Date.now();
		const duration = (run.end || now) - (run.start || now);
		const minutes = String(Math.floor(duration / 1000 / 60) || 0).padStart(2, '0');
		const seconds = String(Math.floor(duration / 1000 % 60) || 0).padStart(2, '0');
		const milliseconds = String(duration % 1000 || 0).padStart(3, '0');

		return `${minutes}:${seconds}.${milliseconds}`;
	};

	const updatePosition = () => {
		if(!navigator.geolocation) return;
		
		navigator.geolocation.getCurrentPosition(location => {
			setSpeed(location.coords.speed);
		}, err => {
			console.error(err);
			setSpeed(-1);
		}, {enableHighAccuracy: true});
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
				.catch(err => {
					console.log(err);
					setSpeed(-1);
				});
		}
		else if (navigator.geolocation) {
			updatePosition();
		}
	};

	useEffect(askForLocationPermission, []);

	console.log(speed, run);

	if(speed === -1)  return (
		<div id="weather">
			<Icon.PinMap id="weather-icon" />
			<div id="weather-description">
					Error getting location
			</div>
		</div>
	);

	return (
		<div id="performance">
			<div id="performance-speed">
				{`${speed || '000'}`}
			</div>
			<div id="performance-stats">
				<div>
					<span>{getTopSpeed()} mph</span>
					<span>Top Spd</span>
				</div>
				<div>
					<span>{getAcceleration()}</span>
					<span>0-60</span>
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
			<div id="performance-timer">
				{getDisplayTime()}
			</div>
			<div id="performance-buttons">
				{
					run.start && !run.end ?
						<button type="button" onClick={endTimer}>
							Stop 
						</button> :
						<button type="button" onClick={logTime}>
							Start
						</button>
				}
				<button type="button" onClick={resetTimer}>
					Reset
				</button>
			</div>
		</div>
	);
}

export default Performance;
