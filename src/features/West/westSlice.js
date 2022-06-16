import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DECK_ID } from '../../logic/data';

const initialState = {
	loading: false,
	cards: [],
	error: '',
};

export const fetchWest = createAsyncThunk('west/fetchWest', () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/West/list`;
	return fetch(endpoint)
		.then(res => res.json())
		.then(data => data.piles.West.cards);
});

const westSlice = createSlice({
	name: 'west',
	initialState,
	extraReducers: builder => {
		builder.addCase(fetchWest.pending, state => {
			state.loading = true;
		});
		builder.addCase(fetchWest.fulfilled, (state, action) => {
			state.loading = false;
			state.cards = action.payload;
		});
		builder.addCase(fetchWest.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

export default westSlice.reducer;
