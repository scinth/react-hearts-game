import React from 'react';
import styled from 'styled-components';

const Home = styled.div`
	width: 100%;
	height: stretch;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	h1 {
		font-family: 'Courgette', sans-serif;
		color: white;
	}
`;

const StartButton = styled.button`
	font-family: 'Malish', sans-serif;
	font-size: 1.2rem;
	margin: 2rem;
	padding: 1em 2em;
	color: white;
	background: linear-gradient(to bottom, #a00, #a33);
	border: none;
	border-radius: 0.5em;
`;

function HomePage({ startGame }) {
	return (
		<Home>
			<h1>Welcome to HEARTS!</h1>
			<StartButton onClick={() => startGame()}>Start Game</StartButton>
		</Home>
	);
}

export default HomePage;
