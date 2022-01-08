import React, { useState } from 'react';
import Container from '../../components/page/Container';
import TopBar from '../../components/page/Topbar';
import Content from '../../components/page/Content';
import BottomBar from '../../components/page/BottomBar';

export const Main = props => {
	const [view, setView] = useState('analog-clock');
	const [color, setColor] = useState('white');

	return (
		<Container filter={color}>
			<TopBar />
			<Content view={view} />
			<BottomBar view={view} color={color} onViewChange={setView} onColorChange={setColor} />
		</Container>
	);
}

export default Main;
