import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import '../../css/test.css';

export const Test = props => {
	const [output, setOutput] = useState([]);

	const log = msg => {
		if(!msg) return;
		setOutput(currOutput => [...currOutput, `${new Date().toLocaleTimeString()} - ${msg}`]);
	};

	const update = () => {};

	const init = () => {
		// Height and Width
		log(`Window Outer Size: ${window.outerHeight} × ${window.outerWidth}`);
		log(`Window Inner Size: ${window.innerHeight} × ${window.innerWidth}`);
	};

	useHotkeys('*', ev => {
		log(`Key pressed: ${ev.key} (${ev.keyCode})`);
	});

	// useEffect(update, [5000]); // 5 seconds
	useEffect(init, []);

	return (
		<div id="test">
			Output
			<textarea
				id="test-output"
				value={output.join('\n\n')}
				readOnly
			/>
		</div>
	);
}

export default Test;
