import { DECK_ID, getPileCards, PLAYERS, set_IS_HEARTS_BROKEN } from './data';
import { Trick, Leaderboard } from './classes';
import { shuffleCards, distributeCards, getPlaySequence } from './index';
import { leadPlayerIndex, setLeadPlayerIndex } from './data';
import { pass3Cards } from './requests';

const startTrick = function* (data) {
	let shootTheMoonPoints = 26;
	let gainedPoints = null;
	let trick = new Trick(data.isFirstTrick);

	for (let i = 0; i < data.sequence.length; i++) {
		let player = PLAYERS[data.sequence[i]];
		yield* player.play(trick);
		// TODO  south should not be called
	}

	let winnerIndex = trick.getWinnerIndex();
	let points = trick.getPoints();

	if (points == shootTheMoonPoints) {
		gainedPoints = PLAYERS.map((_, index) => {
			return winnerIndex == index ? 0 : shootTheMoonPoints;
		});
	} else {
		gainedPoints = PLAYERS.map((_, index) => {
			return winnerIndex == index ? points : 0;
		});
	}

	// trick.removeCards();

	return {
		winnerIndex,
		gainedPoints,
	};
};

const startHand = function* (data) {
	// shuffle cards
	// let cards = shuffleCards();
	// console.log('\n/ deck shuffled');
	// distribute cards
	// let leadPlayerIndex = distributeCards(cards);
	// console.log('/ cards distributed');
	let trickCounter = 1;
	let recipientCounter = data.handCounter % 4;
	let hasCardsLeft = null;
	let handPoints = [0, 0, 0, 0];
	let result = null;
	set_IS_HEARTS_BROKEN(false);

	for (let i = 0; i < PLAYERS.length; i++) {
		let player = PLAYERS[i];
		let twoOfClubs = player.cards.find(card => card.code == '2C');
		if (twoOfClubs) {
			setLeadPlayerIndex(i);
			break;
		}
	}

	if (recipientCounter != 0) {
		console.log('\nSelect 3 cards to pass:');
		let cardCodes = PLAYERS[2].cards.map(card => card.code);
		console.log(cardCodes);

		for (let i = 0; i < 4; i++) {
			let player = PLAYERS[i];
			yield* player.pass3Cards();
		}

		yield pass3Cards(recipientCounter);
		getPileCards();

		console.log('\n Cards successfully passed');
	}

	// tricks
	do {
		let sequence = getPlaySequence(leadPlayerIndex);
		let data = {
			sequence,
			isFirstTrick: trickCounter == 1 ? true : false,
		};

		console.log('\n#####################################');
		console.log(`\nStarting trick#${trickCounter}`);

		result = yield* startTrick(data);

		console.log(`\nEnding trick#${trickCounter}`);
		console.log(`\n${PLAYERS[result.winnerIndex].name} wins!`);

		setLeadPlayerIndex(result.winnerIndex);

		console.log('Current hand points:');
		result.gainedPoints.forEach((points, index) => {
			handPoints[index] += points;
			console.log(`\t${PLAYERS[index].name}\t\t\t${index == 2 ? '' : '\t'}${handPoints[index]}`);
		});

		hasCardsLeft = trickCounter < 13;
		trickCounter++;
	} while (hasCardsLeft);

	let isGameOver = PLAYERS.some(player => player.points >= 100);

	return {
		isGameOver,
		handPoints,
	};
};

export const startGame = function* () {
	// init game data
	let handCounter = 0;
	let noWinner = null;
	let leaderboard = new Leaderboard();
	let result = null;

	console.log('You play as South');

	// hands
	do {
		handCounter++;
		let data = {
			handCounter,
		};
		console.log('\n#####################################');
		console.log(`\nStarting hand#${handCounter}`);

		result = yield* startHand(data);

		console.log(`\nEnding hand#${handCounter}`);

		let { isGameOver, handPoints } = result;

		PLAYERS.forEach((player, index) => {
			player.points += handPoints[index];
		});

		leaderboard.update(handPoints);
		leaderboard.display();

		noWinner = !isGameOver;
	} while (noWinner);

	console.log('\n#####################################');
	console.log('\n~ GAME OVER ~');

	let winner = PLAYERS.reduce((winner, player) => {
		return player.points < winner.points ? player : winner;
	});
	console.log(`\n${winner.name} wins!`);
	leaderboard.display();
};