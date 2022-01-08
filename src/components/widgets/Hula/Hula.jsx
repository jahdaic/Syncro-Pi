import React, { useEffect, useState } from 'react';

import '../../../css/hula.css';
import HulaGirl from '../../../images/hula-girl.gif';
import Stitch from '../../../images/stitch.gif';
import Shantae from '../../../images/shantae.gif';

export const Hula = props => {
	const [image, setImage] = useState('hula-girl');
	const images = ['hula-girl', 'stitch', 'shantae'];

	const getImage = () => {
		if(image === 'hula-girl') return HulaGirl;
		if(image === 'stitch') return Stitch;
		if(image === 'shantae') return Shantae;
		return Stitch;
	};

	const nextImage = () => {
		const currentIndex = images.indexOf(image);

		if (currentIndex === images.length - 1) {
			setImage(images[0]);
			return;
		}

		setImage(images[currentIndex + 1]);
	};

	return (
		<div id="hula" onClick={nextImage} onKeyPress={nextImage} role="button" tabIndex={0}>
			<div id="hula-image" style={{backgroundImage: `url(${getImage()})`}} alt="Hula Girl" />
		</div>
	);
}

export default Hula;
