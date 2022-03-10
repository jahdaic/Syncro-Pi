import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Gyroscope from '../../components/Gyroscope';

import '../../css/test.css';

export const Test = props => {
	const [output, setOutput] = useState([]);

	const log = msg => {
		if(!msg) return;
		setOutput(currOutput => [...currOutput, `${new Date().toLocaleTimeString()} - ${msg}`]);
	};

	const update = () => {};

	const init = async () => {
		// Height and Width
		log(`Window Outer Size: ${window.outerHeight} × ${window.outerWidth}`);
		log(`Window Inner Size: ${window.innerHeight} × ${window.innerWidth}`);

		// setupMotion();

		// if(DeviceMotionEvent.requestPermission) {
		// 	const permission = await DeviceMotionEvent.requestPermission();
		// 	// .then(permission => {
		// 	if (permission === 'granted') {
		// 		log('Permission Granted')
		// 		window.addEventListener('devicemotion', ev => log(JSON.stringify(ev)));
		// 		window.addEventListener('deviceorientation', ev => log(JSON.stringify(ev)));

		// 	}
		// 	else {
		// 		log(`Permission Failed: ${permission}`);
		// 	}
		// 	// });
		// }
		// else {
		// 	log('DeviceMotionEvent not found')
		// }

		// window.addEventListener('deviceorientation', ev => log(ev.alpha, ev.beta, ev.gamma, ev.webkitCompassHeading));
	};

	const setupMotion = () => {
		if (typeof DeviceMotionEvent.requestPermission === 'function') {
			// Handle iOS 13+ devices.
			DeviceMotionEvent.requestPermission()
				.then((state) => {
					if (state === 'granted') {
						window.addEventListener('devicemotion', ev => log(`Motion: ${JSON.stringify(ev.alpha)}`));
						window.addEventListener('deviceorientation', ev => log(`Orientation: ${JSON.stringify(ev.alpha)}`));
					}
					else {
						console.error('Request to access the orientation was rejected');
					}
				})
				.catch(console.error);
		}
		else {
			// Handle regular non iOS 13+ devices.
			window.addEventListener('devicemotion', ev => log(JSON.stringify(ev.alpha)));
			window.addEventListener('deviceorientation', ev => log(JSON.stringify(ev.alpha)));
		}
	};

	// const setupMotion = async () => {
	// 	if (!DeviceOrientationEvent) {
	// 		log('Device orientation event is not supported by your browser');
	// 		return false;
	// 	}

	// 	if (
	// 		DeviceOrientationEvent.requestPermission
	//     && typeof DeviceMotionEvent.requestPermission === 'function'
	// 	) {
	// 		let permission;
	// 		try {
	// 			permission = await DeviceOrientationEvent.requestPermission();
	// 		}
	// 		catch (err) {
	// 			log(err);
	// 			return false;
	// 		}
	// 		if (permission !== 'granted') {
	// 			log('Request to access the device orientation was rejected');
	// 			return false;
	// 		}
	// 	}

	// 	window.addEventListener('devicemotion', ev => log(JSON.stringify(ev)));
	// 	window.addEventListener('deviceorientation', ev => log(JSON.stringify(ev)));

	// 	return true;
	// };

	useHotkeys('*', ev => {
		log(`Key pressed: ${ev.key} (${ev.keyCode})`);
	});

	// useEffect(update, [5000]); // 5 seconds
	useEffect(init, []);

	return (
		<div id="test">
			Output
			<Gyroscope onUpdate={ev => log(JSON.stringify(ev))} />
			<textarea
				id="test-output"
				value={output.join('\n\n')}
				readOnly
			/>
			<button type="button" onClick={DeviceMotionEvent.requestPermission}>Permission</button>
			<button type="button" onClick={() => setOutput([])}>Clear</button>
		</div>
	);
}

export default Test;
