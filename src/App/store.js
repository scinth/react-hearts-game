import { configureStore } from '@reduxjs/toolkit';
import northReducer from '../features/North/northSlice';
import eastReducer from '../features/East/eastSlice';
import southReducer from '../features/South/southSlice';
import westReducer from '../features/West/westSlice';

const store = configureStore({
	reducer: {
		north: northReducer,
		east: eastReducer,
		south: southReducer,
		west: westReducer,
	},
});

export default store;
