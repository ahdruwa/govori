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
};

const WebSocketContext = createContext<WebSocketEntity>(defaultWS);

export { WebSocketContext };

const WebSocketContextProvider = ({ children }: Props) => {
	const ws = useMemo(
		() => ({
			socket: io('ws://192.168.0.100:3000/signalization'),
			peerConnection: new window.RTCPeerConnection({
				iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
			}),
		}),
		[]
	);

	const video = useRef();

	useEffect(() => {
		ws.peerConnection?.addEventListener(
			'connectionstatechange',
			(event) => {
				console.log(event);

				if (ws.peerConnection.connectionState === 'connected') {
					console.log('CONNECTED');
				}
			}
		);
		ws.socket.on('call-made', () => {
			console.log(3222);

		})
	}, []);

	return (
		<WebSocketContext.Provider value={ws}>
			{children}
		</WebSocketContext.Provider>
	);
};

export default WebSocketContextProvider;
