import React from 'react';
import styled from 'styled-components';

const Home = styled.div`
	font-size: var(--card-width);
	width: 100%;
	flex-grow: 1;
	overflow-y: scroll;
`;

const Wrapper = styled.div`
	width: inherit;
	height: inherit;
	color: #fff2e2;
	background-color: rgb(0 0 0 / 10%);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-shadow: 0.06em 0.06em 0.1em rgb(0 0 0 / 50%);

	h1 {
		font-family: 'Courgette', sans-serif;
		font-size: 1.2em;
		padding: 1em 1em 0;
		text-align: center;
	}

	section {
		font-family: 'Mulish', sans-serif;
		width: 90%;

		h2 {
			font-size: 0.6em;
			font-weight: normal;
			letter-spacing: 0.1em;
			padding: 1.8em 0 0.3em;
		}

		ol {
			list-style-position: inside;
		}

		p,
		ol {
			font-size: 0.4em;
			line-height: 1.8em;
		}
	}

	@media screen and (min-aspect-ratio: 10 / 8) {
		& section {
			width: 80%;
		}
	}
	@media screen and (min-aspect-ratio: 10 / 6) {
		& section {
			width: 70%;
		}
	}
	@media screen and (min-aspect-ratio: 10 / 4) {
		& section {
			width: 60%;
		}
	}
`;

const StartButton = styled.button`
	font-family: 'Mulish', sans-serif;
	font-size: 0.35em;
	text-transform: uppercase;
	margin: 2em;
	padding: 1em 2em;
	color: white;
	background: linear-gradient(to bottom, #a00, #a33);
	border: none;
	border-radius: 0.5em;
`;

function HomePage({ startGame }) {
	return (
		<Home>
			<Wrapper>
				<h1>Welcome to Hearts!</h1>
				<section>
					<h2>ABOUT GAME</h2>
					<p>
						<br />
						The Goal:
						<br />
						To score as few points as possible.
					</p>
					<p>
						<br />
						How to Play:
						<br />
						You are playing as South and your opponents (played by your computer) are North, East
						and West. Players begins each hand by passing 3 cards to their opponent (except every
						4th hand). The player who owns the "Two of Clubs" must play that card to start the first
						trick. Players must play a card with the same suit as the first card played in a trick
						if possible, otherwise can play any card except the first trick where "Hearts" and the
						"Queen of Spades" cannot be played. Also, "Hearts" cannot be played until it is broken.
						<br />
						<br />
						Whoever played the highest card (cards are ranked from "Ace" as highest to "Two" as
						lowest) wins the trick. Players will take turns in clockwise order starting from the
						player who wins the previous trick or owns the "Two of Clubs" at the start of game. The
						game ends when a player gains a total points greater than or equal to 100, where the
						player with the lowest total points wins the game.
					</p>
					<p>
						<br />
						Scoring:
						<br />
						Each "Hearts" card is equivalent to 1 point, while the "Queen of Spades" is equivalent
						to 13 points.
						<br />
						The player who "Shoot the moon" gains 0 points, while others receive 26 points each.
					</p>
					<p>
						<br />
						Game Terminology:
						<br />
						Hand - a state where players play a set of 13 tricks.
						<br />
						Trick - cards played in a single round.
						<br />
						Hearts is broken - Hearts are already been played.
						<br />
						Shoot the moon - a single player wins all "Hearts" card, and the "Queen of Spades" card.
					</p>
				</section>
				<section>
					<h2>GAME MECHANICS</h2>
					<p>Tap/Click</p>
					<ol type='1'>
						<li>
							On a card to select/deselect it. Selected cards will be highlighted and lifted out
							from the pile.
						</li>
						<li>The "Pass 3 cards" button to pass 3 cards.</li>
						<li>At the center of the table to play the selected card.</li>
					</ol>
				</section>
				<StartButton onClick={() => startGame()}>start</StartButton>
			</Wrapper>
		</Home>
	);
}

export default HomePage;
