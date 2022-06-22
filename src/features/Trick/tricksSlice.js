import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DECK_ID, GAME } from '../../logic/data';

const initialState = {
	loading: false,
	cards: [],
	error: '',
};

export const fetchTrick = createAsyncThunk('trick/fetchTrick', () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/Trick/list`;
	return fetch(endpoint)
		.then(res => res.json())
		.then(data => {
			let cards = data.piles.Trick.cards;
			GAME.next();
			return cards;
		});
});

const trickSlice = createSlice({
	name: 'trick',
	initialState,
	extraReducers: builder => {
		builder.addCase(fetchTrick.pending, state => {
			state.loading = true;
		});
		builder.addCase(fetchTrick.fulfilled, (state, action) => {
			state.loading = false;
			state.cards = action.payload;
		});
		builder.addCase(fetchTrick.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

export default trickSlice.reducer;
