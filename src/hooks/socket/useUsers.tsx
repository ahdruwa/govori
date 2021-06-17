import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const newUserListener = (
	users: any[],
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection,
	setUsers: (user: any) => void
) => {
	socket.on('update-user-list', (users: any[]) => {
		console.log('USERLISTTTTTTTT');

		setUsers(users);
	});
	socket.on('user-update', (user: any) => {
		const updatedIndex = users.findIndex(
			(savedUser) => savedUser.nickname === user.nickname
		);

		if (updatedIndex === -1) {
			users.push(user);
			setUsers(users);
			return;
		}

		console.log(user, 'UPDATEUSER');

		const newUsers = [...users];
		newUsers[updatedIndex] = user;
		setUsers(newUsers);
	});
	console.log(socket.id);
};

const useUsers = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [users, setUsers] = useState<any[]>([]);

	const getUsersList = () => {
		socket?.emit('user-list');
		console.log('USERLISTSSSSSS', socket.id);
	};

	useEffect(() => {
		if (!(socket && peerConnection)) {
			throw new Error('miss context');
		}

		newUserListener(users, socket, peerConnection, setUsers);
		console.log(socket.id);

		getUsersList();
	}, [peerConnection, socket]);

	return [users, getUsersList];
};

export default useUsers;
