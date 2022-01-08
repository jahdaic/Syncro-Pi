import React from 'react';
import PropTypes from 'prop-types';
import AnalogClock from '../widgets/AnalogClock';
import Weather from '../widgets/Weather';
import Hula from '../widgets/Hula';

export function Content({ view, ...props }) {
	const getView = () => {
		if (view === 'analog-clock') return <AnalogClock />;
		if (view === 'weather') return <Weather />;
		if (view === 'hula') return <Hula />;
		return 'Unknown View';
	};

	return (
		<div id="content">
			{getView()}
		</div>
	);
}

Content.propTypes = {
	view: PropTypes.string,
};

Content.defaultProps = {
	view: 'analog-clock',
};

export default Content;
