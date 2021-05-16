import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const userListListener = (
	socket: SocketIOClient.Socket,
	setUsers: React.Dispatch<React.SetStateAction<string[]>>
) => {
	socket.on('update-user-list', (data: UserListDTO) => {
		const { users } = data;

		console.log(users);

		setUsers(users);
	});
};

const useUserList = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [users, setUsers] = useState<string[]>([]);

	useEffect(() => {
		if (!(socket && peerConnection)) {
			throw new Error('miss context');
		}

		userListListener(socket, setUsers);
	}, [socket, peerConnection]);

	return users;
};

export default useUserList;
