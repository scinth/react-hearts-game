import {
	findLeadPlayer,
	PLAYERS,
	set_IS_HEARTS_BROKEN,
	leadPlayerIndex,
	setLeadPlayerIndex,
	leaderboard,
	set_Leaderboard,
} from './data';
import { Trick, Leaderboard } from './classes';
import { getPlaySequence } from './index';
import { pass3Cards, returnTrickCards, segregateCards } from './requests';
import store from '../App/store';
import { setNotif } from '../features/Game/gameSlice';

const startTrick = function* (data) {
	let shootTheMoonPoints = 26;
	let gainedPoints = null;
	let trick = new Trick(data.isFirstTrick);

	for (let i = 0; i < data.sequence.length; i++) {
		let player = PLAYERS[data.sequence[i]];
		yield* player.play(trick);
	}

	let winnerIndex = trick.getWinnerIndex();
	let points = trick.getPoints();

	if (points == shootTheMoonPoints) {
		console.log(`${PLAYERS[winnerIndex]} shoot the moon!`);
		store.dispatch(setNotif(`${PLAYERS[winnerIndex]} shoot the moon!`));
		gainedPoints = PLAYERS.map((_, index) => {
			return winnerIndex == index ? 0 : shootTheMoonPoints;
		});
	} else {
		gainedPoints = PLAYERS.map((_, index) => {
			return winnerIndex == index ? points : 0;
		});
	}

	return {
		winnerIndex,
		gainedPoints,
	};
};

const startHand = function* (data) {
	let trickCounter = 1;
	let recipientCounter = data.handCounter % 4;
	let hasCardsLeft = null;
	let handPoints = [0, 0, 0, 0];
	let result = null;
	set_IS_HEARTS_BROKEN(false);

	yield segregateCards();

	if (recipientCounter != 0) {
		yield* PLAYERS[0].pass3Cards();
		yield* PLAYERS[1].pass3Cards();
		yield* PLAYERS[3].pass3Cards();

		let recipients = ['West', 'North', 'East'];
		console.log(`\nPass 3 cards to ${recipients[recipientCounter - 1]}:`);
		store.dispatch(setNotif(`Pass 3 cards to ${recipients[recipientCounter - 1]}`));

		yield* PLAYERS[2].pass3Cards();

		yield pass3Cards(recipientCounter);
		findLeadPlayer();

		console.log('\nCards successfully passed');
	} else {
		findLeadPlayer();
	}

	// tricks
	do {
		let data = {
			sequence: getPlaySequence(leadPlayerIndex),
			isFirstTrick: trickCounter == 1 ? true : false,
		};

		console.log('\n#####################################');
		console.log(`\nStarting trick#${trickCounter}`);

		result = yield* startTrick(data);

		console.log(`\nEnding trick#${trickCounter}`);

		console.log('Current hand points:');
		result.gainedPoints.forEach((points, index) => {
			handPoints[index] += points;
			console.log(`  ${PLAYERS[index].name}\t\t\t${handPoints[index]}`);
		});

		hasCardsLeft = trickCounter < 13;
		trickCounter++;

		yield returnTrickCards();
		setLeadPlayerIndex(result.winnerIndex);
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
	let result = null;
	set_Leaderboard(new Leaderboard());

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
