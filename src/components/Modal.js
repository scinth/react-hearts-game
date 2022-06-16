import React from 'react';
import styled from 'styled-components';

const ModalContainer = styled.div`
	${props => props.status}
	justify-content: center;
	align-items: center;
	position: absolute;
	inset: 0;
	background-color: rgb(0, 0, 0, 0.5);
`;

const ModalCard = styled.div`
	width: 30vw;
	height: 30vh;
	background-color: white;
	border-radius: 1em;
`;

function Modal({ status }) {
	const displayType = status == 'opened' ? 'display: flex;' : 'display: none;';
	return (
		<ModalContainer status={displayType}>
			<ModalCard />
		</ModalContainer>
	);
}

export default Modal;
