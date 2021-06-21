import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { WebSocketContext } from '../../websocket-context';

const roomConnectAcceptedListener = (
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection,
	onAccept: (e: Error) => void
) => {
	socket.on('room-connect--accepted', async ({ answer, roomId }) => {
		await peerConnection.setRemoteDescription(
			new RTCSessionDescription(answer)
		);

		onAccept(null);
	});
	socket.on('connection-error', () => {
		onAccept(new Error('Неправильный номер комнаты'));
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
	const [error, setError] = useState<Error>(null);

	const roomConnect = () => {
		const nickname = localStorage.getItem('nickname');

		if (!nickname) {
			return Error('Введите имя пользователя в настройках!');
		}

		if (!socket || !peerConnection) {
			throw new Error('miss context');
		}

		roomConnectAcceptedListener(socket, peerConnection, (error: Error) => {
			if (!error) {
				return history.push(`/room/${roomId}`);
			}

			return setError(error);
		});

		connectRoom(nickname, roomId, socket, peerConnection);
	};

	return [error, roomConnect];
};

export default useConnectRoom;
