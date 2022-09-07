import { configureStore } from '@reduxjs/toolkit';
import northReducer from '../features/North/northSlice';
import eastReducer from '../features/East/eastSlice';
import southReducer from '../features/South/southSlice';
import westReducer from '../features/West/westSlice';
import trickReducer from '../features/Trick/tricksSlice';
import gameReducer from '../features/Game/gameSlice';

const store = configureStore({
	reducer: {
		north: northReducer,
		east: eastReducer,
		south: southReducer,
		west: westReducer,
		trick: trickReducer,
		game: gameReducer,
	},
});

export default store;
