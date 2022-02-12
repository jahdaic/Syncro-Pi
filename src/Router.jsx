import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import Container from './components/page/Container';
import TopBar from './components/page/Topbar';
import BottomBar from './components/page/BottomBar';

import AnalogClock from './pages/AnalogClock';
import DigitalClock from './pages/DigitalClock';
import Compass from './pages/Compass';
import Weather from './pages/Weather';
import Performance from './pages/Performance';
import Spotify from './pages/Spotify';
import Hula from './pages/Hula';
import Settings from './pages/Settings';
import Test from './pages/Test';

export const Router = props => {
	const navigate = useNavigate();
	const [color, setColor] = useState(localStorage.getItem('color') || 'base');

	// Return to last page
	useEffect(() => {
		if(localStorage.getItem('page'))
			navigate(localStorage.getItem('page'));
	}, []);

	return (
		<Container filter={color}>
			<TopBar />

			<div id="content">
				<Routes>
					<Route path="/" element={<AnalogClock />} />
					<Route path="/analog-clock" element={<AnalogClock />} />
					<Route path="/digital-clock" element={<DigitalClock />} />
					<Route path="/compass" element={<Compass />} />
					<Route path="/weather" element={<Weather />} />
					<Route path="/performance" element={<Performance />} />
					<Route path="/spotify" element={<Spotify />} />
					<Route path="/hula" element={<Hula />} />
					<Route path="/settings" element={<Settings onColorChange={setColor} />} />
					<Route path="/test" element={<Test />} />
				</Routes>
			</div>

			<BottomBar color={color} onColorChange={setColor} />
		</Container>
	);
}

export default Router;
