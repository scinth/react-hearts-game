import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Card from './Card';

const Trick = styled.div`
	--size: min(18vw, 18vh);
	--space: calc((100% - var(--size)) / 2);
	width: var(--size);
	height: var(--size);
	position: absolute;
	inset: var(--space);
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

function Tricks({ cards, sequence }) {
	return (
		<Trick>
			{cards.map((card, index) => {
				return (
					<Card
						key={card.code}
						sortIndex={index}
						type='revealed'
						style={`card ${sequence[index]}`}
						source={card.image}
						click={null}
					/>
				);
			})}
		</Trick>
	);
}

const mapStateToProps = state => {
	return {
		cards: state.trick.cards,
		sequence: state.trick.sequence,
	};
};

export default connect(mapStateToProps)(Tricks);
