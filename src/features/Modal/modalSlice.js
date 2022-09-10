import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	open: false,
	type: '',
	paused: false,
};

const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		showModal: (state, action) => {
			let { type, paused } = action.payload;
			state.open = true;
			state.type = type;
			state.paused = paused;
		},
		closeModal: state => {
			state.open = false;
		},
	},
});

export const showModal = value => {
	return {
		type: 'modal/showModal',
		payload: value,
	};
};

export const closeModal = () => {
	return {
		type: 'modal/closeModal',
	};
};

export default modalSlice.reducer;
