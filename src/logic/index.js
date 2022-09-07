import { GAME, set_GAME, IS_HEARTS_BROKEN } from './data';
import { startGame } from './generators';

export const sortCards = cards => {
	let _cards = [...cards];
	// sort by value
	let values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'];
	let valuesLength = values.length;
	let cardsLength = _cards.length;
	let k = 0;
	for (let i = 0; i < valuesLength; i++) {
		let value = values[i];
		for (let j = k; j < cardsLength; j++) {
			let card = _cards[j];
			if (card.value == value) {
				let val1 = _cards[j];
				_cards[j] = _cards[k];
				_cards[k] = val1;
				k++;
			}
		}
	}
	// sort by suit
	let suits = ['CLUBS', 'DIAMONDS', 'SPADES', 'HEARTS'];
	let suitsLength = suits.length;
	k = 0;
	for (let i = 0; i < suitsLength; i++) {
		let suit = suits[i];
		for (let j = k; j < cardsLength; j++) {
			let card = _cards[j];
			if (card.suit == suit) {
				let val1 = _cards[j];
				for (let l = j; l > k; l--) {
					_cards[l] = _cards[l - 1];
				}
				_cards[k] = val1;
				k++;
			}
		}
	}
	return _cards;
};

export const getPlaySequence = index => {
	let sequence = [];
	let ctr = 0;
	let val = null;
	for (val = index; ctr < 4; ctr++) {
		if (val >= 4) val = 0;
		sequence.push(val);
		val++;
	}
	return sequence;
};

export const isValidCard = (card, status) => {
	let isValid = false;
	if (status.isFirstTrick) {
		if (status.isFirstCard) {
			isValid = card.code == '2C';
			if (!isValid) console.log('You must play "2 of Clubs"');
		} else {
			if (status.hasSuit) {
				isValid = card.suit == 'CLUBS';
				if (!isValid) console.log('You must play a "Clubs" card');
			} else {
				isValid = !(card.suit == 'HEARS' || card.code == 'QS');
				if (!isValid)
					console.log('You cannot play a "Hearts" or "Queen of Spades" during the first trick');
			}
		}
	} else {
		if (status.isFirstCard) {
			isValid = card.suit != 'HEARTS' || IS_HEARTS_BROKEN;
			if (!isValid) console.log('You cannot play a "Hearts" if it is not yet broken');
		} else {
			if (status.hasSuit) {
				isValid = card.suit == status.suit;
				if (!isValid) console.log(`You must play a "${status.suit}" card`);
			} else {
				isValid = true;
			}
		}
	}
	return isValid;
};

export const play = function () {
	console.log('Starting game...');
	set_GAME(startGame());
	GAME.next();
};
