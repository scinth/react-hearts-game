import React from 'react';
import Card from './Card';
import { PLAYERS } from '../logic/data';

function Pile({ player, cards, selectCard }) {
	return (
		<div className={`pile pile-${player}`}>
			{cards.map(card => {
				let style = 'card ';
				let _player = PLAYERS.find(_player => _player.name.toLowerCase() == player);
				let isSelected = _player.cardsToPass.find(code => code == card.code);
				if (isSelected) style += `${player} selected`;
				return (
					<div key={card.code}>
						<Card
							type={player == 'south' ? 'revealed' : 'folded'}
							image={card.image}
							style={style.trimEnd()}
							code={card.code}
							selectCard={selectCard}
						/>
					</div>
				);
			})}
		</div>
	);
}

export default Pile;
