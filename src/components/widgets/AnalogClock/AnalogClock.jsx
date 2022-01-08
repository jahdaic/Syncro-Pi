import React, { useEffect, useState } from 'react';
import Clock from 'react-clock';

import '../../../css/clock.css';

export const AnalogClock = props => {
	const [time, setTime] = useState(new Date());

	const getClockSize = () => {
		const containerHeight = document.getElementById('content')?.clientHeight;
		const containerWidth = document.getElementById('content')?.clientWidth;
		const screenHeight = document.getElementsByTagName('body')[0].clientHeight;
		const screenWidth = document.getElementsByTagName('body')[0].clientWidth;

		return Math.min(containerHeight, containerWidth, screenHeight, screenWidth) * 0.75;
	};

	const updateTime = () => {
		setTime(new Date());
	};

	useEffect(() => {
		const interval = setInterval(updateTime, 1000); // 1 second

		return () => clearInterval(interval);
	}, []);

	return (
		<div id="analog-clock">
			<Clock value={time} size={getClockSize()} />
		</div>
	);
}

export default AnalogClock;
