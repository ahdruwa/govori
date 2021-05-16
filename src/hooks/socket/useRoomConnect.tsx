import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { WebSocketContext } from '../../websocket-context';

const roomConnectAcceptedListener = (
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection,
	onAccept: () => void
) => {
	socket.on('room-connect--accepted', async ({ offer, roomId }) => {
		await peerConnection.setRemoteDescription(
			new RTCSessionDescription(offer)
		);

		const answer = await peerConnection.createAnswer();
		await peerConnection.setLocalDescription(answer);

		console.log({
			offer,
			answer,
		});

		socket.emit('room-connect--accepted', {
			roomId,
			answer,
		});

		onAccept();
	});
};

const connectRoom = async (roomId: string, socket: SocketIOClient.Socket) => {
	socket.emit('room-connect', {
		roomId,
	});
};

const useConnectRoom = (roomId: string) => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const history = useHistory();

	const roomConnect = () => {
		if (!socket || !peerConnection) {
			throw new Error('miss context');
		}

		roomConnectAcceptedListener(socket, peerConnection, () => {
			history.push(`/room/${roomId}`);
		});

		connectRoom(roomId, socket);
	};

	return roomConnect;
};

export default useConnectRoom;
