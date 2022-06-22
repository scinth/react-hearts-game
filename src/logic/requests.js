import { fetchEast } from '../features/East/eastSlice';
import { fetchNorth } from '../features/North/northSlice';
import { fetchSouth } from '../features/South/southSlice';
import { fetchTrick } from '../features/Trick/tricksSlice';
import { fetchWest } from '../features/West/westSlice';
import { DECK_ID, GAME, PLAYERS } from '../logic/data';
import store from '../App/store';

// const baseURL = `https://deckofcardsapi.com/api/deck/${DECK_ID}/`;

// const drawAllCardsFromDeck = null;
// const addCardsToPile = null;
const drawCardsFromPile = (playerName, cardCode) => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/${playerName}/draw/?cards=${cardCode}`;
	return fetch(endpoint);
};
const addCardToTrick = cardCode => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/Trick/add/?cards=${cardCode}`;
	return fetch(endpoint);
};
// const returnAllCardsFromTrick = null;

//////////////////////////

export const pass3Cards = (recipientCounter, index = 0) => {
	let recipientIndex = index + recipientCounter;
	while (recipientIndex >= 4) recipientIndex -= 4;
	let player = PLAYERS[index];
	let recipient = PLAYERS[recipientIndex];
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/${
		player.name
	}/draw/?cards=${player.cardsToPass.toString()}`;
	fetch(endpoint)
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				// add cards to target pile
				let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/${
					recipient.name
				}/add/?cards=${player.cardsToPass.toString()}`;
				fetch(endpoint)
					.then(res => res.json())
					.then(data => {
						if (data.success) {
							console.log(
								`${player.name} passed ${player.cardsToPass.toString()} to ${recipient.name}`,
							);
							player.cardsToPass = [];
							if (index == 3) GAME.next();
							else pass3Cards(recipientCounter, index + 1);
						}
					});
			}
		})
		.catch(err => {
			console.log('Error fetch', err);
		});
};

export const playTrick = (playerName, cardCode) => {
	drawCardsFromPile(playerName, cardCode)
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				console.log(`${cardCode} added to Trick`);
				addCardToTrick(cardCode)
					.then(res => res.json())
					.then(data => {
						if (data.success) {
							switch (playerName) {
								case 'North':
									store.dispatch(fetchNorth());
									break;
								case 'East':
									store.dispatch(fetchEast());
									break;
								case 'South':
									store.dispatch(fetchSouth());
									break;
								case 'West':
									store.dispatch(fetchWest());
							}
							store.dispatch(fetchTrick());
						} else {
							throw new Error('Adding card/s to trick is unsuccessful!');
						}
					});
			}
		});
};
