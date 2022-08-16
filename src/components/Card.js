import React from 'react';
import styled from 'styled-components';
import foldedCard from '../assets/card_back.png';

const RevealedCard = styled.img`
	cursor: pointer;
	transition: margin 0.3s ease-out;

	&.selected,
	&:hover {
		box-shadow: 0 0 5px 5px rgba(255, 255, 255, 0.7);
	}

	&.selected {
		margin-top: calc(var(--card-height) / -2);
	}
`;

const FoldedCard = styled.img`
	&.selected {
		&.north {
			margin-top: calc(var(--card-height) / 2);
		}
		&.east {
			margin-left: calc(var(--card-width) / -1.6);
		}
		&.west {
			margin-left: calc(var(--card-width) / 1.6);
		}
	}
`;

function Card(props) {
	let image = props.type == 'folded' ? foldedCard : props.image;
	let card =
		props.type == 'revealed' ? (
			<RevealedCard
				src={image}
				alt={props.code}
				data-code={props.code}
				className={props.style}
				onClick={e => {
					props.selectCard(e.target);
				}}
			/>
		) : (
			<FoldedCard src={image} alt='folded card' className={props.style} />
		);
	return card;
}

export default Card;
