import React, { useEffect, useState } from 'react';
import OpenWeatherAPI from 'openweather-api-node';
import * as Icon from 'react-bootstrap-icons';
import * as Utility from '../../../scripts/utility';

import '../../../css/weather.css';

export const Weather = props => {
	const [weather, setWeather] = useState(null);

	const updateWeather = () => {
		const weatherAPI = new OpenWeatherAPI({
			key: process.env.REACT_APP_OPEN_WEATHER_API_KEY,
			locationName: "Port Orange, Florida",
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

	const degreesToCompass = direction => {
		const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
		const angle = direction % 360;
		const index = Math.round((angle < 0 ? angle + 360 : angle) / 45) % 8;

		return directions[index];
	};

	useEffect(() => {
		const interval = setInterval(updateWeather, 1800000); // 30 minutes

		return () => clearInterval(interval);
	}, []);

	useEffect(updateWeather, []);

	if(weather === null) return (
		<div id="weather">
			<Icon.CloudArrowDown id="weather-icon" />
			<div id="weather-description">
				Weather loading...
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

	return (
		<div id="weather">
			<div id="weather-top">
				<Icon.CloudSun id="weather-icon" />
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
					<Icon.DropletHalf />
					{`${weather?.rain}%`}
				</div>
				<div id="weather-wind">
					<Icon.Wind />
					{`${Number(weather?.wind.speed).toFixed(1)}${degreesToCompass(weather?.wind.deg)}`}
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
