import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import { leaderboard } from '../logic/data';

const ModalContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	inset: 0;
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
							<tr key={index}>
								<td>{index + 1}</td>
								<td>{point[0]}</td>
								<td>{point[1]}</td>
								<td>{point[2]}</td>
								<td>{point[3]}</td>
							</tr>
						);
					})}
					<tr className='total'>
						<td>TOTAL</td>
						{leaderboard.total.map((point, index) => {
							return <td key={index}>{point}</td>;
						})}
					</tr>
					<tr>
						<td>RANKS</td>
						{leaderboard.ranks.map((rank, index) => {
							return <td key={index}>{rank}</td>;
						})}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

function Modal({ type, close }) {
	return ReactDom.createPortal(
		<ModalContainer
			onClick={e => {
				if (e.target === e.currentTarget) close();
			}}
		>
			<ModalCard>
				{type.name == 'Rankings' && createModalTable()}
				{(type.name == 'Restart' || type.name == 'Quit') && (
					<>
						<h1>{`${type.name} Game`}</h1>
						<p>
							{`Are you sure to ${type.name.toLowerCase()} the game?`}
							<br />
							All your progress will be lost.
						</p>
					</>
				)}
				<div className='buttons'>
					{type.action && (
						<button
							onClick={() => {
								close();
								type.action();
							}}
						>
							YES
						</button>
					)}
					<button onClick={close}>{type.name == 'Rankings' ? 'OK' : 'NO'}</button>
				</div>
			</ModalCard>
		</ModalContainer>,
		document.getElementById('modal-root'),
	);
}

export default Modal;
