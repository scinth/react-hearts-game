import { GAME, set_GAME, CARDS, PLAYERS, IS_HEARTS_BROKEN } from './data';
import { startGame } from './generators';

export const shuffleCards = () => {
	// shuffles cards
	let cards = [...CARDS];
	let shuffledCards = [];
	do {
		let randomIndex = Math.round(Math.random() * (cards.length - 1));
		shuffledCards.push(cards.splice(randomIndex, 1)[0]);
	} while (cards.length > 0);
	return shuffledCards;
};

export const distributeCards = cards => {
	let numberOfCardsPerPlayer = 13;
	let leadPlayerIndex = null;
	PLAYERS.forEach((player, index) => {
		let set = cards.splice(0, numberOfCardsPerPlayer);
		if (leadPlayerIndex == null) {
			set.forEach(card => {
				if (card.name == '2' && card.suit == 'Clubs') leadPlayerIndex = index;
			});
		}
		player.cards = set;
	});

	return leadPlayerIndex;
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
				isValid = card.suit == 'Clubs';
				if (!isValid) console.log('You must play a "Clubs" card');
			} else {
				isValid = !(card.suit == 'Hearts' || card.code == 'QS');
				if (!isValid)
					console.log('You cannot play a "Hearts" or "Queen of Spades" during the first trick');
			}
		}
	} else {
		if (status.isFirstCard) {
			isValid = card.suit != 'Hearts' || IS_HEARTS_BROKEN;
			if (!isValid) console.log('You cannot play a "Hearts" if it is not yet broken');
		} else {
			if (status.hasSuit) {
				isValid = card.suit == status.suit;
				if (!isValid) console.log(`You must play a "${status.suit}" suit`);
			} else {
				isValid = true;
			}
		}
	}
	return isValid;
};

export const play = function () {
	set_GAME(startGame());
	GAME.next();
};
