import React from 'react';
import styled from 'styled-components';

const Home = styled.div`
	font-size: var(--card-width);
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	h1 {
		font-family: 'Courgette', sans-serif;
		font-size: 0.9em;
		text-align: center;
		color: white;
	}
`;

const StartButton = styled.button`
	font-family: 'Mulish', sans-serif;
	font-size: 0.35em;
	text-transform: uppercase;
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
			<h1>Welcome to Hearts!</h1>
			<StartButton onClick={() => startGame()}>start</StartButton>
		</Home>
	);
}

export default HomePage;
