import { BrowserWindow } from 'electron/main';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { WebSocketContext } from '../../websocket-context';

const roomCreationListener = (
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection,
	setRoomId: React.Dispatch<React.SetStateAction<string>>
) => {
	socket.on('room-created', async (data: any) => {
		const { roomId, answer } = data;

		await peerConnection.setRemoteDescription(answer);

		console.log(peerConnection);

		setRoomId(roomId);
	});
};

const createRoom = async (
	nickname: string,
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection
) => {
	const offer = await peerConnection.createOffer({
		offerToReceiveAudio: true,
		offerToReceiveVideo: true,
	});
	await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

	socket.emit('create-room', {
		offer,
		nickname,
	});
};

type RoomCreate = () => void;

const useRoomCreate = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const history = useHistory();

	const roomCreate = () => {
		const nickname = localStorage.getItem('nickname');

		if (!nickname) {
			return Error('Enter nickname!');
		}

		if (!(socket && peerConnection)) {
			throw new Error('miss context');
		}

		roomCreationListener(socket, peerConnection, (roomId) => {
			history.push(`/room/${roomId}`);
		});
		createRoom(nickname, socket, peerConnection);
	};

	return roomCreate;
};

export default useRoomCreate;
