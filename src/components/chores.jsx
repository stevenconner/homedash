import React from 'react';
import { getDatabase, ref, onValue, set, push } from 'firebase/database';
import _ from 'lodash';
import { convertToUSD } from '../utils';
import { ReactComponent as EmptySquare } from '../svg/square-outline.svg';
import { ReactComponent as CheckedSquare } from '../svg/checkbox-outline.svg';
import Modal from 'react-modal';
import { ReactComponent as CloseIcon } from '../svg/close-circle-outline.svg';
import { ReactComponent as MinusIcon } from '../svg/remove-circle-outline.svg';
import { ReactComponent as PlusIcon } from '../svg/add-circle-outline.svg';

class Chores extends React.Component {
	state = {
		choresList: [],
		totalAllTime: 0,
		totalUnpaid: 0,
		showModal: false,
		newChoreDescription: '',
		newChoreWorth: 0,
		modalContent: '',
		selectedChore: null,
		passcode: '',
		codeRequester: '',
	}

	componentDidMount() {
		const db = getDatabase();
		const fullRef = ref(db);
		onValue(fullRef, this.handleValueChange)
	}

	handleValueChange = (snapshot) => {
		const data = snapshot.val();

		// Parse the data from the snapshot
		const { chores = {}, totalUnpaid = 0, totalAllTime = 0 } = data;
		const choresList = _.map(chores, (chore, key) => {
			return { key, ...chore };
		})
		this.setState({
			choresList,
			totalAllTime,
			totalUnpaid,
		})
	}

	updateChore = (chore) => {
		const { choresList } = this.state;
		const newChoresList = choresList.map((stateChore) => {
			if (chore.key === stateChore.key) {
				return chore;
			} else {
				return stateChore;
			}
		})
		this.setState({
			choresList: newChoresList,
		})
		const db = getDatabase();
		set(ref(db, '/chores/' + chore.key), chore)
	}

	handleChoreClick = (chore) => {
		const { status } = chore;
		// Set state for quick ui responsiveness, then update firebase
		let newStatus = status;
		if (status === 'incomplete') {
			newStatus = 'pending';
		} else if (status === 'pending') {
			// At this point we need to show a dialog to have the parent confirm the chore is completed
			this.setState({
				showModal: true,
				modalContent: 'confirmComplete',
				selectedChore: chore,
			})
			return;
		}
		const newChore = {
			...chore,
			status: newStatus,
		}
		this.updateChore(newChore);
	}

	handleClearConfirmPress = () => {
		this.setState({
			modalContent: 'enterPasscode',
			codeRequester: 'clearComplete'
		})
	}

	handleClearClick = () => {
		this.setState({
			showModal: true,
			modalContent: 'clearChores'
		})
	}

	handleAddClick = () => {
		this.setState({
			showModal: true,
			modalContent: 'addChore'
		})
	}

	renderIncompleteChores = () => {
		const { choresList } = this.state;
		const chores = [];
		choresList.length && choresList.forEach((chore) => {
			if (chore.status === 'incomplete') {
				chores.push(
					<div key={chore.key} onClick={() => this.handleChoreClick(chore)} className="mb2 pointer flex flex-row items-center ba b--gray br3 pa2 f5">
						<div style={{ height: 30, width: 30 }}>
							<EmptySquare style={{ height: 30, width: 30 }} />
						</div>
						<div className="ml2 mw5">
							{chore.description} - {convertToUSD(chore.worth)}
						</div>
					</div>
				);
			}
		})
		if (chores.length) {
			return (
				<div>
					<div className="f3 bold mb1">To Do</div>
					{chores}
				</div>
			);
		}
	}

	renderPendingChores = () => {
		const { choresList } = this.state;
		const pendingChores = [];
		choresList.length && choresList.forEach((chore) => {
			if (chore.status === 'pending') {
				pendingChores.push(
					<div key={chore.key} onClick={() => this.handleChoreClick(chore)} className="mb2 pointer flex flex-row items-center ba b--light-silver br3 pa2 f5">
						<div style={{ height: 30, width: 30 }}>
							<CheckedSquare color={'#AAAAAA'} style={{ height: 30, width: 30 }} />
						</div>
						<div className="ml2 light-silver strike mw5">
							{chore.description} - {convertToUSD(chore.worth)}
						</div>
					</div>
				);
			}
		})
		if (pendingChores.length) {
			return (
				<div>
					<div className="f3 bold mt3 mb1">Pending Approval</div>
					{pendingChores}
				</div>
			);
		}
	}

	renderCompletedChores = () => {
		const { choresList } = this.state;
		const completedChores = [];
		choresList.length && choresList.forEach((chore) => {
			if (chore.status === 'completed') {
				completedChores.push(
					<div key={chore.key} onClick={() => this.handleChoreClick(chore)} className="mb2 pointer flex flex-row items-center ba b--light-silver br3 pa2 f5">
						<div style={{ height: 30, width: 30 }}>
							<CheckedSquare color={'#AAAAAA'} style={{ height: 30, width: 30 }} />
						</div>
						<div className="ml2 light-silver strike mw5">
							{chore.description} - {convertToUSD(chore.worth)}
						</div>
					</div>
				);
			}
		})
		if (completedChores.length) {
			return (
				<div>
					<div className="f3 bold mt3 mb1">Completed</div>
					{completedChores}
				</div>
			);
		}
	}

	renderTotalUnpaid = () => {
		const { totalUnpaid } = this.state;
		return (
			<div className="f4 flex flex-row justify-between">
				<div>
					Total To Pay:
				</div>
				<div className="b ml3">
					{convertToUSD(totalUnpaid)}
				</div>
			</div>
		);
	}

	renderTotalEarnedAllTime = () => {
		const { totalAllTime } = this.state;
		return (
			<div className="mt2 f4 flex flex-row justify-between">
				<div>
					Lifetime Total:
				</div>
				<div className="b">
					{convertToUSD(totalAllTime)}
				</div>
			</div>
		);
	}

	closeModal = () => {
		this.setState({
			showModal: false,
			newChoreDescription: '',
			newChoreWorth: 0,
			selectedChore: null,
			passcode: '',
			codeRequester: '',
		})
	}

	handleDescriptionChange = (event) => {
		this.setState({ newChoreDescription: event.target.value });
	}

	handleMinusClick = () => {
		const { newChoreWorth } = this.state;
		let adjustedChoreWorth = newChoreWorth - 0.25;
		if (adjustedChoreWorth >= 0) {
			this.setState({
				newChoreWorth: adjustedChoreWorth,
			})
		}
	}

	handlePlusClick = () => {
		const { newChoreWorth } = this.state;
		this.setState({
			newChoreWorth: newChoreWorth + 0.25,
		})
	}

	handleSaveClick = () => {
		const { newChoreWorth, newChoreDescription } = this.state;

		const db = getDatabase();
		const choreListRef = ref(db, '/chores');
		const newChoreRef = push(choreListRef);
		set(newChoreRef, {
			description: newChoreDescription,
			worth: newChoreWorth,
			status: 'incomplete',
		});
		this.closeModal();
	}

	handleClearConfirm = () => {
		const { choresList } = this.state;
		const newChoresObj = {};
		choresList.forEach((chore) => {
			if (chore.status !== 'completed') {
				newChoresObj[chore.key] = {
					status: chore.status,
					description: chore.description,
					worth: chore.worth,
				};
			}
		});

		const db = getDatabase();
		set(ref(db, '/chores'), newChoresObj);
		set(ref(db, '/totalUnpaid'), 0);
		this.closeModal();
	}

	handleIncompleteClick = () => {
		const { selectedChore } = this.state;
		this.updateChore({
			...selectedChore,
			status: 'incomplete',
		})
		this.closeModal();
	}

	handleCompleteClick = () => {
		this.setState({
			modalContent: 'enterPasscode',
			codeRequester: 'confirmComplete'
		})
	}

	handlePasscodeConfirm = () => {
		const { passcode, codeRequester } = this.state;
		if (passcode === process.env.REACT_APP_SECRET_PASSCODE) {
			if (codeRequester === 'confirmComplete') {
				this.handleCompleteConfirm();
			} else if (codeRequester === 'clearComplete') {
				this.handleClearConfirm();
			}
		} else {
			this.setState({
				passcode: '',
			})
		}
	}

	handleCompleteConfirm = () => {
		const { selectedChore, totalUnpaid, totalAllTime } = this.state;
		this.updateChore({
			...selectedChore,
			status: 'completed',
		})
		this.closeModal();

		let newTotalUnpaid = totalUnpaid + selectedChore.worth;
		let newTotalAllTime = totalAllTime + selectedChore.worth;
		const db = getDatabase();
		set(ref(db, '/totalUnpaid'), newTotalUnpaid);
		set(ref(db, '/totalAllTime'), newTotalAllTime);
	}

	renderModalContent = () => {
		const { modalContent } = this.state;
		if (modalContent === 'addChore') {
			const { newChoreDescription, newChoreWorth } = this.state;
			return (
				<div className="mv5 flex flex-column justify-center">
					<h2 className="tc">New Chore</h2>
					<form>
						<label>Description</label>
						<textarea value={newChoreDescription} onChange={this.handleDescriptionChange} className="w-100 h3 br2 f3" name="dinnerTextInput" cols="40" rows="2"></textarea>
						<div className="flex flex-row items-center justify-center mt4 mb2">
							<div onClick={() => this.handleMinusClick()}>
								<MinusIcon style={{ width: 40, height: 40 }} />
							</div>
							<div className="f2 mh4">{convertToUSD(newChoreWorth)}</div>
							<div onClick={() => this.handlePlusClick()}>
								<PlusIcon style={{ width: 40, height: 40 }} />
							</div>
						</div>
					</form>
					<div onClick={() => this.handleSaveClick()} className="flex mt3 h3 f3 w-25 self-center br3 ba items-center justify-center">
						Save
					</div>
				</div>
			);
		} else if (modalContent === 'clearChores') {
			return (
				<div className="mv5 flex flex-column justify-center">
					<h2 className="tc">Are you SURE you want to clear completed chores?</h2>
					<div className="flex flex-row justify-around items-center">
						<div onClick={() => this.closeModal()} className="flex mt3 h3 f3 w-25 self-center br3 ba items-center justify-center">
							Cancel
						</div>
						<div onClick={() => this.handleClearConfirmPress()} className="flex mt3 h3 f3 w-25 self-center br3 ba items-center justify-center bg-dark-red b--dark-red white">
							Confirm
						</div>
					</div>
				</div>
			);
		} else if (modalContent === 'confirmComplete') {
			return (
				<div className="mv5 flex flex-column justify-center">
					<h2 className="tc">Is this chore completed?</h2>
					<div className="flex flex-row justify-around items-center">
						<div onClick={() => this.handleIncompleteClick()} className="flex mt3 h3 f3 w-25 self-center br3 ba items-center justify-center bg-dark-red b--dark-red white">
							Incomplete
						</div>
						<div onClick={() => this.handleCompleteClick()} className="flex mt3 h3 f3 w-25 self-center br3 ba items-center justify-center bg-green b--green white">
							Completed
						</div>
					</div>
				</div>
			);
		} else if (modalContent === 'enterPasscode') {
			return (
				<div className="mv5 flex flex-column justify-center">
					<h2 className="tc">Enter Passcode</h2>
					<div className="f3 tc">{this.state.passcode}</div>
					<div className="flex flex-row justify-around items-center ph4 mt4">
						<div onClick={() => this.setState({passcode: this.state.passcode + '1'})} style={{ width: 80 }} className="ba pa2 f1 br3 flex items-center justify-center">
							1
						</div>
						<div onClick={() => this.setState({passcode: this.state.passcode + '2'})} style={{ width: 80 }} className="ba pa2 f1 br3 flex items-center justify-center">
							2
						</div>
						<div onClick={() => this.setState({passcode: this.state.passcode + '3'})} style={{ width: 80 }} className="ba pa2 f1 br3 flex items-center justify-center">
							3
						</div>
						<div onClick={() => this.setState({passcode: this.state.passcode + '4'})} style={{ width: 80 }} className="ba pa2 f1 br3 flex items-center justify-center">
							4
						</div>
					</div>
					<div onClick={() => this.handlePasscodeConfirm()} className="flex mt4 h3 f3 w-25 self-center br3 ba items-center justify-center bg-green b--green white">
							Confirm
						</div>
				</div>
			);
		}
	}

	render() {
		const { showModal } = this.state;

		const modalStyle = {
			content: {
				top: '30%',
				left: '75%',
				right: 'auto',
				bottom: 'auto',
				marginRight: '-50%',
				transform: 'translate(-50%, -50%)',
				borderRadius: 6,
				width: 600,
			},
		};

		return (
			<div className="pa3 shadow-1 flex flex-column" style={{ backgroundColor: 'white', borderRadius: 4, maxHeight: 812, width: 310 }}>
				<div className="mb3 f3">
					{process.env.REACT_APP_CHILD_NAME}'s Chores
				</div>
				<div className="flex flex-row justify-between mb2">
					<div onClick={() => this.handleClearClick()} className="mb2 pointer flex flex-row items-center ba br3 pa2 f5">Clear Completed</div>
					<div onClick={() => this.handleAddClick()} className="mb2 pointer flex flex-row items-center ba br3 pa2 f5 ml2">Add Chore</div>
				</div>
				<div className="mb3">
					{this.renderTotalUnpaid()}
					{this.renderTotalEarnedAllTime()}
				</div>
				<div className="overflow-scroll">
					{this.renderIncompleteChores()}
					{this.renderPendingChores()}
					{this.renderCompletedChores()}
				</div>
				<Modal
					isOpen={showModal}
					onRequestClose={() => this.closeModal()}
					style={modalStyle}
					contentLabel="Example Modal"
				>
					<div style={{ position: 'absolute', top: 10, right: 10 }} onClick={() => this.closeModal()}>
						<CloseIcon style={{ width: 40, height: 40 }} />
					</div>
					{this.renderModalContent()}
				</Modal>
			</div>
		);
	}
}

export default Chores;
