import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const newUserListener = (
	users: any[],
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection,
	setUsers: (user: any) => void
) => {
	socket.on('user-update', (user: any) => {
		const updatedIndex = users.findIndex(
			(savedUser) => savedUser.nickname === user.nickname
		);

		if (updatedIndex === -1) {
			users.push(user);
			setUsers(users);
			return;
		}

		console.log(updatedIndex);

		users[updatedIndex] = user;
		setUsers(users);
	});
	socket.on('user-list', (users: any[]) => {
		console.log('USERLISTTTTTTTT');

		setUsers(users);
	});
};

const useUsers = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [users, setUsers] = useState<any[]>([]);

	const getUsersList = () => {
		socket?.emit('user-list');
		console.log('USERLISTSSSSSS');

	};

	useEffect(() => {
		if (!(socket && peerConnection)) {
			throw new Error('miss context');
		}

		newUserListener(users, socket, peerConnection, setUsers);
		getUsersList();
	}, [peerConnection, socket]);

	return [users, getUsersList];
};

export default useUsers;
