/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import * as Utility from '../../scripts/utility';
import { selectSettingState, selectSystemState } from '../../store/store.selectors';

import '../../css/settings.css';
import storeActions from '../../store/store.redux';

export const themeList = [
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

export const unitList = [
	{ value: 'imperial', label: 'Imperial' },
	{ value: 'metric', label: 'Metric' },
];

export const timeFormatList = [
	{ value: '12', label: '12-Hour' },
	{ value: '24', label: '24-Hour' },
];

export const dateFormatList = [
	{ value: 'long', label: 'Long' },
	{ value: 'short-imperial', label: 'Short' },
];

export const dropdownStyle = {
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

export const Settings = ({ ...props }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const system = useSelector(selectSystemState);
	const settings = useSelector(selectSettingState);

	const saveSettings = () => {
		navigate(`/${system.view || ''}`);
	};

	console.log('SETTINGS', settings);

	return (
		<div id="settings">
			<div id="settings-options">
				<span>
					<label htmlFor="settings-theme" className="show-unlit" data-unlit={Utility.generateUnlitLCD('Theme', [], 16)}>
						Theme
					</label>
					<Select
						id="settings-theme"
						className="select"
						value={themeList.find((t) => t.value === settings.theme)}
						onChange={(opt) => dispatch(storeActions.setSettings({ theme: opt.value }))}
						options={themeList}
						styles={dropdownStyle}
						isSearchable={false}
					/>
				</span>

				<span className="disabled">
					<label htmlFor="settings-unit" className="show-unlit" data-unlit={Utility.generateUnlitLCD('Units', [], 16)}>
						Units
					</label>
					<Select
						id="settings-unit"
						className="select"
						value={unitList.find((u) => u.value === settings.units)}
						onChange={(opt) => dispatch(storeActions.setSettings({ units: opt.value }))}
						options={unitList}
						styles={dropdownStyle}
						isSearchable={false}
					/>
				</span>

				<span>
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
						value={timeFormatList.find((f) => f.value === settings.timeFormat)}
						onChange={(opt) => dispatch(storeActions.setSettings({ timeFormat: opt.value }))}
						options={timeFormatList}
						styles={dropdownStyle}
						isSearchable={false}
					/>
				</span>

				<span>
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
						value={dateFormatList.find((f) => f.value === settings.dateFormat)}
						onChange={(opt) => dispatch(storeActions.setSettings({ dateFormat: opt.value }))}
						options={dateFormatList}
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
