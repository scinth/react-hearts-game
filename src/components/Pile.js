import React from 'react';
import Card from './Card';
import styled from 'styled-components';
import { PLAYERS } from '../logic/data';

const Cards = styled.div`
	position: absolute;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	${props => props.position};
`;

function Pile({ player, cards, selectCard }) {
	let position = null;
	switch (player) {
		case 'north':
			position = `
        inset: 20px 20px auto 150px;
        flex-direction: row;
        & img:not(:first-child) {
          margin-left: -50px;
        }
      `;
			break;
		case 'east':
			position = `
        inset: 20px 20px 20px auto;
        flex-direction: column;
        & img:not(:first-child) {
          margin-top: calc(-9vh - 2.75vw);
        }
      `;
			break;
		case 'south':
			position = `
        inset: auto 150px 20px 20px;
        flex-direction: row;
        justify-content: flex-end;
        & img:not(:first-child) {
          margin-left: -50px;
        }
      `;
			break;
		case 'west':
			position = `
        inset: 20px auto 150px 20px;
        flex-direction: column;
        & img:not(:first-child) {
          margin-top: calc(-9vh - 2.75vw);
        }
      `;
			break;
	}

	return (
		<Cards position={position}>
			{cards.map(card => {
				let style = '';
				let _player = PLAYERS.find(_player => _player.name.toLowerCase() == player);
				let isSelected = _player.cardsToPass.find(code => code == card.code);
				if (isSelected) style = `${player} selected`;
				return (
					<Card
						key={card.code}
						type={player == 'south' ? 'revealed' : 'folded'}
						image={card.image}
						style={style}
						code={card.code}
						selectCard={selectCard}
					/>
				);
			})}
		</Cards>
	);
}

export default Pile;
