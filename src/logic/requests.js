import { fetchEast } from '../features/East/eastSlice';
import { fetchNorth } from '../features/North/northSlice';
import { fetchSouth } from '../features/South/southSlice';
import { fetchTrick } from '../features/Trick/tricksSlice';
import { fetchWest } from '../features/West/westSlice';
import { DECK_ID, GAME, getPileCards, PLAYERS, networkErrorHandler } from '../logic/data';
import store from '../App/store';
import { setHandCounter, setLimit, setStatus } from '../features/Game/gameSlice';

const DEFAULT_OPTIONS = {
	headers: { 'Content-Type': 'application/json' },
};

const getNewDeck = () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/new/?deck_count=1`;
	return fetch(endpoint, { ...DEFAULT_OPTIONS });
};

const shuffleDeck = () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/shuffle`;
	return fetch(endpoint, { ...DEFAULT_OPTIONS });
};

const drawAllCardsFromDeck = () => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/draw/?count=52`;
	return fetch(endpoint, { ...DEFAULT_OPTIONS });
};

const addCardsToPile = (cardCodes, pileName) => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/${pileName}/add/?cards=${cardCodes}`;
	return fetch(endpoint, { ...DEFAULT_OPTIONS });
};

const addCardToTrick = cardCode => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/Trick/add/?cards=${cardCode}`;
	return fetch(endpoint, { ...DEFAULT_OPTIONS });
};

const returnAllCardsFromTrick = () => {
	let cards = store.getState().trick.cards;
	if (cards.length <= 0) {
		return new Promise(resolve => {
			resolve({
				ok: true,
				json: () =>
					new Promise(res => {
						res({ success: true, json: 'fullfilled' });
					}),
			});
		});
	}
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/Trick/return`;
	return fetch(endpoint, { ...DEFAULT_OPTIONS });
};

const returnAllCardsFromPile = pileName => {
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/${pileName}/return`;
	return fetch(endpoint, { ...DEFAULT_OPTIONS });
};

//////////////////////////

const makeRequest = (requestCallback, args) => {
	let resolve = null;
	const requestHandler = new Promise(res => {
		resolve = res;
	});
	requestCallback(...args)
		.then(response => {
			if (response.ok) return response.json();
			else {
				resolve({ ok: false });
				console.error('HTTP error:', response.status);
			}
		})
		.then(json => {
			if (json.success) resolve({ ok: true, json });
			else {
				resolve({ ok: false });
				console.error('DeckOfCardsAPI error');
			}
		})
		.catch(reason => {
			resolve({ ok: false });
			console.error(reason);
		});
	return requestHandler;
};

const tryRequest = async (requestCallback, args = [], status = null) => {
	let response = { ok: false };
	let retry = false;
	do {
		retry = false;
		if (status !== null) store.dispatch(setStatus(status));
		response = await makeRequest(requestCallback, args);
		if (!response.ok) {
			store.dispatch(setStatus(4));
			retry = await networkErrorHandler.openRetryModal();
		}
	} while (!response.ok && retry);
	return response.json;
};

export const getDeck = async () => {
	return await tryRequest(getNewDeck);
};

export const segregateCards = async () => {
	await tryRequest(shuffleDeck, [], 1);
	console.log('Deck shuffled');
	const json = await tryRequest(drawAllCardsFromDeck, [], 2);
	const cards = json.cards.map(card => card.code);

	// adding cards to pile
	for (const { name } of PLAYERS) {
		const cardCodes = cards.splice(0, 13).toString();
		await tryRequest(addCardsToPile, [cardCodes, name]);
	}

	console.log('Cards segregated');
	getPileCards(() => {
		GAME.next();
	});
};

export const pass3Cards = async recipientCounter => {
	for (let index = 0; index < 4; index++) {
		let recipientIndex = index + recipientCounter;
		if (recipientIndex >= 4) recipientIndex -= 4;
		let player = PLAYERS[index];
		let recipient = PLAYERS[recipientIndex];
		let cardCodes = player.cardsToPass.toString();
		await tryRequest(addCardsToPile, [cardCodes, recipient.name], 3);
		player.cardsToPass = [];
	}

	getPileCards(() => {
		GAME.next();
	});
};

export const playTrick = async (playerName, cardCode) => {
	await tryRequest(addCardToTrick, [cardCode]);

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
	store.dispatch(fetchTrick(() => GAME.next()));
};

export const returnTrickCards = async (cb = null) => {
	await tryRequest(returnAllCardsFromTrick);
	if (typeof cb == 'function') {
		// reset game
		store.dispatch(setLimit(3));
		store.dispatch(setHandCounter(1));
		cb();
		console.clear();
	} else
		store.dispatch(
			fetchTrick(() => {
				GAME.next();
			}),
		);
};

class Request {
	constructor(callback, args = []) {
		this.promise = null;
		this.callback = callback;
		this.args = args;
		this.ok = false;
	}
	try() {
		if (this.ok) return;
		let promise = this.callback(...this.args);
		promise.then(response => {
			this.ok = response.ok;
		});
		this.promise = promise;
	}
}

const makeMultipleRequests = requests => {
	let resolve = null;
	const requestHandler = new Promise(res => {
		resolve = res;
	});
	Promise.all(requests)
		.then(responses => {
			if (responses.every(response => response.ok)) {
				resolve({ ok: true });
			} else {
				resolve({ ok: false });
				console.error('then error: HTTP error');
			}
		})
		.catch(reason => {
			resolve({ ok: false });
			console.error('catch error:', reason);
		});
	return requestHandler;
};

const tryMultipleRequests = async callback => {
	let response = { ok: false };
	let retry = false;
	do {
		retry = false;
		response = await makeMultipleRequests(callback());
		if (!response.ok) {
			store.dispatch(setStatus(4));
			retry = await networkErrorHandler.openRetryModal();
		}
	} while (!response.ok && retry);
};

export const returnAllCardsToDeck = async () => {
	let requests = [];
	for (const { name } of PLAYERS) {
		requests.push(new Request(returnAllCardsFromPile, [name]));
	}
	requests.push(new Request(returnAllCardsFromTrick));
	const getAllUnresolvedRequests = () => {
		let unresolved = requests
			.filter(request => {
				request.try();
				return !request.ok;
			})
			.map(request => request.promise);
		return unresolved;
	};
	await tryMultipleRequests(getAllUnresolvedRequests);
	store.dispatch(fetchNorth());
	store.dispatch(fetchEast());
	store.dispatch(fetchSouth());
	store.dispatch(fetchWest());
	store.dispatch(fetchTrick());
};
