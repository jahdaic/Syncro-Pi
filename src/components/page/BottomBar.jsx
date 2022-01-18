import React, {useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Icon from 'react-bootstrap-icons';
import { useHotkeys } from 'react-hotkeys-hook';

export const BottomBar = ({ color, onColorChange, ...props }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [lastUpdate, setLastUpdated] = useState(null);
	const view = location.pathname.split('/')[1] || 'analog-clock';
	const views = ['analog-clock', 'weather', 'spotify', 'hula'];
	const colors = ['white', 'dark', 'red', 'green'];

	const prevView = () => {
		const currentIndex = views.indexOf(view);
		const newView = currentIndex === 0 ? views[views.length - 1] : views[currentIndex - 1];

		console.log('Prev View', view, currentIndex, newView );

		navigate(newView);
		setLastUpdated(Date.now());
	};

	const nextView = () => {
		const currentIndex = views.indexOf(view);
		const newView = currentIndex === views.length - 1 ? views[0] : views[currentIndex + 1];

		console.log('Next View', view, currentIndex, newView );

		navigate(newView);
		setLastUpdated(Date.now());
	};

	const nextColor = () => {
		if(typeof onColorChange !== 'function') return;

		const currentIndex = colors.indexOf(color);

		if (currentIndex === colors.length - 1) {
			onColorChange(colors[0]);
			return;
		}

		onColorChange(colors[currentIndex + 1]);
	};

	useHotkeys('left', prevView);
	useHotkeys('right', nextView);
	useHotkeys('c', nextColor);

	console.log('Bottom', view, color, onColorChange)

	return (
		<div id="bottom">
			<div onClick={prevView} onKeyPress={prevView} role="button" tabIndex={0}>
				<Icon.CaretLeftFill />
			</div>
			<div onClick={nextColor} onKeyPress={nextColor} role="button" tabIndex={0}>
				<Icon.Lightbulb />
			</div>
			<div onClick={nextView} onKeyPress={nextView} role="button" tabIndex={0}>
				<Icon.CaretRightFill />
			</div>
		</div>
	);
}

BottomBar.propTypes = {
	color: PropTypes.string,
	onColorChange: PropTypes.func.isRequired,
};

BottomBar.defaultProps = {
	color: 'white',
};

export default BottomBar;
