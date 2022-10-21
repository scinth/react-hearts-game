import React from 'react';
import { v4 } from 'uuid';
import Card from './Card';
import { PLAYERS } from '../logic/data';

function Pile({ player, cards, selected, selectCard }) {
	let _player = PLAYERS.find(_player => _player.name.toLowerCase() == player);
	return (
		<div className={`pile pile-${player}`}>
			{cards.map((card, index) => {
				let style = 'card ';
				let isSelected = _player.cardsToPass.find(code => code == card.code);
				if (isSelected || selected?.includes(index)) style += `${player} selected`;
				return (
					<div key={v4()}>
						<Card
							key={card.code}
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
