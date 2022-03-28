import React from 'react';
// import { Provider } from 'react-redux';
// import store from '../redux/store';
import Navigation from './Navigation';
import GameView from './GameView';

function App() {
	return (
		// <Provider store={store}>
		<>
			<Navigation />
			<GameView />
			{/* </Provider> */}
		</>
	);
}

export default App;
