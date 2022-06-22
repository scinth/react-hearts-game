import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DECK_ID } from '../../logic/data';
import { sortCards } from '../../logic';

const initialState = {
	loading: false,
	cards: [],
	error: '',
};

export const fetchSouth = createAsyncThunk('south/fetchSouth', () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/South/list`;
	return fetch(endpoint)
		.then(res => res.json())
		.then(data => {
			let cards = data.piles.South.cards;
			return sortCards(cards);
		});
});

const southSlice = createSlice({
	name: 'south',
	initialState,
	extraReducers: builder => {
		builder.addCase(fetchSouth.pending, state => {
			state.loading = true;
		});
		builder.addCase(fetchSouth.fulfilled, (state, action) => {
			state.loading = false;
			state.cards = action.payload;
		});
		builder.addCase(fetchSouth.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

export default southSlice.reducer;
