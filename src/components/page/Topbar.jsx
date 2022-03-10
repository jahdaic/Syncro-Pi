import React, { useEffect, useState } from 'react';
import * as Utility from '../../scripts/utility';

export const TopBar = props => {
	const [date, setDate] = useState(new Date());
	const [dateFormat, setDateFormat] = useState(localStorage.getItem('date-format') || 'long');
	const [timeFormat, setTimeFormat] = useState(localStorage.getItem('time-format') || '12');

	const updateDate = () => {
		setDate(new Date());
	};

	const getDate = () => {
		const dateStyle = dateFormat === 'long' ? 'medium' : 'short';

		return Intl.DateTimeFormat([], { dateStyle }).format(date);
	};

	const getTime = () => {
		const timeStyle = 'short';
		const hour12 = timeFormat === '12';

		return Intl.DateTimeFormat([], { timeStyle, hour12 }).format(date);
	};

	useEffect(() => {
		setDateFormat(localStorage.getItem('date-format'));
	}, [localStorage.getItem('date-format')]);

	useEffect(() => {
		setTimeFormat(localStorage.getItem('time-format'));
	}, [localStorage.getItem('time-format')]);

	useEffect(() => {
		const interval = setInterval(updateDate, 1000); // 1 second

		return () => clearInterval(interval);
	}, []);

	if(location.pathname.includes('digital-clock')) {
		return null;
	}

	return (
		<div id="top">
			<div className="show-unlit" unlit={Utility.generateUnlitLCD(getDate())}>
				{getDate()}
			</div>
			<div className="show-unlit" unlit={Utility.generateUnlitLCD(getTime(), [':'])}>
				{getTime()}
			</div>
		</div>
	);
}

export default TopBar;
