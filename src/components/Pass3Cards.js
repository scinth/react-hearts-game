import React from 'react';
import styled from 'styled-components';
import { GAME, me } from '../logic/data';

const PassSection = styled.div`
	--size: min(18vw, 18vh);
	--space: calc((100% - var(--size)) / 2);
	width: var(--size);
	height: var(--size);
	position: absolute;
	inset: var(--space);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const PassButton = styled.button`
	font-weight: bold;
	color: #555;
	background-color: #dcdcdc;
	padding: 1em 2em;
	margin: 1em;
	border: none;
	border-radius: 0.3em;
	box-shadow: 0 0 5px 3px rgb(0, 0, 0, 0.2);

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

function Pass3Cards({ cards, trickMode }) {
	const enableButton = cards.length < 3 ? true : false;

	const pass3Cards = () => {
		me.cardsToPass = cards.map(card => card.code);
		GAME.next();
		trickMode();
	};

	return (
		<PassSection>
			<PassButton
				disabled={enableButton}
				onClick={() => {
					pass3Cards();
				}}
			>
				Pass 3 Cards
			</PassButton>
		</PassSection>
	);
}

export default Pass3Cards;
