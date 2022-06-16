import { PLAYERS, IS_HEARTS_BROKEN, set_IS_HEARTS_BROKEN } from './data';
import { isValidCard } from './index';

export class Card {
	constructor(name, suit) {
		this.name = name;
		this.suit = suit;
		this.value = (() => {
			if (isNaN(this.name)) {
				switch (this.name) {
					case 'Jack':
						return 11;
					case 'Queen':
						return 12;
					case 'King':
						return 13;
					case 'Ace':
						return 14;
				}
			} else return Number(this.name);
		})();
		this.points = (() => {
			if (this.suit == 'Hearts') return 1;
			else if (this.name == 'Queen' && this.suit == 'Spades') return 13;
			else return 0;
		})();
		this.code = (() => {
			let nameCode = null;
			let suitCode = null;
			if (isNaN(this.name)) nameCode = this.name.split('')[0];
			else nameCode = this.name;
			suitCode = this.suit.split('')[0];
			return `${nameCode}${suitCode}`;
		})();
	}
}

export class Player {
	constructor(name) {
		this.name = name;
		this.cards = null;
		this.points = 0;
		this.selectedCard = null;
		this.cardsToPass = [];
	}
	*pass3Cards() {
		// if user, select 3 cards using, select3Cards method
		if (this.name == 'South(you)') yield;
		// if computer, get 3 random cards
		else {
			let cards = [...this.cards];
			while (this.cardsToPass.length < 3) {
				let randomIndex = Math.round(Math.random() * (cards.length - 1));
				let card = cards.splice(randomIndex, 1)[0];
				this.cardsToPass.push(card);
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
					else console.log('Play a card except "Hearts" or "Queen of Hearts"');
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

			let code = this.cards.map(card => card.code);
			console.log(code);
			do {
				yield;
				validCard = isValidCard(this.selectedCard, status);
				if (!validCard) {
					console.log('Please select a valid card');
				}
			} while (!validCard);
			// resume by selectCard method
		} else {
			// computer
			// generate random card index
			if (trick.isFirstTrick && isFirstCard) {
				this.selectedCard = this.cards.find(card => card.code == '2C');
			} else {
				let cards = this.cards.filter(card => {
					let isValidCard = false;
					if (trick.isFirstTrick) {
						if (hasSuit) {
							isValidCard = card.suit == 'Clubs';
						} else {
							isValidCard = !(cards.suit == 'Hearts' || cards.code == 'QS');
						}
					} else {
						if (isFirstCard) {
							isValidCard = card.suit != 'Hearts' || IS_HEARTS_BROKEN;
						} else {
							if (hasSuit) {
								isValidCard = card.suit == trick.suit;
							} else isValidCard = true;
						}
					}
					return isValidCard;
				});
				// console.log('Valid cards:', cards);
				let randomIndex = Math.round(Math.random() * (cards.length - 1));
				this.selectedCard = cards[randomIndex];
			}
		}

		console.log(`\t| ${this.name} plays "${this.selectedCard.name} of ${this.selectedCard.suit}"`);

		if (this.selectedCard.suit == 'Hearts' && !IS_HEARTS_BROKEN) {
			set_IS_HEARTS_BROKEN(true);
			console.log('Hearts is Broken!');
		}

		trick.receive({
			ownerIndex,
			card: this.selectedCard,
		});
	}
}

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
				return total + trick.card.points;
			}, 0);
			return points;
		} else throw new Error('Tricks are not completed');
	}
	getWinnerIndex() {
		if (this.tricks.length == 4) {
			let winnerTrick = this.tricks.reduce((winnerTrick, trick) => {
				let { card } = trick;
				if (card.suit == this.suit && card.value > winnerTrick.card.value) {
					return trick;
				}
				return winnerTrick;
			});
			return winnerTrick.ownerIndex;
		} else throw new Error('Tricks are not completed');
	}
	removeCards() {
		this.tricks.forEach(trick => {
			let owner = PLAYERS[trick.ownerIndex];
			let cardIndex = owner.cards.findIndex(card => card === trick.card);
			owner.cards.splice(cardIndex, 1);
		});
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
		console.log('\nCurrent total points:');
		console.log('HAND\tNORTH\tEAST\tSOUTH\tWEST');
		this.points.forEach((point, index) => {
			console.log(`${index + 1}\t\t${point[0]}\t\t${point[1]}\t\t${point[2]}\t\t${point[3]}`);
		});
	}
}
