import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const newUserListener = (
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection,
	setUsers: (user: string) => void
) => {
	socket.on('new-user', async ({ answer, user }) => {
		await peerConnection.setRemoteDescription(
			new RTCSessionDescription(answer)
		);

		console.log({
			answer,
		});

		setUsers(user);
	});
};

const useUsers = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [users, setUsers] = useState<string[]>([]);

	useEffect(() => {
		if (!(socket && peerConnection)) {
			throw new Error('miss context');
		}

		newUserListener(socket, peerConnection, (user) => {
			users.push(user);
			setUsers(users);
		});
	}, [peerConnection, socket]);

	return users;
};

export default useUsers;
