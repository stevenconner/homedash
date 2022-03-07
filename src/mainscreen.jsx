import Chores from './components/chores.jsx';
import Dinners from './components/dinners.jsx';
import Lunches from './components/lunches.jsx';
import RainView from './components/rainview.jsx';
import WeatherForecast from './components/weatherforecast.jsx';
import { useState } from 'react';

function MainScreen({ unsplashApi }) {
	const [backgroundPhoto, setBackgroundPhoto] = useState(null);

	const getNewBackground = async () => {
		const result = await unsplashApi.photos.getRandom({
			query: 'landscape',
			count: 1,
			orientation: 'landscape',
		});
		if (result.status === 200) {
			setBackgroundPhoto(result.response[0].urls.full)
		}

		setTimeout(getNewBackground, 21600000) // fetch new image every 6 hours
	}

	if (!backgroundPhoto) {
		getNewBackground();
	}

	return (
		<div style={{ padding: 10, backgroundImage: `url("${backgroundPhoto}")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover', height: '100vh' }}>
			<div className="flex flex-row justify-between">
				<div>
					<RainView />
					<WeatherForecast />
				</div>
				<div> {/* width of the screen minus size of the weather stuff */}
					<div className="flex flex-row justify-between">
						<div className="ml2">
							<Chores />
						</div>
						<div className="ml2">
							<Lunches />
						</div>
						<div className="ml2">
							<Dinners />
						</div>
					</div>
					<div>
						{/* This will be the container for the calendar */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default MainScreen;
