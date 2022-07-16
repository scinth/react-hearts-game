import { fetchEast } from '../features/East/eastSlice';
import { fetchNorth } from '../features/North/northSlice';
import { fetchSouth } from '../features/South/southSlice';
import { fetchTrick } from '../features/Trick/tricksSlice';
import { fetchWest } from '../features/West/westSlice';
import { DECK_ID, GAME, getPileCards, PLAYERS } from '../logic/data';
import store from '../App/store';

const getNewDeck = () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/new/?deck_count=1`;
	return fetch(endpoint);
};

const shuffleDeck = () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/shuffle`;
	return fetch(endpoint);
};

const drawAllCardsFromDeck = () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/draw/?count=52`;
	return fetch(endpoint);
};

const addCardsToPile = (cardCodes, pileName) => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/${pileName}/add/?cards=${cardCodes}`;
	return fetch(endpoint);
};

const addCardToTrick = cardCode => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/Trick/add/?cards=${cardCode}`;
	return fetch(endpoint);
};

const returnAllCardsFromTrick = () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/Trick/return`;
	return fetch(endpoint);
};

//////////////////////////

export const getDeck = async () => {
	try {
		let response = await getNewDeck();
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		const json = await response.json();
		return json;
	} catch (error) {
		console.log('getDeck failed', error);
	}
};

export const segregateCards = async () => {
	try {
		let response, json;
		response = await shuffleDeck();
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		json = await response.json();
		if (!json.success) {
			throw new Error('shuffleDeck failed');
		}
		console.log('Deck shuffled');
		response = await drawAllCardsFromDeck();
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		json = await response.json();
		if (!json.success) {
			throw new Error('drawAllCardsFromDeck failed');
		}
		let cards = [...json.cards].map(card => card.code);

		// INFO  adding cards to pile
		for (let i = 0; i < 4; i++) {
			let name = PLAYERS[i].name;
			let cardCodes = cards.splice(0, 13).toString();
			response = await addCardsToPile(cardCodes, name);
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			json = await response.json();
			if (!json.success) {
				throw new Error(`addCardsToPile(${name}) failed`);
			}
		}

		console.log('Cards segregated');
		getPileCards(() => {
			GAME.next();
		});
	} catch (error) {
		console.log('Fetch task "segregateCards" failed', error);
	}
};

export const pass3Cards = async recipientCounter => {
	try {
		for (let index = 0; index < 4; index++) {
			let recipientIndex = index + recipientCounter;
			while (recipientIndex >= 4) recipientIndex -= 4;
			let player = PLAYERS[index];
			let recipient = PLAYERS[recipientIndex];
			let response = await addCardsToPile(player.cardsToPass.toString(), recipient.name);
			if (!response.ok) {
				throw new Error(`HTTP error on pass3Cards${index}: ${response.status}`);
			}
			player.cardsToPass = [];
		}

		getPileCards(() => {
			GAME.next();
		});
	} catch (error) {
		console.log('pass3cards failed', error);
	}
};

export const playTrick = async (playerName, cardCode) => {
	try {
		let response = await addCardToTrick(cardCode);
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		let json = await response.json();
		if (!json.success) {
			throw new Error(`addCardToTrick fails`);
		}

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
	} catch (error) {
		console.log('playTrick failed', error);
	}
};

export const returnTrickCards = async () => {
	try {
		let response = await returnAllCardsFromTrick();
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		let json = await response.json();
		if (!json.success) {
			throw new Error(`returnAllCardsFromTrick failed`);
		}
		store.dispatch(fetchTrick());
	} catch (error) {
		console.log('returnTrickCards failed', error);
	}
};
