import React from 'react';
import styled from 'styled-components';
import Card from './Card';

const Trick = styled.div`
	--size: 18vmin;
	--space: calc((100% - var(--size)) / 2);
	width: var(--size);
	height: var(--size);
	position: absolute;
	inset: var(--space);
	pointer-events: none;

	&.clickable {
		cursor: pointer;
		pointer-events: all;
	}

	& .card {
		box-shadow: initial;
		cursor: initial;
		pointer-events: none;
	}

	& .card.north {
		position: inherit;
		top: 0;
		right: 50%;
		transform: translate(50%, -50%);
	}
	& .card.east {
		position: inherit;
		right: 0;
		top: 50%;
		transform: translate(50%, -50%);
	}
	& .card.south {
		position: inherit;
		bottom: 0;
		right: 50%;
		transform: translate(50%, 50%);
	}
	& .card.west {
		position: inherit;
		left: 0;
		top: 50%;
		transform: translate(-50%, -50%);
	}
`;

const playerNames = ['north', 'east', 'south', 'west'];

function Tricks({ cards, sequence, playTrick, clickable }) {
	return (
		<Trick onClickCapture={playTrick} className={clickable ? 'clickable' : 'disabled'}>
			{cards.map((card, index) => (
				<Card
					key={card.code}
					sortIndex={index}
					type='revealed'
					image={card.image}
					style={`card ${playerNames[sequence[index]]}`}
				/>
			))}
		</Trick>
	);
}

export default Tricks;
