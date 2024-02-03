import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectSettingState } from '../../store/store.selectors';

export function Container({  children, ...props }) {
	const settings = useSelector(selectSettingState);

	return (
		<div id="container" className={`filter-${settings.theme}`}>
			{children}
		</div>
	);
}

Container.propTypes = {
	children: PropTypes.node,
};

Container.defaultProps = {
	children: null,
};

export default Container;
