import React from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { ReactComponent as LunchBag } from '../svg/bag-outline.svg';
import { ReactComponent as HotLunch } from '../svg/fast-food-outline.svg';

class Lunches extends React.Component {
	state = {
		lunches: {
			Monday: '',
			Tuesday: '',
			Wednesday: '',
			Thursday: '',
			Friday: '',
		},
	}

	componentDidMount() {
		const db = getDatabase();
		const lunchesRef = ref(db, '/lunches');
		onValue(lunchesRef, this.handleValueChange)
	}

	handleValueChange = (snapshot) => {
		const data = snapshot.val();
		if (data) {
			this.setState({
				lunches: data,
			})
		}
	}

	handleDayClick = (day, lunchType) => {
		const newLunchType = lunchType === 'Cold' ? 'Hot' : 'Cold';
		this.setState((state) => {
			state[day] = newLunchType;
		})

		const db = getDatabase();
		set(ref(db, '/lunches/' + day), newLunchType);
	}

	renderDay = (day, lunchType) => {
		const color = lunchType === 'Cold' ? 'dark-blue' : 'dark-red';
		return (
			<div onClick={() => this.handleDayClick(day, lunchType)} className={`mb2 ph3 pointer flex flex-row justify-between items-center ba b--gray br3 pa2 b--${color}`}>
				<div className={`${color} f3`}>
					{day}
				</div>
				<div className={`flex flex-column items-center justify-center ${lunchType === 'Cold' ? '' : 'mr1'}`}>
					{lunchType === 'Cold' ? <LunchBag color="#00449E" style={{ height: 26, width: 26 }} /> : <HotLunch style={{ height: 26, width: 26 }} color="#E7040F" />}
					<div className={`${lunchType === 'Cold' ? 'dark-blue' : 'dark-red'}`}>
						{lunchType}
					</div>
				</div>
			</div>
		)
	}

	render() {
		const { lunches } = this.state;
		return (
			<div className="pa3 shadow-1" style={{ backgroundColor: 'white', borderRadius: 4 }}>
				<div className="mb3 f2">
					{process.env.REACT_APP_CHILD_NAME}'s Lunches
				</div>
				{this.renderDay('Monday', lunches.Monday)}
				{this.renderDay('Tuesday', lunches.Tuesday)}
				{this.renderDay('Wednesday', lunches.Wednesday)}
				{this.renderDay('Thursday', lunches.Thursday)}
				{this.renderDay('Friday', lunches.Friday)}
			</div>
		);
	}
}

export default Lunches;
