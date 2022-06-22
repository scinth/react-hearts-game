import { Player } from './classes';
import { fetchNorth } from '../features/North/northSlice';
import { fetchEast } from '../features/East/eastSlice';
import { fetchSouth } from '../features/South/southSlice';
import { fetchWest } from '../features/West/westSlice';
import store from '../App/store';

// cards
export let CARDS = [];

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

export const setLeadPlayerIndex = value => {
	leadPlayerIndex = value;
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
	console.log('Selected card: ', code);
	GAME.next();
};

export const getCards = name => {
	let player = PLAYERS.find(player => player.name == name);
	return player.cards;
};

export const getPileCards = () => {
	store.dispatch(fetchNorth());
	store.dispatch(fetchEast());
	store.dispatch(fetchSouth());
	store.dispatch(fetchWest());
};

const segregateCards = (pileIndex = 0) => {
	if (pileIndex > 3) {
		getPileCards();
		return;
	}
	let pileName = ['North', 'East', 'West', 'South'];
	let sliceStart = pileIndex * 13;
	let cards = CARDS.slice(sliceStart, sliceStart + 13);
	// let _2C_ = cards.find(code => code == '2C');
	// if (_2C_) {
	// 	leadPlayerIndex = pileIndex;
	// }
	let endpoint = `https://deckofcardsapi.com/api/deck/${DECK_ID}/pile/${
		pileName[pileIndex]
	}/add/?cards=${cards.toString()}`;
	fetch(endpoint)
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				console.log(`Cards ${cards.toString()} segregated to ${pileName[pileIndex]}`);
				segregateCards(pileIndex + 1);
			} else {
				throw new Error(`Segregation fails at ${pileName[pileIndex]}`);
			}
		})
		.catch(err => {
			console.log(`Card segregation unsuccessful: ${err}`);
		});
};

export const getInitCards = function () {
	if (DECK_ID !== null) {
		console.log(`Deck ID: ${DECK_ID}`);
		getPileCards();
		// segregateCards();
		return;
	}
	let endpoint = 'https://deckofcardsapi.com/api/deck/new/draw/?count=52';
	fetch(endpoint)
		.then(res => res.json())
		.then(data => {
			if (!data.success) {
				console.log('Cards fetch unsuccessful');
				return;
			}
			DECK_ID = data.deck_id;
			CARDS = data.cards.map(card => card.code);
			localStorage.setItem('DECK_ID', DECK_ID);
			segregateCards();
		})
		.catch(err => {
			console.log(err);
			// TODO  handle network error
		});
};
