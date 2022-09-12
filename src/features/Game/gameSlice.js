import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	selectedCards: [],
	selectionLimit: 3,
	handCounter: 0,
	status: null,
	notif: '',
	gameOver: {
		isOver: true,
		winner: '',
	},
};

const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		addCard: (state, action) => {
			state.selectedCards.push(action.payload);
		},
		removeCard: (state, action) => {
			let index = state.selectedCards.findIndex(cardIndex => cardIndex == action.payload);
			state.selectedCards.splice(index, 1);
		},
		clearCards: state => {
			state.selectedCards.splice(0, state.selectedCards.length);
		},
		setLimit: (state, action) => {
			state.selectionLimit = action.payload;
		},
		setHandCounter: (state, action) => {
			state.handCounter = action.payload;
		},
		setStatus: (state, action) => {
			state.status = action.payload;
		},
		setNotif: (state, action) => {
			state.notif = action.payload;
		},
		setGameOver: (state, action) => {
			state.gameOver = action.payload;
		},
	},
});

// action creators
export const addCard = card => {
	return {
		type: 'game/addCard',
		payload: card,
	};
};
export const removeCard = cardIndex => {
	return {
		type: 'game/removeCard',
		payload: cardIndex,
	};
};
export const clearCards = () => {
	return {
		type: 'game/clearCards',
	};
};
export const setLimit = value => {
	return {
		type: 'game/setLimit',
		payload: value,
	};
};
export const setHandCounter = value => {
	return {
		type: 'game/setHandCounter',
		payload: value,
	};
};
export const setStatus = value => {
	return {
		type: 'game/setStatus',
		payload: value,
	};
};
export const setNotif = value => {
	return {
		type: 'game/setNotif',
		payload: value,
	};
};
export const setGameOver = value => {
	return {
		type: 'game/setGameOver',
		payload: value,
	};
};

export default gameSlice.reducer;
