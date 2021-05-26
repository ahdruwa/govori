import React, {
	createContext,
	ReactChild,
	useEffect,
	useMemo,
	useRef,
} from 'react';
import io from 'socket.io-client';

type Props = {
	children: ReactChild;
};

const defaultWS = {
	socket: undefined,
	peerConnection: undefined,
	dataChannel: undefined,
};

const WebSocketContext = createContext<WebSocketEntity>(defaultWS);

export { WebSocketContext };

const WebSocketContextProvider = ({ children }: Props) => {
	const peerConnection = useMemo(() => new window.RTCPeerConnection(), []);
	const ws = useMemo(
		() => ({
			socket: io('ws://localhost:3000/signalization'),
			peerConnection,
			dataChannel: peerConnection.createDataChannel('ConnectionState'),
		}),
		[]
	);

	useEffect(() => {
		setInterval(async () => {
			const stats = await ws.peerConnection.getStats();

			stats.forEach((stat) => console.log(stat));
		}, 10000);

		ws.peerConnection?.addEventListener(
			'connectionstatechange',
			(event) => {
				console.log(event);

				if (ws.peerConnection.connectionState === 'connected') {
					console.log('CONNECTED');
					ws.dataChannel.send('connected');
				}
			}
		);
	}, []);

	return (
		<WebSocketContext.Provider value={ws}>
			{children}
		</WebSocketContext.Provider>
	);
};

export default WebSocketContextProvider;
