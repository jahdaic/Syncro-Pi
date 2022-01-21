import React, { useEffect, useState } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import SpotifyWebAPI from 'spotify-web-api-node';
import SpotifyWebAPIServer from 'spotify-web-api-node/src/server-methods';
import * as Icon from 'react-bootstrap-icons';
import * as Utility from '../../scripts/utility';

import '../../css/spotify.css';

const SpotifyAPI = Object.assign(new SpotifyWebAPI({
	accessToken: JSON.parse(localStorage.getItem('access_token'))?.access_token,
	refreshToken: JSON.parse(localStorage.getItem('access_token'))?.refresh_token,
	clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
	clientSecret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
	redirectUri: `${location.origin}/Syncro-Pi/spotify`
}), SpotifyWebAPIServer);

export const Spotify = props => {
	const navigate = useNavigate();
	const location = useLocation();
	const [track, setTrack] = useState(null);
	const [trackAnalysis, setTrackAnalysis] = useState(null);
	const [pitches, setPitches] = useState([]);
	const [lastRender, setLastRender] = useState(null);

	const setTokens = data => {
		const tokens = data.body || data;

		localStorage.setItem('access_token', JSON.stringify(tokens));

		SpotifyAPI.setAccessToken(tokens.access_token);
		SpotifyAPI.setRefreshToken(tokens.refresh_token);
	}

	const handleError = (err, retry) => {
		const {status, message} = err?.body?.error || {};
		console.error('Error', status, message, err?.headers, err?.statusCode);

		if(status === 401) {
			reauthorize().then(() => { if(retry) retry(); });
			return;
		}

		if(err.body.error === 'invalid_grant') {
			reauthorize().then(() => { if(retry) retry(); });
			return;
		}

		setTrack(false);
	};

	const getAccessToken = () => {
		const code = location.search.split('&').find(p => p.includes('code=')).split('=')[1];

		return SpotifyAPI.authorizationCodeGrant(code)
			.then(setTokens)
			.catch(handleError);
	};

	const authorize = () => {
		if(!process.env.REACT_APP_SPOTIFY_CLIENT_ID) {
			setTrack(false);
			return;
		}

		if(location.search.includes('state=happy')) {
			getAccessToken().then(() => navigate('/spotify'));
			return;
		}

		const scopes = ['user-read-playback-state', 'user-modify-playback-state'];
		const state = 'happy';
		const authURL = SpotifyAPI.createAuthorizeURL(scopes, state);

		window.location.href = authURL;
	};

	const reauthorize = () => {
		if(!SpotifyAPI.getRefreshToken()) {
			authorize();
			return Promise.reject();
		}

		const auth = btoa(`${SpotifyAPI.getClientId()}:${SpotifyAPI.getClientSecret()}`);

		// Issues with spotify-web-api-node make this necessary for now
		return fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${auth}`,
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			body: JSON.stringify({
				grant_type: 'refresh_token',
				refresh_token: SpotifyAPI.getRefreshToken()
			})
		})
			.then(setTokens)
			.then(updateStatus)
			.catch(handleError);

		// SpotifyAPI.refreshAccessToken().then(setTokens).catch(handleError);
	}

	const getTrackAnalysis = () => {
		if(!track?.item?.id) {
			return;
		}
		
		SpotifyAPI.getAudioAnalysisForTrack(track?.item?.id)
			.then(data => {
				if(data.body === null) setTrackAnalysis(-1);
				else setTrackAnalysis({...data.body, timestamp: Date.now()});
			})
			.catch(handleError);
	};

	const updateStatus = () => {
		if(!SpotifyAPI.getAccessToken()) {
			authorize();
			return;
		}

		SpotifyAPI.getMyCurrentPlaybackState()
			.then(data => {
				if(data.body === null) setTrack(-1);
				else setTrack({...data.body, timestamp: Date.now()});
			})
			.catch(handleError);
	};

	const updatePitches = () => {
		if(!track?.is_playing) return;

		const progress = getCurrentProgress() / 1000;
		const segment = trackAnalysis?.segments?.find(s => s.start >= progress);

		setPitches(segment?.pitches || []);
	}

	const playPause = () => {
		if(track?.is_playing) {
			SpotifyAPI.pause()
				.then(updateStatus)
				.catch(handleError);
			return;
		}

		SpotifyAPI.play()
			.then(updateStatus)
			.catch(handleError);
	};

	const next = () => {
		SpotifyAPI.skipToNext()
			.then(updateStatus)
			.catch(handleError);
	};

	const previous = () => {
		SpotifyAPI.skipToPrevious()
			.then(updateStatus)
			.catch(handleError);
	};

	const getCurrentProgress = () => 
		track?.is_playing ? (track?.progress_ms || 0) + Date.now() - (track?.timestamp || 0) : track?.progress_ms;
	
	// Fetch track info
	useEffect(() => {

		const interval = setInterval(() => {
			if( !SpotifyAPI.getAccessToken() ) return;
			updateStatus();
		}, 5000); // 5 seconds

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
	}, []);

	// Get track audio analysis on track change
	useEffect(getTrackAnalysis, [track?.item?.id])

	// Get initial play state
	useEffect(updateStatus, []);

	if(track === null) return (
		<div id="weather">
			<Icon.Boombox id="weather-icon" />
			<div id="weather-description">
				Music loading...
			</div>
		</div>
	);

	if(track === false) return (
		<div id="weather">
			<Icon.VolumeMute id="weather-icon" />
			<div id="weather-description">
				Music could not load
			</div>
		</div>
	);

	if(track === -1) return (
		<div id="weather">
			<Icon.Boombox id="weather-icon" />
			<div id="weather-description">
				Music not playing
			</div>
		</div>
	);

	return (
		<div id="spotify">
			<div id="spotify-album" style={{backgroundImage: `url(${track?.item?.album?.images[1]?.url})`}} />
			<div id="spotify-song">{track?.item?.name || 'Unknown Song'}</div>
			<div id="spotify-artist">{track?.item?.artists[0]?.name || 'Unknown Artist'}</div>
			<div id="spotify-progress">
				<div id="spotify-progress-current">
					{ Utility.msToDuration( getCurrentProgress() ) }
				</div>
				<div id="spotify-progress-total">
					{ Utility.msToDuration( track?.item?.duration_ms ) }
				</div>
				<div
					id="spotify-progress-fill"
					style={{ width: `${Utility.ratioToPercent(getCurrentProgress(), track?.item?.duration_ms)}%` }}
				/>
			</div>
			<div id="spotify-controls">
				<div id="spotify-prev" onClick={previous} onKeyPress={previous} role="button" tabIndex={0}>
					<Icon.SkipStart />
				</div>
				<div id="spotify-play" onClick={playPause} onKeyPress={playPause} role="button" tabIndex={0}>
					{track?.is_playing ? <Icon.PauseCircle /> : <Icon.PlayCircle />}
				</div>
				<div id="spotify-next" onClick={next} onKeyPress={next} role="button" tabIndex={0}>
					<Icon.SkipEnd />
				</div>
			</div>
			<div id="spotify-graph">
				{/* eslint-disable-next-line react/no-array-index-key */}
				{pitches.map((p, i) => <div key={i} style={{height: `${p}em`}} />)}
			</div>
			
		</div>
	);
}

export default Spotify;
