import React from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import Modal from 'react-modal';
import { ReactComponent as CloseIcon } from '../svg/close-circle-outline.svg';

class Dinners extends React.Component {
	state = {
		dinners: {
			Monday: '',
			Tuesday: '',
			Wednesday: '',
			Thursday: '',
			Friday: '',
			Saturday: '',
			Sunday: '',
		},
		showModal: false,
		selectedDay: '',
		newDinnerText: '',
	}

	componentDidMount() {
		const db = getDatabase();
		const dinnersRef = ref(db, '/dinners');
		onValue(dinnersRef, this.handleValueChange)
	}

	handleValueChange = (snapshot) => {
		const data = snapshot.val();
		if (data) {
			this.setState({
				dinners: data,
			})
		}
	}

	handleDayClick = (day) => {
		this.setState({
			showModal: true,
			selectedDay: day,
		})
	}

	handleSaveClick = () => {
		const { selectedDay, newDinnerText } = this.state;
		const db = getDatabase();
		set(ref(db, '/dinners/' + selectedDay), newDinnerText);
		this.closeModal();
	}

	handleChange = (event) => {
		this.setState({ newDinnerText: event.target.value });
	}

	renderDay = (day, dinnerText) => {
		return (
			<div onClick={() => this.handleDayClick(day)} className={`mb2 ph3 pointer flex flex-row justify-between items-center ba b--gray br3 ph2 pv3 mh2`}>
				<div className={`f3`}>
					{day}
				</div>
				<div className={`flex flex-column items-center justify-center ml4 mw5 f4`}>
					<div>
						{dinnerText}
					</div>
				</div>
			</div>
		)
	}

	closeModal = () => {
		this.setState({
			showModal: false,
			selectedDay: '',
			newDinnerText: '',
		})
	}

	render() {
		const { dinners, showModal, selectedDay, newDinnerText } = this.state;

		const modalStyle = {
			content: {
				top: '30%',
				left: '60%',
				right: 'auto',
				bottom: 'auto',
				marginRight: '-50%',
				transform: 'translate(-50%, -50%)',
				borderRadius: 6,
			},
		};

		return (
			<div className="pa3 shadow-1 overflow-auto" style={{ backgroundColor: 'white', borderRadius: 4, maxHeight: 600 }}>
				<div className="mb3 f2">
					Dinner Plans
				</div>
				{this.renderDay('Monday', dinners.Monday)}
				{this.renderDay('Tuesday', dinners.Tuesday)}
				{this.renderDay('Wednesday', dinners.Wednesday)}
				{this.renderDay('Thursday', dinners.Thursday)}
				{this.renderDay('Friday', dinners.Friday)}
				{this.renderDay('Saturday', dinners.Saturday)}
				{this.renderDay('Sunday', dinners.Sunday)}
				<Modal
					isOpen={showModal}
					onRequestClose={() => this.closeModal()}
					style={modalStyle}
					contentLabel="Example Modal"
				>
					<div style={{ position: 'absolute', top: 10, right: 10 }} onClick={() => this.closeModal()}>
						<CloseIcon style={{ width: 40, height: 40 }} />
					</div>
					<div className="mv5 flex flex-column justify-center">
						<h2 className="tc">What's for dinner on {selectedDay}?</h2>
						<form>
							<textarea value={newDinnerText} onChange={this.handleChange} className="w-100 h3 br2 f3" name="dinnerTextInput" cols="40" rows="2"></textarea>
						</form>
						<div onClick={() => this.handleSaveClick()} className="flex mt3 h3 f3 w-25 self-center br3 ba items-center justify-center">
							Save
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

export default Dinners;
