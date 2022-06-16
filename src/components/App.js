import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from '../App/store';
import Navigation from './Navigation';
import GameView from './GameView';
import { getInitCards } from '../logic/data';

function App() {
	useEffect(() => {
		getInitCards();
	}, []);

	return (
		<Provider store={store}>
			<Navigation />
			<GameView />
		</Provider>
	);
}

export default App;
