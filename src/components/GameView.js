import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Trick from './Tricks';
import Deck from './Deck';
import Pass3Cards from './Pass3Cards';
import { getPlaySequence } from '../logic';
import { leadPlayerIndex, me } from '../logic/data';

const View = styled.div`
	width: 80%;
	min-width: 600px;
	max-width: 950px;
	margin-inline: auto;
	height: stretch;
	background: radial-gradient(darkseagreen, mediumseagreen, seagreen);
	position: relative;
`;

function GameView() {
	const [selectedCards, setSelectedCards] = useState([]);
	const [selectionLimit, setSelectionLimit] = useState(3);
	const northCards = useSelector(state => state.north.cards);
	const eastCards = useSelector(state => state.east.cards);
	const southCards = useSelector(state => state.south.cards);
	const westCards = useSelector(state => state.west.cards);
	const trickCards = useSelector(state => state.trick.cards);

	const selectCard = card => {
		let isSelected = selectedCards.some(_card => _card === card);
		if (isSelected) {
			let cardIndex = selectedCards.findIndex(_card => _card === card);
			selectedCards.splice(cardIndex, 1);
			card.classList.remove('selected');
			setSelectedCards([...selectedCards]);
		} else if (selectedCards.length < selectionLimit) {
			card.classList.add('selected');
			setSelectedCards([...selectedCards, card]);
		}
	};

	const trickMode = () => {
		setSelectedCards([]);
		setSelectionLimit(1);
	};

	const play = () => {
		if (selectedCards.length == 0) return;
		me.selectCard(selectedCards[0].dataset.code);
		setSelectedCards([]);
	};

	useEffect(() => {
		if (
			northCards.length == 0 &&
			eastCards.length == 0 &&
			southCards.length == 0 &&
			westCards.length == 0
		) {
			setSelectedCards([]);
			setSelectionLimit(3);
		}
	}, [northCards, eastCards, southCards, westCards]);

	return (
		<View>
			{/* Decks */}
			<Deck player='north' cards={northCards} />
			<Deck player='east' cards={eastCards} />
			<Deck player='south' cards={southCards} selectCard={selectCard} />
			<Deck player='west' cards={westCards} />
			{/* Tricks */}
			{selectionLimit == 3 && <Pass3Cards cards={selectedCards} trickMode={trickMode} />}
			{selectionLimit == 1 && (
				<Trick
					cards={trickCards}
					sequence={getPlaySequence(leadPlayerIndex)}
					playTrick={play}
					clickable={selectedCards.length > 0 ? true : false}
				/>
			)}
		</View>
	);
}

export default GameView;
