import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import spinner from '../assets/icons8-loading-heart.gif';

const Wrapper = styled.div`
	position: absolute;
	inset: 0;
	height: 100vh;
	background-color: rgb(0, 0, 0, 0.3);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	img {
		width: calc(var(--card-width) * 2.5);
		mix-blend-mode: color-burn;
	}

	p {
		font-family: 'Courgette', cursive;
		font-size: calc(var(--card-width) / 1.5);
		font-weight: bold;
		text-align: center;
		color: #eee;
	}
`;

const Loader = ({ message }) => {
	return ReactDom.createPortal(
		<Wrapper>
			<img src={spinner} alt='spinner image' />
			<p>{message}</p>
		</Wrapper>,
		document.getElementById('loader-root'),
	);
};

export default Loader;
