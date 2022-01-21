import React, { useEffect, useState } from 'react';
import OpenWeatherAPI from 'openweather-api-node';
import * as Icon from 'react-bootstrap-icons';
import * as Utility from '../../scripts/utility';

import '../../css/weather.css';

export const Weather = props => {
	const [weather, setWeather] = useState(null);
	const [location, setLocation] = useState(null);

	const updateWeather = position => {
		if(!process.env.REACT_APP_OPEN_WEATHER_API_KEY) {
			setWeather(false);
			return;
		}

		if(!position && !location) {
			setLocation(false);
			setWeather(false);
			return;
		}

		setLocation(position);

		const weatherAPI = new OpenWeatherAPI({
			key: process.env.REACT_APP_OPEN_WEATHER_API_KEY,
			coordinates: {
				lat: position?.coords?.latitude || location?.coords?.latitude,
				lon: position?.coords?.longitude || location?.coords?.longitude
			},
			units: "imperial"
		})

		weatherAPI.getCurrent()
			.then(data => {
				setWeather(data.weather);
			})
			.catch(err => {
				setWeather(false);
			});
	};

	const getLocation = () => {
		if(!navigator.geolocation) {
			setWeather(false);
			setLocation(false);
			return;
		}
		
		navigator.geolocation.getCurrentPosition(updateWeather, err => {
			setWeather(false);
			setLocation(false);
		});
	}

	const askForLocationPermission = () => {
		if ( navigator.permissions && navigator.permissions.query) {
			navigator.permissions.query({ name: 'geolocation' })
				.then(result => {
					if ( result.state === 'granted' || result.state === 'prompt' ) {
						getLocation();
					}
				})
				.catch(err => {});
		}
		else if (navigator.geolocation) {
			getLocation();
		}
	};

	const getWeatherIcon = code => {
		const id = 'weather-icon';

		switch(code) {
			case '01d':
				return <Icon.Sun id={id} />;
			case '01n':
				return <Icon.MoonStars id={id} />;
			case '02d':
				return <Icon.CloudSun id={id} />;
			case '02n':
				return <Icon.CloudMoon id={id} />;
			case '03d':
			case '03n':
				return <Icon.Cloud id={id} />;
			case '04d':
			case '04n':
				return <Icon.Clouds id={id} />;
			case '09d':
			case '09n':
				return <Icon.CloudDrizzle id={id} />;
			case '10d':
			case '10n':
				return <Icon.CloudRainHeavy id={id} />;
			case '11d':
			case '11n':
				return <Icon.CloudLightningRain id={id} />;
			case '13d':
			case '13n':
				return <Icon.Snow2 id={id} />;
			case '50d':
			case '50n':
				return <Icon.CloudHaze2 id={id} />;
			default:
				return <Icon.QuestionLg id={id} />;
		}
	}

	const degreesToCompass = direction => {
		const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
		const angle = direction % 360;
		const index = Math.round((angle < 0 ? angle + 360 : angle) / 45) % 8;

		return directions[index];
	};

	useEffect(() => {
		const interval = setInterval(askForLocationPermission, 1800000); // 30 minutes

		return () => clearInterval(interval);
	}, []);

	useEffect(askForLocationPermission, []);

	if(weather === null) return (
		<div id="weather">
			<Icon.CloudArrowDown id="weather-icon" />
			<div id="weather-description">
				Weather loading...
			</div>
		</div>
	);

	if(location === false ) return (
		<div id="weather">
			<Icon.PinMap id="weather-icon" />
			<div id="weather-description">
				Error getting location
			</div>
		</div>
	);

	if(weather === false) return (
		<div id="weather">
			<Icon.ExclamationDiamond id="weather-icon" />
			<div id="weather-description">
				Error loading weather
			</div>
		</div>
	);

	console.log(weather)

	return (
		<div id="weather">
			<div id="weather-top">
				{getWeatherIcon(weather.icon.raw)}
				<div id="weather-main">
					<div id="weather-temp">
						{`${Number(weather?.temp.cur).toFixed(0)}°`}
					</div>
					<div id="weather-feels">
						Feels {`${Number(weather?.feels_like.cur).toFixed(0)}°`}
					</div>
				</div>
			</div>
			<div id="weather-description">{Utility.toTitleCase(weather?.description)}</div>
			<div id="weather-bottom">
				<div id="weather-rain">
					<Icon.UmbrellaFill />
					{`${weather?.rain}"`}
				</div>
				<div id="weather-wind">
					<Icon.Wind />
					{`${Number(weather?.wind.speed).toFixed(0)} ${degreesToCompass(weather?.wind.deg)}`}
				</div>
				<div id="weather-uv">
					<Icon.SunFill />
					{weather?.uvi}
				</div>
			</div>
		</div>
	);
}

export default Weather;
