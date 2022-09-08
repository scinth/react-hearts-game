import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from '../App/store';
import Navigation from './Navigation';
import GameView from './GameView';
import HomePage from './HomePage';
import { getInitDeck } from '../logic/data';
import { play } from '../logic/index';
import { setLimit, setHandCounter } from '../features/Game/gameSlice';
import { returnAllCardsToDeck } from '../logic/requests';

function App() {
	const [isGameReady, setIsGameReady] = useState(false);

	const gameOn = () => {
		play();
		setIsGameReady(true);
	};

	const quitGame = () => {
		setIsGameReady(false);
		store.dispatch(setLimit(3));
		store.dispatch(setHandCounter(1));
		returnAllCardsToDeck();
		console.clear();
	};

	useEffect(() => {
		getInitDeck();
	}, []);

	return (
		<Provider store={store}>
			<Navigation isGameReady={isGameReady} quit={quitGame} />
			{isGameReady && <GameView />}
			{!isGameReady && <HomePage startGame={gameOn} />}
		</Provider>
	);
}

export default App;
