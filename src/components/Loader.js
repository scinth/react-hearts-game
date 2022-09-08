import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
	position: absolute;
	inset: 0;
	height: 100vh;
	background-color: rgb(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;

	p {
		font-family: 'Courgette', cursive;
		font-size: 3rem;
		font-weight: bold;
		color: #ccc;
	}
`;

const Loader = ({ message }) => {
	return ReactDom.createPortal(
		<Wrapper>
			<p>{message}</p>
		</Wrapper>,
		document.getElementById('loader-root'),
	);
};

export default Loader;
