import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Utility from '../../scripts/utility';
import { selectSettingState } from '../../store/store.selectors';

export const TopBar = (props) => {
	const settings = useSelector(selectSettingState);
	const [date, setDate] = useState(new Date());
	const [loop, setLoop] = useState(0);

	const updateDate = () => setDate(new Date());

	const getDate = () => {
		const dateStyle = settings.dateFormat === 'long' ? 'medium' : 'short';

		return Intl.DateTimeFormat([], { dateStyle }).format(date);
	};

	const getTime = () => {
		const timeStyle = 'short';
		const hour12 = settings.timeFormat === '12';

		return Intl.DateTimeFormat([], { timeStyle, hour12 }).format(date);
	};

	useEffect(() => {
		setLoop(setInterval(updateDate, 1000)); // 1 second

		return () => clearInterval(loop);
	}, []);

	if (location.pathname.includes('digital-clock')) {
		return null;
	}

	return (
		<div id="top">
			<div className="show-unlit" data-unlit={Utility.generateUnlitLCD(getDate())}>
				{getDate()}
			</div>
			<div className="show-unlit" data-unlit={Utility.generateUnlitLCD(getTime(), [':'])}>
				{getTime()}
			</div>
		</div>
	);
};

export default TopBar;
