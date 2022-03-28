import React from 'react';
import styled from 'styled-components';
import card from '../assets/card_back.png';

const FoldedCard = styled.img`
	width: calc(8vh + 3vw);
	height: auto;
	cursor: pointer;

	&:hover {
		box-shadow: 0 0 5px 5px rgba(255, 255, 255, 0.7);
	}
`;

function Card() {
	return <FoldedCard src={card} alt='folded card' />;
}

export default Card;
