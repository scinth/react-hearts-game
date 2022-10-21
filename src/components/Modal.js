import React from 'react';
import ReactDom from 'react-dom';
import store from '../App/store';
import { useSelector } from 'react-redux';
import { closeModal } from '../features/Modal/modalSlice';
import { v4 } from 'uuid';
import styled from 'styled-components';
import { GAME, leaderboard, networkErrorHandler } from '../logic/data';
import { returnTrickCards } from '../logic/requests';
import { play } from '../logic';

const ModalContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	inset: 0;
	height: 100vh;
	background-color: rgb(0, 0, 0, 0.5);
`;

const ModalCard = styled.div`
	font-size: 3vmin;
	width: 85vmin;
	background-color: white;
	border-radius: 1em;
	overflow: hidden;

	.table-wrapper {
		max-height: 50vh;
		overflow-y: scroll;
	}

	table {
		font-family: 'Mulish', sans-serif;
		width: 100%;
		border-collapse: collapse;
		overflow: hidden;

		tbody tr:not(.status):nth-child(odd) {
			background-color: #f0f0f0;
		}

		th {
			color: tomato;
			padding: 1em;
			border: none;
		}

		th:first-of-type {
			color: initial;
		}

		td {
			font-weight: bold;
			padding: 0.5em;
			text-align: center;
			border: none;
		}

		.total {
			border-top: 1px dashed #888;
		}
	}

	h1 {
		font-family: 'Courgette', cursive;
		text-align: center;
		color: tomato;
		padding: 1em 1em 0.5em;
	}

	p {
		font-family: 'Mulish', sans-serif;
		font-weight: bold;
		text-align: center;
		color: #333;
		padding: 0 2em 2em;
	}

	.buttons {
		display: flex;
		justify-content: center;
		align-items: center;

		button {
			font-family: 'Mulish', sans-serif;
			font-size: 0.9em;
			font-weight: bold;
			background: none;
			border: 2px solid;
			border-radius: 0.4em;
			padding: 1em;
			margin: 1em 1em 2em;
			min-width: 7em;
		}

		button:last-child {
			background-color: gold;
		}
	}
`;

const createModalTable = () => {
	return (
		<div className='table-wrapper'>
			<table>
				<thead>
					<tr>
						<th>HAND</th>
						<th>NORTH</th>
						<th>EAST</th>
						<th>SOUTH</th>
						<th>WEST</th>
					</tr>
				</thead>
				<tbody>
					{leaderboard.points.map((point, index) => {
						return (
							<tr key={v4()}>
								<td>{index + 1}</td>
								<td>{point[0]}</td>
								<td>{point[1]}</td>
								<td>{point[2]}</td>
								<td>{point[3]}</td>
							</tr>
						);
					})}
					<tr className='status total'>
						<td>TOTAL</td>
						{leaderboard.total.map(point => {
							return <td key={v4()}>{point}</td>;
						})}
					</tr>
					<tr className='status ranks'>
						<td>RANKS</td>
						{leaderboard.ranks.map(rank => {
							return <td key={v4()}>{rank}</td>;
						})}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

const restart = () => {
	returnTrickCards(play);
};

function Modal({ quitGame }) {
	const { open, type, paused } = useSelector(state => state.modal);
	const close = () => {
		if (paused) GAME.next();
		store.dispatch(closeModal());
	};
	const action = (() => {
		switch (type) {
			case 'Restart':
				return restart;
			case 'Quit':
				return quitGame;
			default:
				return undefined;
		}
	})();
	const JSX = open
		? ReactDom.createPortal(
				<ModalContainer
					onClick={e => {
						if (type != 'NetworkError' && e.target === e.currentTarget) close();
					}}
				>
					<ModalCard>
						{type == 'Rankings' && createModalTable()}
						{(type == 'Restart' || type == 'Quit') && (
							<>
								<h1>{`${type} Game`}</h1>
								<p>
									{`Are you sure to ${type.toLowerCase()} the game?`}
									<br />
									All your progress will be lost.
								</p>
							</>
						)}
						{type == 'NetworkError' && (
							<>
								<h1>Network Error</h1>
								<p>Slow network, please check your connection.</p>
							</>
						)}
						<div className='buttons'>
							{action && (
								<button
									onClick={() => {
										close();
										action();
									}}
								>
									YES
								</button>
							)}
							<button
								onClick={() => {
									close();
									if (type == 'NetworkError') {
										networkErrorHandler.resolve(true);
									}
								}}
							>
								{type == 'Rankings' ? 'OK' : type == 'NetworkError' ? 'Retry' : 'NO'}
							</button>
						</div>
					</ModalCard>
				</ModalContainer>,
				document.getElementById('modal-root'),
		  )
		: null;
	return JSX;
}

export default Modal;
