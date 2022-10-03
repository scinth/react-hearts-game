import React, { useEffect } from 'react';
import Navigation from './Navigation';
import GameView from './GameView';
import HomePage from './HomePage';
import GameOver from './GameOver';
import Notifier from './Notifier';
import LoaderHandler from './LoaderHandler';
import { getInitDeck } from '../logic/data';
import { play } from '../logic/index';
import { returnAllCardsToDeck } from '../logic/requests';
import { setLimit, setHandCounter, setGameOver } from '../features/Game/gameSlice';
import { useSelector } from 'react-redux';
import store from '../App/store';

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

function App() {
	const { isOver, winner } = useSelector(state => state.game.gameOver);

	useEffect(() => {
		getInitDeck();
	}, []);

	return (
		<>
			<Navigation isGameReady={!isOver} quitGame={endGame} />
			{!isOver && (
				<GameView>
					<Notifier />
					<LoaderHandler />
				</GameView>
			)}
			{isOver && winner == '' && <HomePage startGame={startGame} />}
			{isOver && winner != '' && <GameOver winner={winner} close={endGame} />}
		</>
	);
}

export default App;
