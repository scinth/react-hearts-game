import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Trick from './Tricks';
import Pile from './Pile';
import LoaderHandler from './LoaderHandler';
import Pass3Cards from './Pass3Cards';
import { getPlaySequence } from '../logic';
import { leadPlayerIndex, me } from '../logic/data';
import store from '../App/store';
import Notifier from './Notifier';
import {
	addCard,
	removeCard,
	clearCards,
	setLimit,
	setHandCounter,
} from '../features/Game/gameSlice';

const getCardIndex = (cards, card) => {
	let index = cards.findIndex(_card_ => {
		return _card_.code === card.code;
	});
	return index;
};

const getSelectedCards = (cards, indeces) => {
	let selectedCards = indeces.map(index => {
		return cards[index];
	});
	return selectedCards;
};

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
	const selectedCards = useSelector(state => state.game.selectedCards);
	const selectionLimit = useSelector(state => state.game.selectionLimit);
	const handCounter = useSelector(state => state.game.handCounter);
	const northCards = useSelector(state => state.north.cards);
	const eastCards = useSelector(state => state.east.cards);
	const southCards = useSelector(state => state.south.cards);
	const westCards = useSelector(state => state.west.cards);
	const trickCards = useSelector(state => state.trick.cards);

	const selectCard = cardImage => {
		let card = southCards.find(card => {
			return card.code === cardImage.dataset.code;
		});
		let cardIndex = getCardIndex(southCards, card);
		let hasSelected = selectedCards.some(index => index == cardIndex);
		if (hasSelected) {
			store.dispatch(removeCard(cardIndex));
		} else if (selectedCards.length < selectionLimit) {
			store.dispatch(addCard(cardIndex));
		} else if (selectedCards.length == selectionLimit) {
			store.dispatch(removeCard(selectedCards[0]));
			store.dispatch(addCard(cardIndex));
		}
	};

	const trickMode = () => {
		store.dispatch(clearCards());
		store.dispatch(setLimit(1));
	};

	const play = e => {
		if (selectedCards.length == 0) return;
		let card = southCards[selectedCards[0]];
		me.selectCard(card.code);
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
			store.dispatch(clearCards());
			store.dispatch(setHandCounter(nextHandCounter));
			nextHandCounter % 4 == 0 ? store.dispatch(setLimit(1)) : store.dispatch(setLimit(3));
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
		<>
			<View className='pile-wrapper'>
				{/* Piles */}
				<Pile player='north' cards={northCards} />
				<Pile player='east' cards={eastCards} />
				<Pile player='south' cards={southCards} selected={selectedCards} selectCard={selectCard} />
				<Pile player='west' cards={westCards} />
				{/* Tricks */}
				{handCounter % 4 != 0 && selectionLimit == 3 && (
					<Pass3Cards cards={getSelectedCards(southCards, selectedCards)} trickMode={trickMode} />
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
			<Notifier />
			<LoaderHandler />
		</>
	);
}

export default GameView;
