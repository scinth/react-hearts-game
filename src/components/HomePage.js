import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchDeck } from '../redux/deck/deckActions';
import styled from 'styled-components';

const Home = styled.div`
	width: 100%;
	height: stretch;
	background-color: white;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const StartButton = styled.button`
	font-size: 1.2rem;
	margin: 2rem;
	padding: 1em 2em;
	color: white;
	background: linear-gradient(to bottom, #a00, #a33);
	border: none;
	border-radius: 0.5em;
`;

function HomePage({ startGame, deck, getDeck }) {
	const [isDeckReady, setIsDeckReady] = useState(false);

	useEffect(() => {
		getDeck();
	}, []);

	useEffect(() => {
		if (!isDeckReady && deck.cardCodes.length > 0) setIsDeckReady(true);
	}, [deck]);

	return (
		<Home>
			<h1>~ Welcome to HEARTS! ~</h1>
			{isDeckReady && <StartButton onClick={() => startGame()}>Start Game</StartButton>}

			<p>{!isDeckReady && deck.loading ? 'Loading Deck...' : deck.error}</p>
		</Home>
	);
}

const mapStateToProps = state => {
	return {
		deck: state.deck,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getDeck: () => dispatch(fetchDeck()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
