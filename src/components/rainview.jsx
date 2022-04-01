import React from 'react';
import L from 'leaflet';
import moment from 'moment';

class RainView extends React.Component {
	animationTimer = false;

	constructor() {
		super();

		this.state = {
			apiData: {},
			mapFrames: [],
			lastPastFramePosition: -1,
			radarLayers: [],
			optionKind: 'radar',
			optionTileSize: 256, // Can be 256 or 512
			optionColorScheme: 4,
			optionSmoothData: 1,
			optionSnowColors: 1,
			animationPosition: 0,
		}
	}

	async componentDidMount() {
		// Set this to your home
		const homeCoordinates = [Number(String(process.env.REACT_APP_HOME_LAT)), Number(String(process.env.REACT_APP_HOME_LON))];
		this.map = L.map('map').setView(homeCoordinates, 5);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
		setTimeout(() => {
			L.marker(homeCoordinates).addTo(this.map);
			// Set these to whoever you know and care about for pinpointing weather
			L.circle([37.7635685,-120.8540201], {
				color: 'red',
				fillColor: 'red',
				fillOpacity: 1,
				radius: 10000
			}).addTo(this.map);
			L.circle([40.4460197,-122.307393], {
				color: 'red',
				fillColor: 'red',
				fillOpacity: 1,
				radius: 10000
			}).addTo(this.map);
			L.circle([43.6122541,-110.7142057], {
				color: 'red',
				fillColor: 'red',
				fillOpacity: 1,
				radius: 10000
			}).addTo(this.map);
			L.circle([43.6007846,-116.3041087], {
				color: 'red',
				fillColor: 'red',
				fillOpacity: 1,
				radius: 10000
			}).addTo(this.map);
			L.circle([37.5565308,-122.3506494], {
				color: 'red',
				fillColor: 'red',
				fillOpacity: 1,
				radius: 10000
			}).addTo(this.map);
		}, 5000)

		this.fetchMapData();
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	fetchMapData = () => {
		var apiRequest = new XMLHttpRequest();
		apiRequest.open("GET", "https://api.rainviewer.com/public/weather-maps.json", true);
		apiRequest.onload = (e) => {
			// store the API response for re-use purposes in memory
			const apiData = JSON.parse(apiRequest.response);
			this.setState({
				apiData,
			})
			this.initialize(apiData, this.state.optionKind);
		};
		apiRequest.send();
		this.timer = setTimeout(() => this.fetchMapData, 600000)
	}

	/**
	 * Initialize internal data from the API response and options
	 */
	initialize = (api, kind) => {
		// remove all already added tiled layers
		let { radarLayers, lastPastFramePosition } = this.state;
		for (var i in radarLayers) {
			this.map.removeLayer(radarLayers[i]);
		}
		let mapFrames = [];
		radarLayers = [];

		if (!api) {
			return;
		}
		mapFrames = api.radar.past.slice(-6);
		if (api.radar.nowcast) {
			mapFrames = mapFrames.concat(api.radar.nowcast);
		}

		this.setState({
			mapFrames,
			radarLayers,
			lastPastFramePosition,
		})
		// show the last "past" frame
		lastPastFramePosition = api.radar.past.length - 1;
		this.showFrame(lastPastFramePosition);
		this.playStop();
	}

	/**
		 * Stop the animation
		 * Check if the animation timeout is set and clear it.
		 */
	stop = () => {
		if (this.animationTimer) {
			clearTimeout(this.animationTimer);
			this.animationTimer = false;
			return true;
		}
		return false;
	}

	nextFrame = () => {
		const { animationPosition, mapFrames, optionTileSize, optionSmoothData, optionSnowColors } = this.state;
		if (!mapFrames.length) {
			return;
		}
		let newAnimationPosition = animationPosition + 1;
		let nextFrame = mapFrames[newAnimationPosition];
		if (!nextFrame) {
			nextFrame = mapFrames[0];
			newAnimationPosition = 0;
		}

		const newLayer = new L.TileLayer(
			this.state.apiData.host + nextFrame.path + '/' + optionTileSize + '/{z}/{x}/{y}/' + 4 + '/' + optionSmoothData + '_' + optionSnowColors + '.png',
			{
				tileSize: 256,
				opacity: 1,
				zIndex: nextFrame.time
			}
		);
		if (!this.map.hasLayer(newLayer)) {
			this.map.addLayer(newLayer);
		}
		this.setState({
			animationPosition: newAnimationPosition,
		})
	}

	play = () => {
		let { animationPosition } = this.state;
		this.showFrame(animationPosition + 1);

		// Main animation driver. Run this function every 2 seconds
		this.animationTimer = setTimeout(() => this.play(), 2000);
	}

	playStop = () => {
		if (!this.stop()) {
			this.play();
		}
	}

	/**
		 * Check avialability and show particular frame position from the timestamps list
		 */
	showFrame = (nextPosition) => {
		const preloadingDirection = nextPosition - this.state.animationPosition > 0 ? 1 : -1;

		this.changeRadarPosition(nextPosition);

		// preload next next frame (typically, +1 frame)
		// if don't do that, the animation will be blinking at the first loop
		this.changeRadarPosition(nextPosition + preloadingDirection, true);
	}

	/**
		 * Display particular frame of animation for the @position
		 * If preloadOnly parameter is set to true, the frame layer only adds for the tiles preloading purpose
		 * @param position
		 * @param preloadOnly
		 */
	changeRadarPosition = (pos, preloadOnly) => {
		const { mapFrames } = this.state;
		let { animationPosition, radarLayers } = this.state;
		let position = pos;
		while (position >= mapFrames.length) {
			position -= mapFrames.length;
		}
		while (position < 0) {
			position += mapFrames.length;
		}

		var currentFrame = mapFrames[animationPosition];
		var nextFrame = mapFrames[position];

		this.addLayer(nextFrame);

		if (preloadOnly) {
			return;
		}

		animationPosition = position;

		if (radarLayers[currentFrame.path]) {
			radarLayers[currentFrame.path].setOpacity(0);
		}
		radarLayers[nextFrame.path].setOpacity(100);

		document.getElementById("timestamp").innerHTML = `${moment(nextFrame.time * 1000).format('LT')} - ${moment(nextFrame.time * 1000).fromNow()}`
		this.setState({
			mapFrames,
			animationPosition,
			radarLayers,
		})
	}

	/**
	 * Animation functions
	 * @param path - Path to the XYZ tile
	 */
	addLayer = (frame) => {
		let { apiData, radarLayers, optionKind, optionColorScheme, optionSmoothData, optionSnowColors, optionTileSize } = this.state;
		if (!radarLayers[frame.path]) {
			const colorScheme = optionKind === 'satellite' ? 0 : optionColorScheme;
			const smooth = optionKind === 'satellite' ? 0 : optionSmoothData;
			const snow = optionKind === 'satellite' ? 0 : optionSnowColors;

			radarLayers[frame.path] = new L.TileLayer(apiData.host + frame.path + '/' + optionTileSize + '/{z}/{x}/{y}/' + colorScheme + '/' + smooth + '_' + snow + '.png', {
				tileSize: 256,
				opacity: 0.001,
				zIndex: frame.time
			});
		}
		if (!this.map.hasLayer(radarLayers[frame.path])) {
			this.map.addLayer(radarLayers[frame.path]);
		}
		this.setState({
			apiData,
			radarLayers,
			optionKind,
			optionColorScheme,
			optionSmoothData,
			optionSnowColors,
			optionTileSize,
		})
	}

	render() {
		const containerHeight = 400;
		const containerWidth = 600;
		const timestampWidth = 220;
		const timestampHeight = 20;
		return (
			<div className="shadow-1 mb3 overflow-hidden br2" style={{ width: containerWidth }}>
				<div
					id="timestamp"
					className="pv3 flex items-center justify-center"
					style={{
						textAlign: 'center',
						marginBottom: 10,
						position: 'absolute',
						zIndex: 999,
						top: containerHeight - 20 - timestampHeight,
						left: (containerWidth - timestampWidth) / 2,
						backgroundColor: 'white',
						width: timestampWidth,
						height: timestampHeight,
					}}
				></div>
				<div id="map" style={{ height: containerHeight, width: containerWidth }}></div>
			</div>
		);
	}
}

export default RainView;
