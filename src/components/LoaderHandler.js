import React from 'react';
import Loader from './Loader';
import { useSelector } from 'react-redux';

const LoaderHandler = () => {
	const gameStatus = useSelector(state => state.game.status);
	const showLoader = () => {
		if (gameStatus >= 0 && gameStatus <= 3) return true;
		return false;
	};
	const getMessage = () => {
		switch (gameStatus) {
			case 0:
				return 'Initializing new Deck...';
			case 1:
				return 'Shuffling Deck...';
			case 2:
				return 'Segregating Cards...';
			case 3:
				return 'Exchanging Cards...';
			default:
				return '';
		}
	};

	return <>{showLoader() && <Loader message={getMessage()} />}</>;
};

export default LoaderHandler;
