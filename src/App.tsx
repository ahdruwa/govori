import React, { useContext, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import io from 'socket.io-client';

import icon from '../assets/icon.svg';
import './App.global.css';
import useAnswerlMadeListener from './hooks/socket/useAnswerMade';
import useCallMadeListener from './hooks/socket/useCallMade';
import useCallUser from './hooks/socket/useCallUser';
import useRTCtrack from './hooks/socket/useRTCtrack';
import useUserList from './hooks/socket/useUserList';
import { WebSocketContext } from './websocket-context';

const usePizdec = () => {
	const { socket } = useContext(WebSocketContext);

	return socket;
};

const Hello = () => {
	const userList = useUserList();
	const video = useRef();
	const { socket, peerConnection } = useContext(WebSocketContext);

	const callUser = useCallUser();
	const [callMade, callHandlers] = useCallMadeListener();

	const { callAccept } = callHandlers;

	const stream = useRTCtrack();

	useEffect(() => {
		console.log(stream);

		video.current.srcObject = stream;
	}, [stream]);

	useEffect(() => {
		peerConnection.onicecandidate = (e) => {
			console.log(userList[0]);

			if (!e.candidate) return;

			console.log(e.candidate, 2);

			socket?.on('answer-made', () => {
				socket?.emit('ice-candidate', {
					destination: userList[0],
					iceCandidate: e.candidate,
				});
			});
		};
		socket?.on('ice-candidate', async ({ iceCandidate }) => {
			if (!iceCandidate) return;

			console.log(iceCandidate, 1);

			try {
				await peerConnection?.addIceCandidate(
					new RTCIceCandidate(iceCandidate)
				);
			} catch (e) {
				console.error('Error adding received ice candidate', e);
			}
		});
		peerConnection?.addEventListener('connectionstatechange', (event) => {
			console.log(event);

			if (peerConnection.connectionState === 'connected') {
				console.log('CONNECTED');
			}
		});
	}, [userList, peerConnection, socket]);

	return (
		<div>
			<div className="Hello">
				<video autoPlay width="200px" ref={video} />
			</div>
			<h1>electron-react-boilerplate</h1>
			<div className="Hello">
				<button onClick={callAccept} type="button">
					<span role="img" aria-label="books">
						📚
					</span>
					Read our docs
				</button>
				<button type="button" onClick={() => callUser(userList[0])}>
					<span role="img" aria-label="books">
						🙏
					</span>
					Donate
				</button>
			</div>
		</div>
	);
};

export default function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" component={Hello} />
			</Switch>
		</Router>
	);
}
