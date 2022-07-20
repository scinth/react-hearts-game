import { PLAYERS, IS_HEARTS_BROKEN, set_IS_HEARTS_BROKEN } from './data';
import { isValidCard } from './index';
import { playTrick } from './requests';
import store from '../App/store';

export class Player {
	constructor(name) {
		this.name = name;
		this.points = 0;
		this.selectedCard = null;
		this.cardsToPass = [];
	}
	get cards() {
		let state = store.getState();
		return state[this.name.toLowerCase()].cards;
	}
	*pass3Cards() {
		// if user, select 3 cards using, select3Cards method
		if (this.name == 'South') yield;
		// if computer, get 3 random cards
		else {
			let cards = [...this.cards];
			while (this.cardsToPass.length < 3) {
				let randomIndex = Math.round(Math.random() * (cards.length - 1));
				let card = cards.splice(randomIndex, 1)[0];
				this.cardsToPass.push(card.code);
			}
		}
	}
	*play(trick) {
		let userIndex = 2;
		let isFirstCard = trick.tricks.length == 0;
		let ownerIndex = PLAYERS.findIndex(player => {
			return player.name == this.name;
		});
		let hasSuit = this.cards.some(card => card.suit == trick.suit);
		let selectedCard = null;

		if (ownerIndex == userIndex) {
			let validCard = null;
			let status = {
				isFirstTrick: trick.isFirstTrick,
				isFirstCard,
				hasSuit,
				suit: trick.suit,
			};
			// user
			// allow user to select a card
			console.log('\nYour turn...');
			if (trick.isFirstTrick) {
				if (isFirstCard) console.log('Play "2 of Clubs" to start trick');
				else {
					if (hasSuit) console.log('Play a "Clubs" card');
					else console.log('Play a card except "Hearts" or "Queen of Spades"');
				}
			} else {
				if (isFirstCard) {
					if (IS_HEARTS_BROKEN) console.log('Play a card to start trick');
					else console.log('Play a card except "Hearts" to start trick');
				} else {
					if (hasSuit) {
						console.log(`Play a "${trick.suit}" card`);
					} else {
						console.log('Play any card');
					}
				}
			}

			yield null;

			do {
				selectedCard = this.cards.find(card => {
					return card.code == this.selectedCard;
				});
				validCard = isValidCard(selectedCard, status);
				if (!validCard) {
					yield console.log('Please re-select a valid card');
				}
			} while (!validCard);
			// resume by selectCard method
		} else {
			// computer
			// generate random card index
			if (trick.isFirstTrick && isFirstCard) {
				this.selectedCard = this.cards.find(card => {
					return card.code === '2C';
				});
				selectedCard = this.selectedCard;
			} else {
				let cards = this.cards.filter(card => {
					let isValidCard = false;
					if (trick.isFirstTrick) {
						if (hasSuit) {
							isValidCard = card.suit == 'CLUBS';
						} else {
							isValidCard = !(card.suit == 'HEARTS' || card.code == 'QS');
						}
					} else {
						if (isFirstCard) {
							isValidCard = card.suit != 'HEARTS' || IS_HEARTS_BROKEN;
						} else {
							if (hasSuit) {
								isValidCard = card.suit == trick.suit;
							} else isValidCard = true;
						}
					}
					return isValidCard;
				});
				let randomIndex = Math.round(Math.random() * (cards.length - 1));
				this.selectedCard = cards[randomIndex];
				selectedCard = cards[randomIndex];
			}
		}

		if (selectedCard.suit == 'HEARTS' && !IS_HEARTS_BROKEN) {
			set_IS_HEARTS_BROKEN(true);
			console.log('Hearts is Broken!');
		}

		trick.receive({
			ownerIndex,
			card: selectedCard,
		});

		yield playTrick(this.name, selectedCard.code);
	}
}

const getCardPoints = card => {
	if (card.suit == 'HEARTS') {
		return 1;
	} else if (card.code == 'QS') {
		return 13;
	} else return 0;
};

const getCardValue = card => {
	if (isNaN(card.value)) {
		switch (card.value) {
			case 'JACK':
				return 11;
			case 'QUEEN':
				return 12;
			case 'KING':
				return 13;
			case 'ACE':
				return 14;
		}
	} else return parseInt(card.value);
};

export class Trick {
	constructor(isFirstTrick) {
		this.isFirstTrick = isFirstTrick;
		this.tricks = [];
		this.suit = null;
	}
	// assume trick is valid
	receive(trick) {
		if (this.tricks.length >= 4) throw new Error('Tricks are already completed');
		this.tricks.push(trick);
		if (this.suit == null) this.suit = trick.card.suit;
	}
	getPoints() {
		if (this.tricks.length == 4) {
			let points = this.tricks.reduce((total, trick) => {
				return total + getCardPoints(trick.card);
			}, 0);
			return points;
		} else throw new Error('Tricks are not completed');
	}
	getWinnerIndex() {
		if (this.tricks.length == 4) {
			let winnerTrick = this.tricks.reduce((winnerTrick, trick) => {
				let { card } = trick;
				if (card.suit == this.suit && getCardValue(card) > getCardValue(winnerTrick.card)) {
					return trick;
				}
				return winnerTrick;
			});
			return winnerTrick.ownerIndex;
		} else throw new Error('Tricks are not completed');
	}
}

export class Leaderboard {
	constructor() {
		this.points = [];
		this.ranks = ['1st', '2nd', '3rd', '4th'];
	}
	reRank() {
		let symbol = ['1st', '2nd', '3rd', '4th'];
		let points = this.points.reduce((total, point) => {
			return total.map((value, index) => {
				return point[index] + value;
			});
		});
		let newRanks = [null, null, null, null];
		let i = null;
		let _points = [...points];
		for (i = 0; i < newRanks.length; i++) {
			let minPoint = Math.min(..._points);
			let minIndex = _points.findIndex(point => point == minPoint);

			newRanks[minIndex] = symbol[i];
			_points[minIndex] = Infinity;
		}
		this.ranks = [...newRanks];
	}
	update(points) {
		this.points.push(points);
		this.reRank();
	}
	display() {
		let total = [0, 0, 0, 0];
		console.log('\nLeaderboard:');
		console.log('HAND\tNORTH\tEAST\tSOUTH\tWEST');
		this.points.forEach((point, index) => {
			console.log(`${index + 1}\t\t${point[0]}\t\t${point[1]}\t\t${point[2]}\t\t${point[3]}`);
			total[0] += point[0];
			total[1] += point[1];
			total[2] += point[2];
			total[3] += point[3];
		});
		console.log('-------------------------------------');
		console.log(`TOTAL\t${total[0]}\t\t${total[1]}\t\t${total[2]}\t\t${total[3]}`);
		console.log(
			`RANKS\t${this.ranks[0]}\t\t${this.ranks[1]}\t\t${this.ranks[2]}\t\t${this.ranks[3]}`,
		);
	}
}
