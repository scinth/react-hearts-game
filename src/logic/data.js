import { Player } from './classes';
import { fetchNorth } from '../features/North/northSlice';
import { fetchEast } from '../features/East/eastSlice';
import { fetchSouth } from '../features/South/southSlice';
import { fetchWest } from '../features/West/westSlice';
import store from '../App/store';
import { getDeck } from './requests';

// players
export const PLAYERS = (function () {
	let names = ['North', 'East', 'South', 'West'];
	let players = names.map(name => {
		return new Player(name);
	});
	return players;
})();

export let DECK_ID = localStorage.getItem('DECK_ID');
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
	if (typeof cb !== 'function') return;
	Promise.all([fetch_north, fetch_east, fetch_south, fetch_west]).then(responses => {
		if (responses.every(res => res.meta.requestStatus === 'fulfilled')) {
			cb();
		}
	});
};

export const getInitDeck = () => {
	if (DECK_ID !== null) return;
	let promise = getDeck();
	promise.then(json => {
		if (!json.success) {
			console.log('Cards fetch unsuccessful');
			return;
		}
		DECK_ID = json.deck_id;
		localStorage.setItem('DECK_ID', DECK_ID);
	});
};
