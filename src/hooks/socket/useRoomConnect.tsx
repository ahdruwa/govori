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

		connectRoom(roomId, socket, peerConnection);
	};

	return roomConnect;
};

export default useConnectRoom;
