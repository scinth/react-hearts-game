import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from '../App/store';
import Navigation from './Navigation';
import GameView from './GameView';
import HomePage from './HomePage';
import { getInitCards } from '../logic/data';
import { play } from '../logic/index';

function App() {
	const [isGameReady, setIsGameReady] = useState(false);

	const gameOn = () => {
		play();
		setIsGameReady(true);
	};

	useEffect(() => {
		getInitCards();
	}, []);

	return (
		<Provider store={store}>
			<Navigation />
			{isGameReady && <GameView />}
			{!isGameReady && <HomePage startGame={gameOn} />}
		</Provider>
	);
}

export default App;
