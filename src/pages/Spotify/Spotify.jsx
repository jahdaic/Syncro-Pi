import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SpotifyWebAPI from 'spotify-web-api-node';
import SpotifyWebAPIServer from 'spotify-web-api-node/src/server-methods';
import * as Icon from 'react-bootstrap-icons';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch, useSelector } from 'react-redux';
import * as Utility from '../../scripts/utility';
import { selectSpotifyState } from '../../store/store.selectors';
import storeActions from '../../store/store.redux';

import '../../css/spotify.css';

// const SpotifyAPI = Object.assign(
// 	new SpotifyWebAPI({
// 		accessToken: JSON.parse(localStorage.getItem('access-token'))?.access_token,
// 		refreshToken: JSON.parse(localStorage.getItem('access-token'))?.refresh_token,
// 		clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
// 		redirectUri: `${location.origin}${process.env.REACT_APP_SUBDIRECTORY}/spotify`,
// 	}),
// 	SpotifyWebAPIServer,
// );

export const Spotify = (props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const spotify = useSelector(selectSpotifyState);
	const marqueeRef = useRef(0);
	const [spotifyAPI, setSpotifyAPI] = useState(
		Object.assign(
			new SpotifyWebAPI({
				accessToken: spotify?.tokens?.access_token,
				refreshToken: spotify?.tokens?.refresh_token,
				clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
				redirectUri: `${document.location.origin}${process.env.REACT_APP_SUBDIRECTORY.replace(/\/$/, '')}/spotify`,
			}),
			SpotifyWebAPIServer,
		),
	);
	const [track, setTrack] = useState(null);
	const [trackAnalysis, setTrackAnalysis] = useState(null);
	const [pitches, setPitches] = useState([]);
	const [lastRender, setLastRender] = useState(null);


	const setTokens = (data) => {
		const tokens = data.body || data;

		if (!tokens || tokens.error) return;

		dispatch(storeActions.setSpotify({ tokens }));
	};

	const handleError = (err, retry) => {
		const { status, message } = err?.body?.error || {};
		console.error('Error', err?.body, err?.headers, err?.statusCode);

		if (status === 401) {
			reauthorize()
				.then(() => { if (retry) retry(); });
			return;
		}

		if (err?.body?.error === 'invalid_grant') {
			reauthorize()
				.then(() => { if (retry) retry();	});
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
				`redirect_uri=${encodeURIComponent(spotifyAPI.getRedirectURI())}`,
				`client_id=${encodeURIComponent(spotifyAPI.getClientId())}`,
				`code_verifier=${encodeURIComponent(spotify.challenge)}`,
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

		if (location.search.includes(`state=${spotify.state}`)) {
			getAccessToken().then(() => navigate('/spotify'));
			return;
		}

		const scopes = ['user-read-playback-state', 'user-modify-playback-state'];
		const authURL = spotifyAPI.createAuthorizeURL(scopes, spotify.state);

		let challenge = '';
		if(!spotify.challenge) {
			challenge = Utility.randomString(69);
			dispatch(storeActions.setSpotify({challenge}));
		}

		const challengeCode = Utility.base64URLEncode(await Utility.hashString(spotify.challenge || challenge));

		window.location.href = `${authURL}&code_challenge_method=S256&code_challenge=${challengeCode}`;
	};

	const reauthorize = () => {
		if (!spotifyAPI.getRefreshToken()) {
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
				`refresh_token=${encodeURIComponent(spotifyAPI.getRefreshToken())}`,
				`client_id=${encodeURIComponent(spotifyAPI.getClientId())}`,
			].join('&'),
		})
			.then((response) => response.json())
			.then(setTokens)
			.then(updateStatus)
			.catch(handleError);

		// spotifyAPI.refreshAccessToken().then(setTokens).catch(handleError);
	};

	const getTrackAnalysis = () => {
		if (!track?.item?.id) return;

		spotifyAPI
			.getAudioAnalysisForTrack(track?.item?.id)
			.then((data) => {
				if (data.body === null) setTrackAnalysis(-1);
				else setTrackAnalysis({ ...data.body, timestamp: Date.now() });
			})
			.catch(handleError);
	};

	const updateStatus = () => {
		if (!spotifyAPI.getAccessToken()) {
			authorize();
			return;
		}

		spotifyAPI
			.getMyCurrentPlaybackState()
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
			spotifyAPI.pause().then(updateStatus).catch(handleError);
			return;
		}

		spotifyAPI.play().then(updateStatus).catch(handleError);
	};

	const next = () => {
		spotifyAPI.skipToNext().then(updateStatus).catch(handleError);
	};

	const previous = () => {
		spotifyAPI.skipToPrevious().then(updateStatus).catch(handleError);
	};

	const getCurrentProgress = () =>
		track?.is_playing ? (track?.progress_ms || 0) + Date.now() - (track?.timestamp || 0) : track?.progress_ms;

	useHotkeys('*', (ev) => {
		console.log(ev);
		if (ev.key === 'MediaPlayPause') playPause();
		if (ev.key === 'MediaTrackPrevious') previous();
		if (ev.key === 'MediaTrackNext') next();
	});

	// Get initial play state
	useEffect(updateStatus, []);

	// Fetch track info
	useEffect(() => {
		const interval = setInterval(() => {
			if (!spotifyAPI.getAccessToken()) return;

			updateStatus();
		}, 2500); // 2.5 seconds

		return () => clearInterval(interval);
	}, []);

	// If tokens ever change, update Spotify API
	useEffect(() => {
		spotifyAPI.setAccessToken(spotify.tokens?.access_token);
		spotifyAPI.setRefreshToken(spotify.tokens?.refresh_token);
	}, [spotify.tokens?.access_token, spotify.tokens?.refresh_token]);

	// Update progress bar
	useEffect(() => {
		const interval = setInterval(() => setLastRender(Date.now()), 1000); // 1 second

		return () => clearInterval(interval);
	}, []);

	// Update graph
	// useEffect(() => {
	// 	const interval = setInterval(updatePitches, 100); // 0.1 second

	// 	return () => clearInterval(interval);
	// }, [track, trackAnalysis]);

	// Get track audio analysis on track change
	// useEffect(getTrackAnalysis, [track?.item?.id])


	// Loading or authenticating
	if (track === null)
		return (
			<div className="loading-screen">
				<Icon.Boombox className="big-icon" />
				<div
					className="loading-text show-unlit"
					data-unlit={Utility.generateUnlitLCD('Music loading...')}
				>
					Music loading...
				</div>
			</div>
		);

	// Error authenticating
	if (track === false)
		return (
			<div className="loading-screen">
				<Icon.VolumeMute className="big-icon" />
				<div
					className="loading-text show-unlit"
					data-unlit={Utility.generateUnlitLCD('Music could not load')}
				>
					Music could not load
				</div>
			</div>
		);

	// No music currently playing on Spotify
	if (track === -1)
		return (
			<div className="loading-screen">
				<Icon.Boombox className="big-icon" />
				<div
					className="loading-text show-unlit"
					data-unlit={Utility.generateUnlitLCD('Music not playing')}
				>
					Music not playing
				</div>
			</div>
		);

	return (
		<div id="spotify">
			<div id="spotify-song">
				<div id="spotify-album" style={{ backgroundImage: `url(${track?.item?.album?.images[1]?.url})` }} />
				<div id="spotify-name">
					<div
						ref={marqueeRef}
						className={
							(marqueeRef.current.offsetWidth || 0) < (marqueeRef.current.scrollWidth || 0) ? '' : 'show-unlit'
						}
						data-unlit={Utility.generateUnlitLCD(track?.item?.name || 'Unknown Song', [':'])}
						data-overflow={(marqueeRef.current?.offsetWidth || 0) > (marqueeRef.current?.parentNode?.offsetWidth || 0)}
					>
						{track?.item?.name || 'Unknown Song'}
					</div>
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
				<div id="spotify-prev" onClick={previous} onKeyDown={previous} role="button" alt="Previous Song" tabIndex={0}>
					<Icon.SkipStartFill />
				</div>
				<div id="spotify-play" onClick={playPause} onKeyDown={playPause} role="button" tabIndex={0}>
					{track?.is_playing ? <Icon.PauseFill /> : <Icon.PlayFill />}
				</div>
				<div id="spotify-next" onClick={next} onKeyDown={next} role="button" alt="Next Song" tabIndex={0}>
					<Icon.SkipEndFill />
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
