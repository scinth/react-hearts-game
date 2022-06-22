import { configureStore } from '@reduxjs/toolkit';
import northReducer from '../features/North/northSlice';
import eastReducer from '../features/East/eastSlice';
import southReducer from '../features/South/southSlice';
import westReducer from '../features/West/westSlice';
import trickReducer from '../features/Trick/tricksSlice';

const store = configureStore({
	reducer: {
		north: northReducer,
		east: eastReducer,
		south: southReducer,
		west: westReducer,
		trick: trickReducer,
	},
});

export default store;
