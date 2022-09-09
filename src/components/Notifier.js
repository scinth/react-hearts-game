import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Notif = styled.p`
	--width: calc(var(--card-width) * 7);
	--margin: calc((100% - var(--width)) / 2);
	font-family: 'Courgette', cursive;
	font-size: calc(var(--card-width) / 3.9);
	width: var(--width);
	margin-left: var(--margin);
	padding: 1em 1.5em;
	color: #333;
	background: linear-gradient(45deg, #fff3, transparent);
	border-radius: 0.6em;
	position: absolute;
	bottom: calc(var(--card-height) + 7vmin);
	z-index: -1;
`;

const Notifier = () => {
	const notif = useSelector(state => state.game.notif);
	return <>{notif !== '' && <Notif>{notif}</Notif>}</>;
};

export default Notifier;
