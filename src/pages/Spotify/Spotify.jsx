import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SpotifyWebAPI from 'spotify-web-api-node';
import SpotifyWebAPIServer from 'spotify-web-api-node/src/server-methods';
import * as Icon from 'react-bootstrap-icons';
import { useHotkeys } from 'react-hotkeys-hook';
import * as Utility from '../../scripts/utility';

import '../../css/spotify.css';

const SpotifyAPI = Object.assign(
	new SpotifyWebAPI({
		accessToken: JSON.parse(localStorage.getItem('access-token'))?.access_token,
		refreshToken: JSON.parse(localStorage.getItem('access-token'))?.refresh_token,
		clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
		redirectUri: `${location.origin}/Syncro-Pi/spotify`,
	}),
	SpotifyWebAPIServer,
);

export const Spotify = (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [challenge, setChallenge] = useState(localStorage.getItem('challenge') || Utility.randomString(69));
	const [state, setState] = useState(localStorage.getItem('state') || Utility.randomString(13));
	const [track, setTrack] = useState(null);
	const [trackAnalysis, setTrackAnalysis] = useState(null);
	const [pitches, setPitches] = useState([]);
	const [lastRender, setLastRender] = useState(null);

	const setTokens = (data) => {
		const tokens = data.body || data;

		if (!tokens) return;

		localStorage.setItem('access-token', JSON.stringify(tokens));

		SpotifyAPI.setAccessToken(tokens.access_token);
		SpotifyAPI.setRefreshToken(tokens.refresh_token);
	};

	const handleError = (err, retry) => {
		const { status, message } = err?.body?.error || {};
		console.error('Error', err?.body, err?.headers, err?.statusCode);

		if (status === 401) {
			reauthorize().then(() => {
				if (retry) retry();
			});
			return;
		}

		if (err?.body?.error === 'invalid_grant') {
			reauthorize().then(() => {
				if (retry) retry();
			});
			return;
		}

		setTrack(false);
	};

	const getAccessToken = () => {
		const code = location.search
			.split('&')
			.find((p) => p.includes('code='))
			.split('=')[1];

		// Package does not support PKCE authorization
		return fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: [
				`grant_type=authorization_code`,
				`code=${code}`,
				`redirect_uri=${encodeURIComponent(SpotifyAPI.getRedirectURI())}`,
				`client_id=${encodeURIComponent(SpotifyAPI.getClientId())}`,
				`code_verifier=${encodeURIComponent(challenge)}`,
			].join('&'),
		})
			.then((response) => response.json())
			.then(setTokens)
			.catch(handleError);
	};

	const authorize = async () => {
		if (!process.env.REACT_APP_SPOTIFY_CLIENT_ID) {
			setTrack(false);
			return;
		}

		if (location.search.includes('error=access_denied')) {
			setTrack(false);
			return;
		}

		if (location.search.includes(`state=${state}`)) {
			getAccessToken().then(() => navigate('/spotify'));
			return;
		}

		const scopes = ['user-read-playback-state', 'user-modify-playback-state'];
		const authURL = SpotifyAPI.createAuthorizeURL(scopes, state);
		const challengeCode = Utility.base64URLEncode(await Utility.hashString(challenge));

		window.location.href = `${authURL}&code_challenge_method=S256&code_challenge=${challengeCode}`;
	};

	const reauthorize = () => {
		if (!SpotifyAPI.getRefreshToken()) {
			authorize();
			return Promise.reject();
		}

		// Issues with spotify-web-api-node make this necessary for now
		return fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: [
				`grant_type=refresh_token`,
				`refresh_token=${encodeURIComponent(SpotifyAPI.getRefreshToken())}`,
				`client_id=${encodeURIComponent(SpotifyAPI.getClientId())}`,
			].join('&'),
		})
			.then((response) => response.json())
			.then(setTokens)
			.then(updateStatus)
			.catch(handleError);

		// SpotifyAPI.refreshAccessToken().then(setTokens).catch(handleError);
	};

	const getTrackAnalysis = () => {
		if (!track?.item?.id) {
			return;
		}

		SpotifyAPI.getAudioAnalysisForTrack(track?.item?.id)
			.then((data) => {
				if (data.body === null) setTrackAnalysis(-1);
				else setTrackAnalysis({ ...data.body, timestamp: Date.now() });
			})
			.catch(handleError);
	};

	const updateStatus = () => {
		if (!SpotifyAPI.getAccessToken()) {
			authorize();
			return;
		}

		SpotifyAPI.getMyCurrentPlaybackState()
			.then((data) => {
				if (data.body === null) setTrack(-1);
				else setTrack({ ...data.body, timestamp: Date.now() });
			})
			.catch(handleError);
	};

	const updatePitches = (currentTrack, currentAnalysis) => {
		if (!track?.is_playing) return;

		const progress = getCurrentProgress() / 1000;
		const segment = trackAnalysis?.segments?.find((s) => s.start >= progress);

		setPitches(segment?.pitches || []);
	};

	const playPause = () => {
		if (track?.is_playing) {
			SpotifyAPI.pause().then(updateStatus).catch(handleError);
			return;
		}

		SpotifyAPI.play().then(updateStatus).catch(handleError);
	};

	const next = () => {
		SpotifyAPI.skipToNext().then(updateStatus).catch(handleError);
	};

	const previous = () => {
		SpotifyAPI.skipToPrevious().then(updateStatus).catch(handleError);
	};

	const getCurrentProgress = () =>
		track?.is_playing ? (track?.progress_ms || 0) + Date.now() - (track?.timestamp || 0) : track?.progress_ms;

	useHotkeys('*', (ev) => {
		console.log(ev);
		if (ev.key === 'MediaPlayPause') playPause();
		if (ev.key === 'MediaTrackPrevious') previous();
		if (ev.key === 'MediaTrackNext') next();
	});

	// Fetch track info
	useEffect(() => {
		const interval = setInterval(() => {
			if (!SpotifyAPI.getAccessToken()) return;
			updateStatus();
		}, 2500); // 2.5 seconds

		return () => clearInterval(interval);
	}, []);

	// Update progress bar
	useEffect(() => {
		const interval = setInterval(() => setLastRender(Date.now()), 1000); // 1 second

		return () => clearInterval(interval);
	}, []);

	// Update graph
	useEffect(() => {
		const interval = setInterval(updatePitches, 100); // 0.1 second

		return () => clearInterval(interval);
	}, [track, trackAnalysis]);

	// Get track audio analysis on track change
	// useEffect(getTrackAnalysis, [track?.item?.id])

	// Get initial play state
	useEffect(updateStatus, []);

	// Set Challenge Value and State
	useEffect(() => {
		localStorage.setItem('challenge', challenge);
		localStorage.setItem('state', state);
	}, []);

	if (track === null)
		return (
			<div id="weather">
				<Icon.Boombox id="weather-icon" />
				<div id="weather-description">Music loading...</div>
			</div>
		);

	if (track === false)
		return (
			<div id="weather">
				<Icon.VolumeMute id="weather-icon" />
				<div id="weather-description">Music could not load</div>
			</div>
		);

	if (track === -1)
		return (
			<div id="weather">
				<Icon.Boombox id="weather-icon" />
				<div id="weather-description">Music not playing</div>
			</div>
		);

	return (
		<div id="spotify">
			<div id="spotify-song">
				<div id="spotify-album" style={{ backgroundImage: `url(${track?.item?.album?.images[1]?.url})` }} />
				<div
					id="spotify-name"
					className="show-unlit"
					data-unlit={Utility.generateUnlitLCD(track?.item?.name || 'Unknown Song', [':'])}
				>
					{track?.item?.name || 'Unknown Song'}
				</div>
				<div
					id="spotify-artist"
					className="show-unlit"
					data-unlit={Utility.generateUnlitLCD(track?.item?.artists[0]?.name || 'Unknown Artist', [':'])}
				>
					{track?.item?.artists[0]?.name || 'Unknown Artist'}
				</div>
			</div>
			<div id="spotify-progress">
				<div
					id="spotify-progress-current"
					className="show-unlit"
					data-unlit={Utility.generateUnlitLCD(Utility.msToDuration(getCurrentProgress()), [':'])}
				>
					{Utility.msToDuration(getCurrentProgress())}
				</div>
				<div
					id="spotify-progress-total"
					className="show-unlit"
					data-unlit={Utility.generateUnlitLCD(Utility.msToDuration(track?.item?.duration_ms), [':'])}
				>
					{Utility.msToDuration(track?.item?.duration_ms)}
				</div>
				<div
					id="spotify-progress-fill"
					style={{ width: `${Utility.ratioToPercent(getCurrentProgress(), track?.item?.duration_ms)}%` }}
				/>
			</div>
			<div id="spotify-controls">
				<div id="spotify-prev" onClick={previous} onKeyPress={previous} role="button" alt="Previous Song" tabIndex={0}>
					<Icon.SkipStart />
				</div>
				<div id="spotify-play" onClick={playPause} onKeyPress={playPause} role="button" tabIndex={0}>
					{track?.is_playing ? <Icon.PauseCircle /> : <Icon.PlayCircle />}
				</div>
				<div id="spotify-next" onClick={next} onKeyPress={next} role="button" alt="Next Song" tabIndex={0}>
					<Icon.SkipEnd />
				</div>
			</div>
			{/* <div id="spotify-graph"> */}
			{/* eslint-disable-next-line react/no-array-index-key */}
			{/* {pitches.map((p, i) => <div key={i} style={{height: `${p}em`}} />)} */}
			{/* </div> */}
		</div>
	);
};

export default Spotify;
