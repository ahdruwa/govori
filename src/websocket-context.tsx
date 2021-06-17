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
			socket: io('ws://192.168.0.100:3000/signalization'),
			peerConnection,
			dataChannel: peerConnection.createDataChannel('ConnectionState'),
		}),
		[]
	);

	useEffect(() => {
		// setInterval(async () => {
		// 	const stats = await ws.peerConnection.getStats();

		// 	stats.forEach((stat) => console.log(stat));
		// }, 10000);

		peerConnection.onnegotiationneeded = async () => {
			const offer = await peerConnection.createOffer();
			peerConnection.setLocalDescription(offer);

			ws.socket.emit('negotiation', {
				offer,
			});
		};

		ws.socket.on('negotiation', ({ answer }) => {
			console.log(answer);
			peerConnection.setRemoteDescription(answer);
		});

		peerConnection.onicecandidate = (e) => {
			if (!e.candidate) return;

			console.log({
				candidate: e.candidate,
			});
			ws.socket?.emit('ice-candidate', {
				iceCandidate: e.candidate,
			});
		};

		ws.socket?.on('ice-candidate', async ({ iceCandidate }) => {
			if (!iceCandidate) return;

			try {
				await peerConnection.addIceCandidate(
					new RTCIceCandidate(iceCandidate)
				);
			} catch (e) {
				console.error('Error adding received ice candidate', e);
			}
		});

		ws.socket.on('negotiation-need', async ({ offer }) => {
			await peerConnection.setRemoteDescription(offer);

			const answer = await peerConnection.createAnswer();

			peerConnection.setLocalDescription(answer);

			ws.socket.emit('negotiation-accept', {
				answer,
			});
		});

		ws.peerConnection?.addEventListener(
			'connectionstatechange',
			(event) => {
				console.log(event);

				if (ws.peerConnection.connectionState === 'connected') {
					console.log('CONNECTED');
					// ws.dataChannel.send('connected');
				}

				if (
					ws.peerConnection.connectionState === 'disconnected' ||
					ws.peerConnection.connectionState === 'failed'
				) {
					console.log('Disconnected');
					ws.socket.emit('disconnect');
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
