import React, { useEffect, useState } from 'react';

import '../../css/digital-clock.css';

export const DigitalClock = props => {
	const [time, setTime] = useState(new Date());

	const updateTime = () => {
		setTime(new Date());
	};

	useEffect(() => {
		const interval = setInterval(updateTime, 1000); // 1 second

		return () => clearInterval(interval);
	}, []);

	return (
		<div id="digital-clock">
			<div id="digital-clock-day">
				<span className={time.getDay() === 0 ? 'current' : ''}>Sun</span>
				<span className={time.getDay() === 1 ? 'current' : ''}>Mon</span>
				<span className={time.getDay() === 2 ? 'current' : ''}>Tue</span>
				<span className={time.getDay() === 3 ? 'current' : ''}>Wed</span>
				<span className={time.getDay() === 4 ? 'current' : ''}>Thu</span>
				<span className={time.getDay() === 5 ? 'current' : ''}>Fri</span>
				<span className={time.getDay() === 6 ? 'current' : ''}>Sat</span>
			</div>
			<div
				id="digital-clock-time"
				unlit={
					Intl
						.DateTimeFormat('en-US', {timeStyle: 'short'})
						.format(time)
						.split('')
						.map(s => [':', ' '].includes(s) ? s : 'ᛤ')
						.join('')
				}
			>
				{Intl.DateTimeFormat('en-US', {timeStyle: 'short'}).format(time)}
			</div>
			<div
				id="digital-clock-date"
				unlit={
					Intl
						.DateTimeFormat('en-US', {dateStyle: 'long'})
						.format(time)
						.split('')
						.map(s => 'ᛤ')
						.join('')
				}
			>
				{Intl.DateTimeFormat('en-US', {dateStyle: 'long'}).format(time)}
			</div>
		</div>
	);
}

export default DigitalClock;
