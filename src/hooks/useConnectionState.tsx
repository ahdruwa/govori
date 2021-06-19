import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../websocket-context';

const useConnectionState = () => {
	const { socket, peerConnection } =
		useContext<WebSocketEntity>(WebSocketContext);
	const [connectionState, setConnectionState] = useState('');

	useEffect(() => {
		if (!peerConnection) throw new Error('miss context');

		peerConnection.addEventListener('connectionstatechange', (e) => {
			setConnectionState(e.target.connectionState);
		});
	}, [peerConnection]);

	return connectionState;
};

export default useConnectionState;
