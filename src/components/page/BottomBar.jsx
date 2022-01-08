import React from 'react';
import PropTypes from 'prop-types';
import * as Icon from 'react-bootstrap-icons';

export const BottomBar = ({ view, color, onViewChange, onColorChange, ...props }) => {
	const views = ['analog-clock', 'weather', 'hula'];
	const colors = ['white', 'dark', 'red', 'green'];

	const prevView = () => {
		if(typeof onViewChange !== 'function') return;

		const currentIndex = views.indexOf(view);

		if (currentIndex === 0) {
			onViewChange(views[views.length - 1]);
			return;
		}

		onViewChange(views[currentIndex - 1]);
	};

	const nextView = () => {
		if(typeof onViewChange !== 'function') return;

		const currentIndex = views.indexOf(view);

		if (currentIndex === views.length - 1) {
			onViewChange(views[0]);
			return;
		}

		onViewChange(views[currentIndex + 1]);
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
	view: PropTypes.string,
	color: PropTypes.string,
	onViewChange: PropTypes.func.isRequired,
	onColorChange: PropTypes.func.isRequired,
};

BottomBar.defaultProps = {
	view: 'analog-clock',
	color: 'white',
};

export default BottomBar;
