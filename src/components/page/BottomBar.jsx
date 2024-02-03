import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Icon from 'react-bootstrap-icons';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { themeList } from '../../pages/Settings/Settings';
import { selectSettingState, selectSystemState, selectTimestampState } from '../../store/store.selectors';
import storeActions from '../../store/store.redux';

export const BottomBar = ({ color, ...props }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const system = useSelector(selectSystemState);
	const settings = useSelector(selectSettingState);
	const views = [
		'analog-clock',
		'digital-clock',
		'speed',
		'compass',
		'weather',
		'performance',
		'spotify',
		'hula',
		// 'test',
	];
	const themes = themeList.map((t) => t.value);

	const prevView = (ev) => {
		ev.preventDefault();

		const currentIndex = views.indexOf(system.view);
		const newView = currentIndex === 0 ? views[views.length - 1] : views[currentIndex - 1];

		navigate(newView);
		dispatch(storeActions.setSystem({ view: newView }));
	};

	const nextView = (ev) => {
		ev.preventDefault();

		const currentIndex = views.indexOf(system.view);
		const newView = currentIndex === views.length - 1 ? views[0] : views[currentIndex + 1];

		navigate(newView);
		dispatch(storeActions.setSystem({ view: newView }));
	};

	const nextTheme = (ev) => {
		ev.preventDefault();

		const currentIndex = themes.indexOf(settings.theme);
		const newTheme = currentIndex === themes.length - 1 ? themes[0] : themes[currentIndex + 1];

		dispatch(storeActions.setSettings({ theme: newTheme }));
	};

	const viewSettings = () => {
		navigate('settings');
	};

	useHotkeys('left', prevView);
	useHotkeys('right', nextView);
	useHotkeys('c', nextTheme);

	if (location.pathname.includes('settings')) {
		return null;
	}

	return (
		<div id="bottom">
			<div onClick={prevView} onKeyDown={prevView} role="button" alt="Previous Page" tabIndex={-1}>
				<Icon.CaretLeftFill />
			</div>
			<div onClick={viewSettings} onKeyDown={viewSettings} role="button" alt="Settings" tabIndex={-1}>
				<Icon.GearFill />
			</div>
			<div onClick={nextView} onKeyDown={nextView} role="button" alt="Next Page" tabIndex={-1}>
				<Icon.CaretRightFill />
			</div>
		</div>
	);
};

BottomBar.propTypes = {
	color: PropTypes.string,
};

BottomBar.defaultProps = {
	color: 'white',
};

export default BottomBar;
