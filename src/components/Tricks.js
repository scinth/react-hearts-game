import React from 'react';
import styled from 'styled-components';
import Card from './Card';

const Trick = styled.div`
	--size: min(18vw, 18vh);
	--space: calc((100% - var(--size)) / 2);
	width: var(--size);
	height: var(--size);
	position: absolute;
	inset: var(--space);
	cursor: pointer;
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

function Tricks({ cards, sequence, playTrick }) {
	return (
		<Trick onClick={playTrick}>
			{cards.map((card, index) => {
				return (
					<Card
						key={card.code}
						sortIndex={index}
						type='revealed'
						image={card.image}
						className={`card ${playerNames[sequence[index]]}`}
					/>
				);
			})}
		</Trick>
	);
}

export default Tricks;
