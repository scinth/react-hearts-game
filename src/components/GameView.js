import React from 'react';
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
	return (
		<View>
			{/* Decks */}
			<Deck player='north' />
			<Deck player='east' />
			<Deck player='south' />
			<Deck player='west' />
			{/* Tricks */}
		</View>
	);
}

export default GameView;
