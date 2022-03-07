# HomeDash - Built with Create React App

This React app is intended to be run on some type of home server, and then accessed from a 1920x1080 resolution tablet of some kind in the house. It was built with only one child in mind. It's been pretty customized to what my family wants, so it's got a precipitation/snow map using Rainviewer (https://www.rainviewer.com/api.html). It's got a weather forecast widget (thanks to https://github.com/farahat80/react-open-weather), a chore system (payouts need to be done manually, there is no logic to automate payouts to any system), a hot/cold lunch selection, and a basic dinner planner. It uses Unsplash for a fresh background every 6 hours.

![Screenshot](screenshot.png?raw=true)

In order for this to function properly, you'll need to create a firebase app with a real time database. I attempted to add some basic null checking so it might work with an absolutely fresh firebase RTDB but it may not work.

You'll need to create a .env file with these contents in it:

`REACT_APP_FIREBASE_API_KEY = ""` - Comes from firebase

`REACT_APP_FIREBASE_AUTH_DOMAIN = ""` - Comes from firebase

`REACT_APP_FIREBASE_PROJECT_ID = ""` - Comes from firebase

`REACT_APP_FIREBASE_STORAGE_BUCKET = ""` - Comes from firebase

`REACT_APP_FIREBASE_MESSAGING_SENDER_ID = ""` - Comes from firebase

`REACT_APP_FIREBASE_APP_ID = ""` - Comes from firebase

`REACT_APP_UNSPLASH_API_KEY = ""` - sign up at https://unsplash.com/developers

`REACT_APP_WEATHER_BIT_API_KEY = ""` - You can choose between weatherbit and open weather for weather data, so you only need one of these api keys. https://www.weatherbit.io/

`REACT_APP_OPEN_WEATHER_API_KEY = ""` - You can choose between weatherbit and open weather for weather data, so you only need one of these api keys. https://openweathermap.org/api

`REACT_APP_CHILD_NAME = ""` - Should be your child's name

`REACT_APP_SECRET_PASSCODE = ""` - This will be a secret pass code that you will use to confirm chore completions. Numbers 1-4, i used 4 digits but it will accept anything that matches.

`REACT_APP_HOME_LAT = ""` - This should be your home's latitude in a string

`REACT_APP_HOME_LON = ""` - This should be your home's longitude in a string

`REACT_APP_HOME_CITY = ""` - This should be your home city name

`REACT_APP_HOME_STATE = ""` - This should be your home state abbreviation i.e. CA


Edit the weatherforecast.jsx file to select between openweather and weatherbit, just comment out the weatherbit code and uncomment the openweather code.

This is not intended to be sold, only to be used within a household.
