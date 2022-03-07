import React from 'react';
import ReactWeather, { useOpenWeather, useWeatherBit } from 'react-open-weather';

const ReactWeatherComponent = ({ lat, lon }) => {
	// const { data, isLoading, errorMessage } = useOpenWeather({
	// 	key: process.env.REACT_APP_OPEN_WEATHER_API_KEY,
	// 	lang: 'en',
	// 	unit: 'imperial', // values are (metric, standard, imperial)
	// 	lat,
	// 	lon,
	// });
	const { data, isLoading, errorMessage } = useWeatherBit({
		key: process.env.REACT_APP_WEATHER_BIT_API_KEY,
		lang: 'en',
		unit: 'I', // values are (M,S,I)
		lat,
		lon,
	});
	const customStyles = {
		fontFamily: 'Helvetica, sans-serif',
		gradientStart: '#0181C2',
		gradientMid: '#04A7F9',
		gradientEnd: '#4BC4F7',
		locationFontColor: '#FFF',
		todayTempFontColor: '#FFF',
		todayDateFontColor: '#B5DEF4',
		todayRangeFontColor: '#B5DEF4',
		todayDescFontColor: '#B5DEF4',
		todayInfoFontColor: '#B5DEF4',
		todayIconColor: '#FFF',
		forecastBackgroundColor: '#FFF',
		forecastSeparatorColor: '#DDD',
		forecastDateColor: '#777',
		forecastDescColor: '#777',
		forecastRangeColor: '#777',
		forecastIconColor: '#4BC4F7',
	};
	return (
		<ReactWeather
			theme={customStyles}
			isLoading={isLoading}
			errorMessage={errorMessage}
			data={data}
			lang="en"
			locationLabel={`${process.env.REACT_APP_HOME_CITY}, ${process.env.REACT_APP_HOME_STATE}`}
			unitsLabels={{ temperature: 'F', windSpeed: 'M/h' }}
			showForecast
		/>
	);
};

class WeatherForecast extends React.Component {
	state = {
		lat: process.env.REACT_APP_HOME_LAT,
		lon: process.env.REACT_APP_HOME_LON,
		direction: 'pos',
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			const { direction, lat, lon } = this.state;
			let newLat = parseFloat(lat);
			const newDirection = direction === 'pos' ? 'neg' : 'pos';
			if (direction === 'pos') {
				newLat = newLat + 0.00000001;
			} else {
				newLat = newLat - 0.00000001;
			}
			this.setState({
				lat: newLat.toString(),
				lon,
				direction: newDirection,
			})
		}, 300000) // every 5 minutes - 300000
	}
	
	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {
		return (
			<div className="shadow-1 br2" style={{ width: 600 }}>
				<ReactWeatherComponent lat={this.state.lat} lon={this.state.lon} />
			</div>
		);
	}
}

export default WeatherForecast;
