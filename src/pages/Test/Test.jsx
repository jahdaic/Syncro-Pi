import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Utility from '../../scripts/utility';
import { selectSpotifyState } from '../../store/store.selectors';

import '../../css/test.css';

export const Test = props => {
	const spotify = useSelector(selectSpotifyState);
	const [output, setOutput] = useState([]);

	const log = msg => {
		if(!msg) return;
		setOutput(currOutput => [...currOutput, `${new Date().toLocaleTimeString()} - ${msg}`]);
	};

	const update = () => {};

	const init = () => {
		log(JSON.stringify(spotify.challenge))

		const encoder = new TextEncoder();
		const data = encoder.encode(spotify.challenge);

		log(data);

		if(spotify.challenge)
			Utility.hashString(spotify.challenge).then(hash => log(hash));
		else
			log('NO CHALLENGE')

		return () => {};
	};

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
