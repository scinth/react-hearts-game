import React from 'react';
import Card from './Card';
import styled from 'styled-components';

const Cards = styled.div`
	position: absolute;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	${props => props.position};
`;

function Deck({ player, cards, selectCard }) {
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
        inset: 150px 20px 20px auto;
        flex-direction: column;
        & img:not(:first-child) {
          margin-top: -90px;
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
          margin-top: -90px;
        }
      `;
			break;
	}

	return (
		<Cards position={position}>
			{cards.map(card => {
				return (
					<Card
						key={card.code}
						type={player == 'south' ? 'revealed' : 'folded'}
						image={card.image}
						code={card.code}
						selectCard={selectCard}
					/>
				);
			})}
		</Cards>
	);
}

export default Deck;
