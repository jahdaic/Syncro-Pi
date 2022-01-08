import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const TopBar = props => {
	const [date, setDate] = useState(new Date());

	const updateDate = () => {
		setDate(new Date());
	};

	useEffect(() => {
		const interval = setInterval(updateDate, 15000); // 15 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<div id="top">
			<div>{Intl.DateTimeFormat([], { dateStyle: 'medium' }).format(date)}</div>
			<div>{Intl.DateTimeFormat([], { timeStyle: 'short' }).format(date)}</div>
		</div>
	);
}

export default TopBar;
