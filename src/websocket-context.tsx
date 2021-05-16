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
		navigator.getUserMedia(
			{ video: true, audio: true },
			(stream) => {
				// const localVideo = document.getElementById('local-video');
				// if (localVideo) {
				// video.current.srcObject = stream;
				// }

				// video.current.srcObject = stream;

				stream.getTracks().forEach((track) => {
					ws.peerConnection.addTrack(track, stream);
				});
			},
			(error) => {
				console.warn(error.message);
			}
		);
		ws.peerConnection?.addEventListener(
			'connectionstatechange',
			(event) => {
				console.log(event);

				if (ws.peerConnection.connectionState === 'connected') {
					console.log('CONNECTED');
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
