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
	const [music, setMusic] = useState(null);
	const [lastRender, setLastRender] = useState(null);

	const setTokens = data => {
		const tokens = data.body || data;

		localStorage.setItem('access_token', JSON.stringify(tokens));

		SpotifyAPI.setAccessToken(tokens.access_token);
		SpotifyAPI.setRefreshToken(tokens.refresh_token);
	}

	const handleError = (err, retry) => {
		const {status, message} = err.body.error;
		console.log('Error', status, message, err.headers, err.statusCode);

		if(status === 401) {
			reauthorize().then(() => { if(retry) retry(); });
			return;
		}

		if(err.body.error === 'invalid_grant') {
			reauthorize().then(() => { if(retry) retry(); });
			return;
		}

		setMusic(false);
	};

	const getAccessToken = () => {
		const code = location.search.split('&').find(p => p.includes('code=')).split('=')[1];

		return SpotifyAPI.authorizationCodeGrant(code)
			.then(setTokens)
			.catch(handleError);
	};

	const authorize = () => {
		if(!process.env.REACT_APP_SPOTIFY_CLIENT_ID) {
			setMusic(false);
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
			return;
		}

		const auth = btoa(`${SpotifyAPI.getClientId()}:${SpotifyAPI.getClientSecret()}`);

		// Issues with spotify-web-api-node make this necessary for now
		fetch('https://accounts.spotify.com/api/token', {
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

	const updateStatus = () => {
		if(!SpotifyAPI.getAccessToken()) {
			authorize();
			return;
		}

		SpotifyAPI.getMyCurrentPlaybackState()
			.then(data => {
				if(data.body === null) setMusic(-1);
				else setMusic({...data.body, timestamp: Date.now()});
			})
			.catch(handleError);
	};

	const playPause = () => {
		if(music.is_playing) {
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
		music?.is_playing ? music.progress_ms + Date.now() - music.timestamp : music.progress_ms;
	
	useEffect(() => {

		const interval = setInterval(() => {
			// if( !SpotifyAPI.getAccessToken() ) return;
			updateStatus();
		}, 5000); // 5 seconds

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => setLastRender(Date.now()), 1000); // 1 second

		return () => clearInterval(interval);
	}, []);

	useEffect(updateStatus, []);

	if(music === null) return (
		<div id="weather">
			<Icon.Boombox id="weather-icon" />
			<div id="weather-description">
				Music loading...
			</div>
		</div>
	);

	if(music === false) return (
		<div id="weather">
			<Icon.VolumeMute id="weather-icon" />
			<div id="weather-description">
				Music could not load
			</div>
		</div>
	);

	if(music === -1) return (
		<div id="weather">
			<Icon.Boombox id="weather-icon" />
			<div id="weather-description">
				Music not playing
			</div>
		</div>
	);

	return (
		<div id="spotify">
			<div id="spotify-album" style={{backgroundImage: `url(${music?.item?.album?.images[1]?.url})`}} />
			<div id="spotify-song">{music?.item?.name || 'Unknown Song'}</div>
			<div id="spotify-artist">{music?.item?.artists[0]?.name || 'Unknown Artist'}</div>
			<div id="spotify-progress">
				<div id="spotify-progress-current">
					{ Utility.msToDuration( getCurrentProgress() ) }
				</div>
				<div id="spotify-progress-total">
					{ Utility.msToDuration( music?.item?.duration_ms ) }
				</div>
				<div
					id="spotify-progress-fill"
					style={{ width: `${Utility.ratioToPercent(getCurrentProgress(), music?.item?.duration_ms)}%` }}
				/>
			</div>
			<div id="spotify-controls">
				<div id="spotify-prev" onClick={previous} onKeyPress={previous} role="button" tabIndex={0}>
					<Icon.SkipStart />
				</div>
				<div id="spotify-play" onClick={playPause} onKeyPress={playPause} role="button" tabIndex={0}>
					{music?.is_playing ? <Icon.PauseCircle /> : <Icon.PlayCircle />}
				</div>
				<div id="spotify-next" onClick={next} onKeyPress={next} role="button" tabIndex={0}>
					<Icon.SkipEnd />
				</div>
			</div>
			
		</div>
	);
}

export default Spotify;
