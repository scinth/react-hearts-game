import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Deck from './Deck';

const View = styled.div`
	width: 80%;
	min-width: 600px;
	max-width: 950px;
	margin-inline: auto;
	height: stretch;
	background: radial-gradient(darkseagreen, mediumseagreen, seagreen);
	position: relative;
`;

function GameView() {
	const northCards = useSelector(state => state.north.cards);
	const eastCards = useSelector(state => state.east.cards);
	const southCards = useSelector(state => state.south.cards);
	const westCards = useSelector(state => state.west.cards);

	return (
		<View>
			{/* Decks */}
			<Deck player='north' cards={northCards} />
			<Deck player='east' cards={eastCards} />
			<Deck player='south' cards={southCards} />
			<Deck player='west' cards={westCards} />
			{/* Tricks */}
		</View>
	);
}

export default GameView;
