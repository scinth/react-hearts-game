import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	h1 {
		font-family: 'Courgette', cursive;
		font-size: 4em;
		text-align: center;
		color: ${props => props.color};
		padding-bottom: 0.5em;
	}

	button {
		font-family: 'Mulish', sans-serif;
		font-size: 1.5em;
		font-weight: bold;
		text-transform: uppercase;
		padding: 0.8em 1.5em;
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
