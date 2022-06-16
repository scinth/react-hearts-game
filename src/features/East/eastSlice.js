import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DECK_ID } from '../../logic/data';

const initialState = {
	loading: false,
	cards: [],
	error: '',
};

export const fetchEast = createAsyncThunk('east/fetchEast', () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/East/list`;
	return fetch(endpoint)
		.then(res => res.json())
		.then(data => data.piles.East.cards);
});

const eastSlice = createSlice({
	name: 'east',
	initialState,
	extraReducers: builder => {
		builder.addCase(fetchEast.pending, state => {
			state.loading = true;
		});
		builder.addCase(fetchEast.fulfilled, (state, action) => {
			state.loading = false;
			state.cards = action.payload;
		});
		builder.addCase(fetchEast.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

export default eastSlice.reducer;
