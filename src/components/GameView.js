import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Trick from './Tricks';
import Pile from './Pile';
import Pass3Cards from './Pass3Cards';
import { getPlaySequence } from '../logic';
import { leadPlayerIndex, me } from '../logic/data';

const View = styled.div`
	width: 100%;
	margin-inline: auto;
	position: relative;
	flex-grow: 1;

	@media screen and (min-aspect-ratio: 917/648) {
		& {
			width: 90%;
		}
	}
	@media screen and (min-aspect-ratio: 1100/648) {
		& {
			width: 80%;
		}
	}
`;

function GameView() {
	const [selectedCards, setSelectedCards] = useState([]);
	const [selectionLimit, setSelectionLimit] = useState(3);
	const [handCounter, setHandCounter] = useState(0);
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
		} else if (selectedCards.length == selectionLimit) {
			let firstCard = selectedCards.shift();
			selectedCards.push(card);
			firstCard.classList.remove('selected');
			card.classList.add('selected');
		}
	};

	const trickMode = () => {
		setSelectedCards([]);
		setSelectionLimit(1);
	};

	const play = e => {
		if (selectedCards.length == 0) return;
		me.selectCard(selectedCards[0].dataset.code);
		setSelectedCards([]);
		e.stopPropagation();
	};

	useEffect(() => {
		if (
			northCards.length == 0 &&
			eastCards.length == 0 &&
			southCards.length == 0 &&
			westCards.length == 0
		) {
			let nextHandCounter = handCounter + 1;
			setSelectedCards([]);
			setHandCounter(nextHandCounter);
			nextHandCounter % 4 == 0 ? setSelectionLimit(1) : setSelectionLimit(3);
		}
	}, [northCards, eastCards, southCards, westCards]);

	useEffect(() => {
		document.documentElement.style.setProperty('--numof-north-cards', `${northCards.length}`);
	}, [northCards]);
	useEffect(() => {
		document.documentElement.style.setProperty('--numof-east-cards', `${eastCards.length}`);
	}, [eastCards]);
	useEffect(() => {
		document.documentElement.style.setProperty('--numof-south-cards', `${southCards.length}`);
	}, [southCards]);
	useEffect(() => {
		document.documentElement.style.setProperty('--numof-west-cards', `${westCards.length}`);
	}, [westCards]);

	return (
		<View className='pile-wrapper'>
			{/* Piles */}
			<Pile player='north' cards={northCards} />
			<Pile player='east' cards={eastCards} />
			<Pile player='south' cards={southCards} selectCard={selectCard} />
			<Pile player='west' cards={westCards} />
			{/* Tricks */}
			{handCounter % 4 != 0 && selectionLimit == 3 && (
				<Pass3Cards cards={selectedCards} trickMode={trickMode} />
			)}
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
