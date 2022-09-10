import React from 'react';
import styled from 'styled-components';
import logo from '../assets/nielbrioneshearts_logo.png';
import { returnTrickCards } from '../logic/requests';
import { play } from '../logic';
import Modal from './Modal';
import { GAME } from '../logic/data';
import { useSelector } from 'react-redux';
import store from '../App/store';
import { closeModal, showModal } from '../features/Modal/modalSlice';

const Nav = styled.nav`
	width: 100%;
	color: #333;
	background-color: #ffffff33;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-grow: 0;

	> * {
		margin: 0 1.5em;
	}

	.logo {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.image {
		width: auto;
		height: 3rem;
		margin-right: 1.5em;
	}

	.game-title {
		font-family: 'Courgette', cursive;
		font-size: 2.96rem;
		font-weight: bold;
		color: #ffffff;
	}

	ul {
		list-style-type: none;

		li {
			display: inline-block;

			i {
				padding-right: 0.5em;
			}

			button {
				font-family: 'Mulish', sans-serif;
				font-size: 0.93rem;
				font-weight: bold;
				color: black;
				background-color: #ffffffaa;
				border: none;
				border-radius: 8em;
				padding: 1em 1.5em;
				margin: 1.2em 0.6em;
				box-shadow: 0 2px 4px -1px rgb(0, 0, 0, 0.3);

				&:not(:disabled):hover {
					transform: scale(1.05);
					transition: transform 0.18s ease;
				}

				&:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
			}

			&:last-child button {
				margin-right: 0;
				color: crimson;
			}
		}
	}

	@media only screen and (max-width: 720px) {
		& .game-title {
			display: none;
		}
	}

	@media only screen and (max-width: 584px) {
		& .logo {
			display: none;
		}
		& ul {
			width: 100%;

			li:last-child {
				float: right;
			}
		}
	}

	@media only screen and (max-width: 464px) {
		ul li button {
			font-size: 0.58rem;
		}
	}

	@media only screen and (max-width: 307px) {
		ul {
			margin: 0 0.6em;
		}
	}
`;

const restart = () => {
	returnTrickCards(play);
};

function Navigation({ isGameReady, quit }) {
	const { open, type, paused } = useSelector(state => state.modal);
	const close = () => {
		if (paused) GAME.next();
		store.dispatch(closeModal());
	};
	return (
		<>
			<Nav>
				<div className='logo'>
					<img className='image' src={logo} alt='Hearts logo' />
					<span className='game-title'>Hearts</span>
				</div>
				<ul>
					<li>
						<button
							disabled={!isGameReady}
							onClick={() => {
								store.dispatch(showModal({ type: 'Rankings', paused: false }));
							}}
						>
							<i className='fa-solid fa-ranking-star' />
							Rankings
						</button>
					</li>
					<li>
						<button
							disabled={!isGameReady}
							onClick={() => {
								store.dispatch(showModal({ type: 'Restart', paused: false }));
							}}
						>
							<i className='fa-solid fa-rotate-left' />
							Restart
						</button>
					</li>
					<li>
						<button
							disabled={!isGameReady}
							onClick={() => {
								store.dispatch(showModal({ type: 'Quit', paused: false }));
							}}
						>
							<i className='fa-solid fa-heart-crack' />
							Quit
						</button>
					</li>
				</ul>
			</Nav>
			{open && (
				<Modal
					type={{
						name: type,
						action: (() => {
							switch (type) {
								case 'Restart':
									return restart;
								case 'Quit':
									return quit;
								default:
									return undefined;
							}
						})(),
					}}
					close={close}
				/>
			)}
		</>
	);
}

export default Navigation;
