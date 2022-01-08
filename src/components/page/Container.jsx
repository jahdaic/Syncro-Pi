import React from 'react';
import PropTypes from 'prop-types';

export function Container({ filter, children, ...props }) {
	return (
		<div id="container" className={`filter-${filter}`}>
			{children}
		</div>
	);
}

Container.propTypes = {
	filter: PropTypes.string,
	children: PropTypes.node,
};

Container.defaultProps = {
	filter: 'white',
	children: null,
};

export default Container;
