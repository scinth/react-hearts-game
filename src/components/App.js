import React, { useEffect } from 'react';
import store from '../App/store';
import Navigation from './Navigation';
import GameView from './GameView';
import HomePage from './HomePage';
import { getInitDeck, setDeckId } from '../logic/data';
import { play } from '../logic/index';
import { setLimit, setHandCounter, setGameOver } from '../features/Game/gameSlice';
import { returnAllCardsToDeck } from '../logic/requests';
import { useSelector } from 'react-redux';
import GameOver from './GameOver';

function App() {
	const { isOver, winner } = useSelector(state => state.game.gameOver);

	const startGame = () => {
		play();
		store.dispatch(setGameOver({ isOver: false, winner: '' }));
	};

	const endGame = () => {
		store.dispatch(setGameOver({ isOver: true, winner: '' }));
		store.dispatch(setLimit(3));
		store.dispatch(setHandCounter(1));
		returnAllCardsToDeck();
		console.clear();
	};

	useEffect(() => {
		getInitDeck();
		return () => {
			setDeckId();
		};
	}, []);

	return (
		<>
			<Navigation isGameReady={!isOver} quitGame={endGame} />
			{!isOver && <GameView />}
			{isOver && winner == '' && <HomePage startGame={startGame} />}
			{isOver && winner != '' && <GameOver winner={winner} close={endGame} />}
		</>
	);
}

export default App;
