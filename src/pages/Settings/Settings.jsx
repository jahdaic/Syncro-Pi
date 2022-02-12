import React, {  useState } from 'react';
import { useNavigate } from 'react-router-dom';


import '../../css/settings.css';

export const Settings = ({onColorChange, ...props}) => {
	const navigate = useNavigate();
	const [theme, setTheme] = useState(localStorage.getItem('color') || 'base');
	const [units, setUnits] = useState(localStorage.getItem('units') || 'imperial');
	const [timeFormat, setTimeFormat] = useState(localStorage.getItem('time-format') || '12');
	const [dateFormat, setDateFormat] = useState(localStorage.getItem('date-format') || 'long');

	const saveSettings = () => {
		onColorChange(theme);

		localStorage.setItem('color', theme);
		localStorage.setItem('units', units);
		localStorage.setItem('time-format', timeFormat);
		localStorage.setItem('date-format', dateFormat);

		navigate(`/${localStorage.getItem('page')}`);
	};

	const cancelSettings = () => {
		navigate(`/${localStorage.getItem('page')}`);
	};

	return (
		<div id="settings">
			<div id="settings-options">
				{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
				<label>
					Theme
					<select id="settings-theme" value={theme} onChange={ev => setTheme(ev.target.value)}>
						<option value="base">Base</option>
						<option value="dark">Dark</option>
						<option value="red">Red</option>
						<option value="green">Green</option>
						<option value="white">White</option>
						<option value="lcd">LCD</option>
						<option value="lcd-red">Red LCD</option>
						<option value="lcd-blue">Blue LCD</option>
					</select>
				</label>

				{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
				<label>
					Units
					<select id="settings-theme" value={units} onChange={ev => setUnits(ev.target.value)}>
						<option value="imperial">Imperial</option>
						<option value="metric">Metric</option>
					</select>
				</label>

				{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
				<label>
					Time Format
					<select id="settings-theme" value={timeFormat} onChange={ev => setTimeFormat(ev.target.value)}>
						<option value="12">12-Hour</option>
						<option value="24">24-Hour</option>
					</select>
				</label>

				{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
				<label>
					Date Format
					<select id="settings-theme" value={dateFormat} onChange={ev => setDateFormat(ev.target.value)}>
						<option value="long">Long Format</option>
						<option value="short-imperial">Short Format m/d/y</option>
						<option value="short-metric">Short Format d/m/y</option>
					</select>
				</label>
			</div>

			<div id="settings-buttons">
				<button type="button" onClick={saveSettings}>
					Save
				</button>
				<button type="button" onClick={cancelSettings}>
					Back
				</button>
			</div>
		</div>
	);
}

export default Settings;
