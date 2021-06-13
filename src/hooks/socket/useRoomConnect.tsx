import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { WebSocketContext } from '../../websocket-context';

const roomConnectAcceptedListener = (
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection,
	onAccept: () => void
) => {
	socket.on('room-connect--accepted', async ({ answer, roomId }) => {
		await peerConnection.setRemoteDescription(
			new RTCSessionDescription(answer)
		);

		onAccept();
	});
};

const connectRoom = async (
	nickname: string,
	roomId: string,
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection
) => {
	const offer = await peerConnection.createOffer({
		offerToReceiveVideo: true,
		offerToReceiveAudio: true,
	});
	await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

	socket.emit('room-connect', {
		roomId,
		offer,
		nickname,
	});
};

const useConnectRoom = (roomId: string) => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const history = useHistory();

	const roomConnect = () => {
		const nickname = localStorage.getItem('nickname');

		if (!nickname) {
			return Error('Enter nickname!');
		}

		if (!socket || !peerConnection) {
			throw new Error('miss context');
		}

		roomConnectAcceptedListener(socket, peerConnection, () => {
			history.push(`/room/${roomId}`);
		});

		connectRoom(nickname, roomId, socket, peerConnection);
	};

	return roomConnect;
};

export default useConnectRoom;
