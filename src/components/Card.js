import React from 'react';
import styled from 'styled-components';
import foldedCard from '../assets/card_back.png';

const RevealedCard = styled.img`
	width: calc(8vh + 3vw);
	height: auto;
	cursor: pointer;
	transition: margin 0.3s ease-out;

	&:hover {
		box-shadow: 0 0 5px 5px rgba(255, 255, 255, 0.7);
	}

	&.selected {
		margin-top: -90px;
	}
`;

const FoldedCard = styled.img`
	width: calc(8vh + 3vw);
	height: auto;
`;

function Card(props) {
	let image = props.type == 'folded' ? foldedCard : props.image;
	let card =
		props.type == 'revealed' ? (
			<RevealedCard
				src={image}
				alt={props.code}
				data-code={props.code}
				onClick={e => {
					props.selectCard(e.target);
				}}
			/>
		) : (
			<FoldedCard src={image} alt='folded card' />
		);
	return card;
}

export default Card;