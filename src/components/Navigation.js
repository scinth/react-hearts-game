import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
	width: 100%;
	color: #333;
	background-color: transparent;
	display: flex;
	justify-content: space-between;
	align-items: center;

	> * {
		margin: 0 1.5rem;
	}

	.game-title {
		font-family: 'Courgette', cursive;
		font-size: 2.96rem;
		color: #ffffffdd;
	}

	.game-title,
	button {
		font-weight: bold;
		padding: 0.8rem 1.5rem;
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
				color: black;
				background-color: #ffffffaa;
				border: none;
				border-radius: 8rem;
				margin: 1.5rem 0.5rem;
				box-shadow: 0 2px 4px -1px rgb(0, 0, 0, 0.3);

				&:hover {
					transform: scale(1.05);
					transition: transform 0.18s ease;
				}
			}

			&:last-child button {
				margin-right: 0;
				color: crimson;
			}
		}
	}
`;

function Navigation() {
	return (
		<Nav>
			<div>
				{/* <img src="" alt="Hearts logo" /> */}
				<span className='game-title'>Hearts</span>
			</div>
			<ul>
				<li>
					<button>
						<i className='fa-solid fa-ranking-star' />
						Leaderboard
					</button>
				</li>
				<li>
					<button>
						<i className='fa-solid fa-rotate-left' />
						Restart
					</button>
				</li>
				<li>
					<button>
						<i className='fa-solid fa-heart-crack' />
						Quit
					</button>
				</li>
			</ul>
		</Nav>
	);
}

export default Navigation;
