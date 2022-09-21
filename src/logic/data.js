import { Player } from './classes';
import { fetchNorth } from '../features/North/northSlice';
import { fetchEast } from '../features/East/eastSlice';
import { fetchSouth } from '../features/South/southSlice';
import { fetchWest } from '../features/West/westSlice';
import { fetchTrick } from '../features/Trick/tricksSlice';
import { setStatus } from '../features/Game/gameSlice';
import store from '../App/store';
import { getDeck } from './requests';

const getDeckId = () => {
	let pair = document.cookie.split('; ').find(pair => {
		return pair.includes('deck_id');
	});
	if (pair) return pair.split('=')[1];
	return null;
};

export const setDeckId = (id = null) => {
	let maxAge = 60 * 60 * 24 * 14;
	let deck_id = id === null ? DECK_ID : id;
	let cookie = `deck_id=${deck_id};max-age=${maxAge};Secure`;
	document.cookie = cookie;
};

// players
export const PLAYERS = (function () {
	let names = ['North', 'East', 'South', 'West'];
	let players = names.map(name => {
		return new Player(name);
	});
	return players;
})();

export let DECK_ID = getDeckId();
export let GAME = null;
export let leadPlayerIndex = null;
export let IS_HEARTS_BROKEN = false;
export let me = PLAYERS[2];
export let leaderboard;
export const set_Leaderboard = value => {
	leaderboard = value;
};

export const setLeadPlayerIndex = value => {
	leadPlayerIndex = value;
};

export const findLeadPlayer = () => {
	for (let i = 0; i < PLAYERS.length; i++) {
		let player = PLAYERS[i];
		let twoOfClubs = player.cards.find(card => card.code == '2C');
		if (twoOfClubs) {
			console.log(`${player.name} starts the first trick`);
			leadPlayerIndex = i;
			break;
		}
	}
};

export const set_GAME = newGame => {
	GAME = newGame;
};

export const set_IS_HEARTS_BROKEN = isBroken => {
	IS_HEARTS_BROKEN = isBroken;
};

me.select3Cards = function (codes) {
	let cards = codes.map(code => {
		return this.cards.find(card => card.code == code);
	});
	this.cardsToPass = cards;
	GAME.next();
};

me.selectCard = function (code) {
	this.selectedCard = code;
	GAME.next();
};

export const getCards = name => {
	let player = PLAYERS.find(player => player.name == name);
	return player.cards;
};

export const getPileCards = (cb = null) => {
	let fetch_north = store.dispatch(fetchNorth());
	let fetch_east = store.dispatch(fetchEast());
	let fetch_south = store.dispatch(fetchSouth());
	let fetch_west = store.dispatch(fetchWest());
	let fetch_trick = store.dispatch(fetchTrick());
	Promise.all([fetch_north, fetch_east, fetch_south, fetch_west, fetch_trick]).then(responses => {
		if (responses.every(res => res.meta.requestStatus === 'fulfilled')) {
			store.dispatch(setStatus(4));
			if (typeof cb === 'function') cb();
		}
	});
};

export const getInitDeck = () => {
	if (DECK_ID !== null) {
		setDeckId();
		return;
	}
	let promise = getDeck();
	promise.then(json => {
		if (!json.success) {
			console.log('Cards fetch unsuccessful');
			return;
		}
		DECK_ID = json.deck_id;
		setDeckId(DECK_ID);
	});
};
