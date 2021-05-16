import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { WebSocketContext } from '../../websocket-context';

const roomCreationListener = (
	socket: SocketIOClient.Socket,
	setRoomId: React.Dispatch<React.SetStateAction<string>>
) => {
	console.log(Date.now());

	socket.on('room-created', (data: any) => {
		const { roomId } = data;

		setRoomId(roomId);
	});
};

const createRoom = async (
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection
) => {
	const offer = await peerConnection.createOffer();
	await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

	socket.emit('create-room', {
		offer,
	});
};

type RoomCreate = () => void;

const useRoomCreate = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	// const [roomCreateState, setRoomCreate] = useState<RoomCreate>(() => {});
	const history = useHistory();

	const roomCreate = () => {
		roomCreationListener(socket, (roomId) => {
			history.push(`/room/${roomId}`);
		});
		createRoom(socket, peerConnection);
	};

	return roomCreate;
};

export default useRoomCreate;
