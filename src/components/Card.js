import React from 'react';
import styled from 'styled-components';
import foldedCard from '../assets/card_back.png';

const StyledCard = styled.img`
	width: calc(8vh + 3vw);
	height: auto;
	cursor: pointer;

	&:hover {
		box-shadow: 0 0 5px 5px rgba(255, 255, 255, 0.7);
	}
`;

function Card(props) {
	let image = props.type == 'folded' ? foldedCard : props.image;
	return <StyledCard src={image} alt={props.code} />;
}

export default Card;
