import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Utility from '../../scripts/utility';
import { selectSettingState } from '../../store/store.selectors';

import '../../css/digital-clock.css';

export const DigitalClock = (props) => {
	const settings = useSelector(selectSettingState);
	const [time, setTime] = useState(new Date());

	const updateTime = () => {
		setTime(new Date());
	};

	const getTime = () => {
		const timeStyle = 'short';
		const hour12 = settings.timeFormat === '12';

		return Intl.DateTimeFormat([], { timeStyle, hour12 }).format(time);
	};

	const getDayClass = (date) => {
		const baseClasses = ['original-font'];
		const classes = [...baseClasses, time.getDay() === date ? 'current' : ''];

		return classes.join(' ');
	};

	useEffect(() => {
		const interval = setInterval(updateTime, 1000); // 1 second

		return () => clearInterval(interval);
	}, []);

	return (
		<div id="digital-clock">
			<div id="digital-clock-day" className="original-font">
				<span className={getDayClass(0)}>Sun</span>
				<span className={getDayClass(1)}>Mon</span>
				<span className={getDayClass(2)}>Tue</span>
				<span className={getDayClass(3)}>Wed</span>
				<span className={getDayClass(4)}>Thu</span>
				<span className={getDayClass(5)}>Fri</span>
				<span className={getDayClass(6)}>Sat</span>
			</div>

			<div id="digital-clock-time" className="show-unlit" data-unlit={Utility.generateUnlitLCD(getTime(), [':', ' '])}>
				{getTime()}
			</div>

			<div
				id="digital-clock-date"
				className="show-unlit"
				data-unlit={Utility.generateUnlitLCD(Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(time))}
			>
				{Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(time)}
			</div>
		</div>
	);
};

export default DigitalClock;
