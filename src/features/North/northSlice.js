import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DECK_ID } from '../../logic/data';

const initialState = {
	loading: false,
	cards: [],
	error: '',
};

export const fetchNorth = createAsyncThunk('north/fetchNorth', () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/North/list`;
	return fetch(endpoint)
		.then(res => res.json())
		.then(data => data.piles.North.cards);
});

const northSlice = createSlice({
	name: 'north',
	initialState,
	extraReducers: builder => {
		builder.addCase(fetchNorth.pending, state => {
			state.loading = true;
		});
		builder.addCase(fetchNorth.fulfilled, (state, action) => {
			state.loading = false;
			state.cards = action.payload;
		});
		builder.addCase(fetchNorth.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

export default northSlice.reducer;
