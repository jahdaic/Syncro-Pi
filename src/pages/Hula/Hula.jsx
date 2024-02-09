import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import { selectHulaState } from '../../store/store.selectors';
import storeActions from '../../store/store.redux';

import '../../css/hula.css';
import HulaGirl from '../../images/hula-girl.gif';
import Stitch from '../../images/stitch.gif';
import Shantae from '../../images/shantae.gif';

export const Hula = props => {
	const dispatch = useDispatch();
	const image = useSelector(selectHulaState);
	const images = ['hula-girl', 'stitch', 'shantae'];

	const getImage = () => {
		if(image === 'hula-girl') return HulaGirl;
		if(image === 'stitch') return Stitch;
		if(image === 'shantae') return Shantae;
		return Stitch;
	};

	const nextImage = () => {
		const currentIndex = images.indexOf(image);
		let nextIndex = currentIndex + 1;

		if (currentIndex >= images.length - 1) nextIndex = 0;

		dispatch(storeActions.setHula(images[nextIndex]));
	};

	const prevImage = () => {
		const currentIndex = images.indexOf(image);
		let prevIndex = currentIndex - 1;

		if (currentIndex <= 0) prevIndex = images.length - 1;

		dispatch(storeActions.setHula(images[prevIndex]));
	};

	useHotkeys('*', ev => {
		if(ev.key === 'MediaTrackNext') nextImage();
		if(ev.key === 'MediaTrackPrevious') prevImage();
	});


	return (
		<div id="hula" onClick={nextImage} onKeyDown={nextImage} role="button" tabIndex={0}>
			<div id="hula-image" alt="Hula Girl">
				<img src={getImage()} alt="Hula" />
			</div>
		</div>
	);
}

export default Hula;
