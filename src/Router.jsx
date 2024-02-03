import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from './components/page/Container';
import TopBar from './components/page/Topbar';
import BottomBar from './components/page/BottomBar';
import { selectSettingState, selectSystemState } from './store/store.selectors';

const AnalogClock = lazy(() => import('./pages/AnalogClock'));
const DigitalClock = lazy(() => import('./pages/DigitalClock'));
const Speed = lazy(() => import('./pages/Speed'));
const Compass = lazy(() => import('./pages/Compass'));
const Weather = lazy(() => import('./pages/Weather'));
const Performance = lazy(() => import('./pages/Performance'));
const Spotify = lazy(() => import('./pages/Spotify'));
const Hula = lazy(() => import('./pages/Hula'));
const Settings = lazy(() => import('./pages/Settings'));
const Test = lazy(() => import('./pages/Test'));

export const Router = (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const system = useSelector(selectSystemState);

	// Return to last page
	useEffect(() => {
		if (location.pathname === '/' && system.view) navigate(`/${system.view}`);
	}, []);

	return (
		<Container>
			<TopBar />

			<div id="content">
				<Suspense fallback={<div />}>
					<Routes>
						<Route path="/" element={<AnalogClock />} />
						<Route path="/analog-clock" element={<AnalogClock />} />
						<Route path="/digital-clock" element={<DigitalClock />} />
						<Route path="/speed" element={<Speed />} />
						<Route path="/compass" element={<Compass />} />
						<Route path="/weather" element={<Weather />} />
						<Route path="/performance" element={<Performance />} />
						<Route path="/spotify" element={<Spotify />} />
						<Route path="/hula" element={<Hula />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/test" element={<Test />} />
					</Routes>
				</Suspense>
			</div>

			<BottomBar />
		</Container>
	);
};

export default Router;
