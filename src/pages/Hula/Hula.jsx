import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import '../../css/hula.css';
import HulaGirl from '../../images/hula-girl.gif';
import Stitch from '../../images/stitch.gif';
import Shantae from '../../images/shantae.gif';

export const Hula = props => {
	const [image, setImage] = useState('hula-girl');
	const images = ['hula-girl', 'stitch', 'shantae'];

	const getImage = () => {
		if(image === 'hula-girl') return HulaGirl;
		if(image === 'stitch') return Stitch;
		if(image === 'shantae') return Shantae;
		return Stitch;
	};

	const nextImage = () => 
		setImage(currentImage => {
			const currentIndex = images.indexOf(currentImage);

			if (currentIndex === images.length - 1) {
				return images[0];
			}
	
			return images[currentIndex + 1];
		});

	const prevImage = () => 
		setImage(currentImage => {
			const currentIndex = images.indexOf(currentImage);

			if (currentIndex === 0) {
				return images[images.length - 1];
			}

			return images[currentIndex - 1];
		});

	useHotkeys('*', ev => {
		if(ev.key === 'MediaTrackNext') nextImage();
		if(ev.key === 'MediaTrackPrevious') prevImage();
	});


	return (
		<div id="hula" onClick={nextImage} onKeyPress={nextImage} role="button" tabIndex={0}>
			<div id="hula-image" style={{backgroundImage: `url(${getImage()})`}} alt="Hula Girl" />
		</div>
	);
}

export default Hula;
