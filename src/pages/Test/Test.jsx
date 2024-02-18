import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Utility from '../../scripts/utility';
import { selectGPSState, selectSpotifyState } from '../../store/store.selectors';

import '../../css/test.css';

export const Test = props => {
	const spotify = useSelector(selectSpotifyState);
	const location = useSelector(selectGPSState);
	const [output, setOutput] = useState([]);

	const log = msg => {
		if(!msg) return;
		setOutput(currOutput => [...currOutput, `${new Date().toLocaleTimeString()} - ${msg}`]);
	};

	const update = () => {
		log(JSON.stringify(location));
	};

	const init = () => {
		log(JSON.stringify(location));
	};

	useEffect(init, []);

	useEffect(() => {
		const interval = setInterval(update, 1000); // 1 second

		return () => clearInterval(interval);
	}, []);

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
