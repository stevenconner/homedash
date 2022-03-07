import Reactotron from 'reactotron-react-js'

Reactotron
	.configure() // controls connection & communication settings
	.connect() // let's connect!

console.tron = Reactotron;

export default Reactotron;
