import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OpenWeatherAPI from 'openweather-api-node';
import * as Icon from 'react-bootstrap-icons';
import * as Utility from '../../scripts/utility';
import storeActions from '../../store/store.redux';
import { selectGPSState, selectTimestampState, selectWeatherState } from '../../store/store.selectors';

import '../../css/weather.css';

const updateInterval = 900000; // 15 minutes
const failureTolerance = 5;

export const Weather = (props) => {
	const dispatch = useDispatch();
	const timestamps = useSelector(selectTimestampState);
	const weather = useSelector(selectWeatherState);
	const location = useSelector(selectGPSState);
	const [loop, setLoop] = useState(0);
	const [failures, setFailures] = useState(0);

	const updateWeather = () => {
		console.log('WEATHER', weather);
		if (!process.env.REACT_APP_OPEN_WEATHER_API_KEY) {
			dispatch(storeActions.setWeather(false));
			return;
		}

		if (process.env.NODE_ENV === 'production' && (!location?.latitude || !location?.longitude)) return;

		let weatherAPI;

		try {
			weatherAPI = new OpenWeatherAPI({
				key: process.env.REACT_APP_OPEN_WEATHER_API_KEY,
				coordinates: {
					lat: location?.latitude || 29.1164897,
					lon: location?.longitude || -81.0270001,
				},
				units: 'imperial',
			});
		}
		catch (err) {
			console.error(err);

			if (failures >= failureTolerance - 1) {
				dispatch(storeActions.setWeather(false));
			}
			else {
				setFailures((currentFailures) => currentFailures + 1);
				// setLoop(setTimeout(updateWeather, 5000)); // 5 seconds
			}

			return;
		}

		weatherAPI
			.getCurrent()
			.then((data) => dispatch(storeActions.setWeather(Utility.serializeDates({ ...data, ...data.weather }))))
			.catch((err) => dispatch(storeActions.setWeather(false)));
	};

	const getWeatherIcon = (code) => {
		const className = 'big-icon';

		switch (code) {
			case '01d':
				return <Icon.Sun className={className} />;
			case '01n':
				return <Icon.MoonStars className={className} />;
			case '02d':
				return <Icon.CloudSun className={className} />;
			case '02n':
				return <Icon.CloudMoon className={className} />;
			case '03d':
			case '03n':
				return <Icon.Cloud className={className} />;
			case '04d':
			case '04n':
				return <Icon.Clouds className={className} />;
			case '09d':
			case '09n':
				return <Icon.CloudDrizzle className={className} />;
			case '10d':
			case '10n':
				return <Icon.CloudRainHeavy className={className} />;
			case '11d':
			case '11n':
				return <Icon.CloudLightningRain className={className} />;
			case '13d':
			case '13n':
				return <Icon.Snow2 className={className} />;
			case '50d':
			case '50n':
				return <Icon.CloudHaze2 className={className} />;
			default:
				return <Icon.QuestionLg className={className} />;
		}
	};

	const degreesToCompass = (direction) => {
		const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
		const angle = direction % 360;
		const index = Math.round((angle < 0 ? angle + 360 : angle) / 45) % 8;

		return directions[index];
	};

	useEffect(() => {
		updateWeather();
		setLoop(setInterval(updateWeather, updateInterval));

		return () => clearInterval(loop);
	}, []);

	if (weather === null)
		return (
			<div className="loading-screen">
				<Icon.CloudArrowDown className="big-icon" />
				<div
					id="weather-description"
					className="show-unlit"
					data-unlit={Utility.generateUnlitLCD('Weather loading...')}
				>
					Weather loading...
				</div>
			</div>
		);

	if (weather === false)
		return (
			<div className="loading-screen">
				<Icon.ExclamationDiamond className="big-icon" />
				<div
					id="weather-description"
					className="show-unlit"
					data-unlit={Utility.generateUnlitLCD('Error loading weather')}
				>
					Error loading weather
				</div>
			</div>
		);

	return (
		<div id="weather">
			<div id="weather-top">
				{getWeatherIcon(weather?.icon?.raw)}
				<div id="weather-main">
					<div
						id="weather-temp"
						className="show-unlit"
						data-unlit={Utility.generateUnlitLCD(`${Number(weather?.temp?.cur).toFixed(0)}°`)}
					>
						{`${Number(weather?.temp?.cur).toFixed(0)}°`}
					</div>
					<div
						id="weather-feels"
						className="show-unlit"
						data-unlit={Utility.generateUnlitLCD(`Feels ${Number(weather?.feelsLike?.cur).toFixed(0)}°`)}
					>
						{`Feels ${Number(weather?.feelsLike?.cur).toFixed(0)}°`}
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
					{weather?.temp?.cur < 32 ? <Icon.Snow /> : <Icon.UmbrellaFill />}

					<span
						className="show-unlit"
						data-unlit={Utility.generateUnlitLCD(`${weather?.temp?.cur < 32 ? weather?.snow : weather?.rain}"`)}
					>
						{`${weather?.temp?.cur < 32 ? weather?.snow : weather?.rain}"`}
					</span>
				</div>

				<div id="weather-wind">
					<Icon.Wind />

					<span
						className="show-unlit"
						data-unlit={Utility.generateUnlitLCD(
							`${Math.round(weather?.wind?.speed)} ${degreesToCompass(weather?.wind?.deg)}`,
						)}
					>
						{`${Math.round(weather?.wind?.speed)} ${degreesToCompass(weather?.wind?.deg)}`}
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
