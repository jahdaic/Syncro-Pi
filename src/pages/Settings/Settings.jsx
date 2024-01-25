import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from 'react-select';
import * as Utility from '../../scripts/utility';

import '../../css/settings.css';

const themes = [
	{ value: 'base', label: 'White' },
	{ value: 'dark', label: 'Dim White' },
	{ value: 'red', label: 'Red' },
	{ value: 'green', label: 'Green' },
	{ value: 'white', label: 'Inverse' },
	{ value: 'lcd', label: 'LCD' },
	{ value: 'lcd-black', label: 'Inverse LCD' },
	{ value: 'lcd-red', label: 'Red LCD' },
	{ value: 'lcd-blue', label: 'Blue LCD' },
];

const units = [
	{ value: 'imperial', label: 'Imperial' },
	{ value: 'metric', label: 'Metric' },
];

const timeFormats = [
	{ value: '12', label: '12-Hour' },
	{ value: '24', label: '24-Hour' },
];

const dateFormats = [
	{ value: 'long', label: 'Long' },
	{ value: 'short-imperial', label: 'Short' },
];

const dropdownStyle = {
	control: (provided, state) => ({
		...provided,
		backgroundColor: 'rgb(var(--text-color))',
		padding: '0.5em',
		border: 'none',
		borderRadius: '10px',
	}),
	singleValue: (provided, state) => ({
		...provided,
		color: 'rgb(var(--bg-color))',
	}),
	dropdownIndicator: (provided, state) => ({
		...provided,
		svg: {
			fill: 'rgb(var(--bg-color)) !important',
			height: '1em',
			width: '1em',
			paddingLeft: '0.5em',
		},
	}),
	menu: (provided, state) => ({
		...provided,
		backgroundColor: 'rgb(var(--text-color))',
		padding: '0.5em',
		border: '1px solid rgb(var(--bg-color))',
		borderRadius: '10px',
	}),
	menuList: (provided, state) => ({
		...provided,
		color: 'rgb(var(--bg-color))',
	}),
	option: (provided, state) => ({
		...provided,
		color: state.isFocused ? 'rgb(var(--text-color))' : 'rgb(var(--bg-color))',
		backgroundColor: state.isFocused ? 'rgb(var(--bg-color))' : 'transparent',
		padding: '0.5em 0',
		borderRadius: '10px',
	}),
};

export const Settings = ({ onThemeChange, ...props }) => {
	const navigate = useNavigate();
	const [theme, setTheme] = useState('lcd');
	const [unit, setUnit] = useState('imperial');
	const [timeFormat, setTimeFormat] = useState('12');
	const [dateFormat, setDateFormat] = useState('long');

	const saveSettings = () => {
		onThemeChange(theme.value);

		localStorage.setItem('theme', theme.value);
		localStorage.setItem('units', unit.value);
		localStorage.setItem('time-format', timeFormat.value);
		localStorage.setItem('date-format', dateFormat.value);

		navigate(`/${localStorage.getItem('page') || ''}`);
	};

	useEffect(() => {
		if (localStorage.getItem('theme')) setTheme(themes.find((x) => x.value === localStorage.getItem('theme')));

		if (localStorage.getItem('units')) setUnit(units.find((x) => x.value === localStorage.getItem('units')));

		if (localStorage.getItem('time-format'))
			setTimeFormat(timeFormats.find((x) => x.value === localStorage.getItem('time-format')));

		if (localStorage.getItem('date-format'))
			setDateFormat(dateFormats.find((x) => x.value === localStorage.getItem('date-format')));
	}, []);

	return (
		<div id="settings">
			<div id="settings-options">
				<span>
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label htmlFor="settings-theme" className="show-unlit" data-unlit={Utility.generateUnlitLCD('Theme', [], 16)}>
						Theme
					</label>
					<Select
						id="settings-theme"
						className="select"
						value={theme}
						onChange={(opt) => {
							onThemeChange(opt.value);
							setTheme(opt);
						}}
						options={themes}
						styles={dropdownStyle}
						isSearchable={false}
					/>
				</span>

				<span className="disabled">
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label htmlFor="settings-unit" className="show-unlit" data-unlit={Utility.generateUnlitLCD('Units', [], 16)}>
						Units
					</label>
					<Select
						id="settings-unit"
						className="select"
						value={unit}
						onChange={(opt) => setUnit(opt)}
						options={units}
						styles={dropdownStyle}
						isSearchable={false}
					/>
				</span>

				<span>
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label
						htmlFor="settings-time-format"
						className="show-unlit"
						data-unlit={Utility.generateUnlitLCD('Time Format', [], 16)}
					>
						Time Format
					</label>
					<Select
						id="settings-time-format"
						className="select"
						value={timeFormat}
						onChange={(opt) => setTimeFormat(opt)}
						options={timeFormats}
						styles={dropdownStyle}
						isSearchable={false}
					/>
				</span>

				<span>
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label
						htmlFor="settings-date-format"
						className="show-unlit"
						data-unlit={Utility.generateUnlitLCD('Date Format', [], 16)}
					>
						Date Format
					</label>
					<Select
						id="settings-date-format"
						className="select"
						value={dateFormat}
						onChange={(opt) => setDateFormat(opt)}
						options={dateFormats}
						styles={dropdownStyle}
						isSearchable={false}
					/>
				</span>
			</div>

			<div id="settings-buttons">
				<button type="button" onClick={saveSettings} style={{ width: '50%' }}>
					Save
				</button>
			</div>
		</div>
	);
};

Settings.propTypes = {
	onThemeChange: PropTypes.func.isRequired,
};

Settings.defaultProps = {};

export default Settings;
