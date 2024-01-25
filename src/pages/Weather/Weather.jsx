import React, { useEffect, useState } from 'react';
import OpenWeatherAPI from 'openweather-api-node';
import * as Icon from 'react-bootstrap-icons';
import Location from '../../components/Location';
import * as Utility from '../../scripts/utility';

import '../../css/weather.css';

const updateInterval = 900000; // 15 minutes
const failureTolerance = 5;

export const Weather = (props) => {
	const [weather, setWeather] = useState(null);
	const [failures, setFailures] = useState(0);

	const updateWeather = (location) => {
		if (!process.env.REACT_APP_OPEN_WEATHER_API_KEY) {
			setWeather(false);
			return;
		}

		if (!location.latitude || !location.longitude) return;

		let weatherAPI;

		try {
			weatherAPI = new OpenWeatherAPI({
				key: process.env.REACT_APP_OPEN_WEATHER_API_KEY,
				coordinates: {
					lat: location?.latitude,
					lon: location?.longitude,
				},
				units: 'imperial',
			});
		}
		catch (err) {
			console.error(err);

			if (failures >= failureTolerance - 1) {
				setWeather(false);
			}
			else {
				setFailures((currentFailures) => currentFailures + 1);
				setTimeout(updateWeather, 1000); // 1 second
			}

			return;
		}

		weatherAPI
			.getCurrent()
			.then((data) => {
				setWeather(data.weather);
			})
			.catch((err) => {
				setWeather(false);
			});
	};

	const getWeatherIcon = (code) => {
		const id = 'weather-icon';

		switch (code) {
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
	};

	const degreesToCompass = (direction) => {
		const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
		const angle = direction % 360;
		const index = Math.round((angle < 0 ? angle + 360 : angle) / 45) % 8;

		return directions[index];
	};

	if (weather === null)
		return (
			<div id="weather">
				<Location interval={updateInterval} onUpdate={updateWeather} />
				<Icon.CloudArrowDown id="weather-icon" />
				<div id="weather-description">Weather loading...</div>
			</div>
		);

	if (weather === false)
		return (
			<div id="weather">
				<Location interval={updateInterval} onUpdate={updateWeather} />
				<Icon.ExclamationDiamond id="weather-icon" />
				<div id="weather-description">Error loading weather</div>
			</div>
		);

	return (
		<div id="weather">
			<Location interval={updateInterval} onUpdate={updateWeather} />
			<div id="weather-top">
				{getWeatherIcon(weather.icon.raw)}
				<div id="weather-main">
					<div
						id="weather-temp"
						className="show-unlit"
						data-unlit={Utility.generateUnlitLCD(`${Number(weather?.temp.cur).toFixed(0)}°`)}
					>
						{`${Number(weather?.temp.cur).toFixed(0)}°`}
					</div>
					<div
						id="weather-feels"
						className="show-unlit"
						data-unlit={Utility.generateUnlitLCD(`Feels ${Number(weather?.feels_like.cur).toFixed(0)}°`)}
					>
						{`Feels ${Number(weather?.feels_like.cur).toFixed(0)}°`}
					</div>
				</div>
			</div>

			<div
				id="weather-description"
				className="show-unlit"
				data-unlit={Utility.generateUnlitLCD(Utility.toTitleCase(weather?.description))}
			>
				{Utility.toTitleCase(weather?.description)}
			</div>

			<div id="weather-bottom">
				<div id="weather-rain">
					<Icon.UmbrellaFill />

					<span className="show-unlit" data-unlit={Utility.generateUnlitLCD(`${weather?.rain}"`)}>
						{`${weather?.rain}"`}
					</span>
				</div>

				<div id="weather-wind">
					<Icon.Wind />

					<span
						className="show-unlit"
						data-unlit={Utility.generateUnlitLCD(
							`${Math.round(weather?.wind.speed)} ${degreesToCompass(weather?.wind.deg)}`,
						)}
					>
						{`${Math.round(weather?.wind.speed)} ${degreesToCompass(weather?.wind.deg)}`}
					</span>
				</div>

				<div id="weather-uv">
					<Icon.SunFill />

					<span className="show-unlit" data-unlit={Utility.generateUnlitLCD(String(Math.round(weather?.uvi || 0)))}>
						{Math.round(weather?.uvi || 0)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default Weather;
