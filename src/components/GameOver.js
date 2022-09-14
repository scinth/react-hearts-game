import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	font-size: var(--card-width);
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	h1 {
		font-family: 'Courgette', cursive;
		font-size: 0.9em;
		text-align: center;
		color: ${props => props.color};
	}

	button {
		font-family: 'Mulish', sans-serif;
		font-size: 0.35em;
		font-weight: bold;
		text-transform: uppercase;
		margin: 2rem;
		padding: 1em 2em;
		background-color: ${props => props.color};
		color: white;
		border: none;
		border-radius: 0.5em;
	}
`;

const GameOver = ({ winner, close }) => {
	return (
		<Wrapper color={winner == 'South' ? '#dfd746' : '#df4646'}>
			<h1>
				{winner == 'South' ? (
					<>
						Congratulations!,
						<br />
						You Win!
					</>
				) : (
					'Sorry, You Lose'
				)}
			</h1>
			<button onClick={close}>Close</button>
		</Wrapper>
	);
};

export default GameOver;
