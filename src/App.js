import './App.css';
import MainScreen from './mainscreen.jsx';
import { Helmet } from "react-helmet";
import { createApi } from 'unsplash-js';
import { initializeApp } from "firebase/app";

function App() {
	const firebaseConfig = {
		apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
		authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
		projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
		storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.REACT_APP_FIREBASE_APP_ID,
	};


	// Initialize Firebase
	initializeApp(firebaseConfig);

	// on your node server
	const unsplashApi = createApi({
		accessKey: process.env.REACT_APP_UNSPLASH_API_KEY,
	});

	return (
		<div className="App">
			<Helmet>
				<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""></link>
				<link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css"></link>
				<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
			</Helmet>
			<MainScreen unsplashApi={unsplashApi} />
		</div>
	);
}

export default App;
