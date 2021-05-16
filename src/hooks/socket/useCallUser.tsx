import { WSAEACCES } from 'constants';
import { useContext, useEffect } from 'react';
import { WebSocketContext } from '../../websocket-context';

const callUser: CallUserFunction = (roomId, socket, peerConnection) => {
	const offerCreate = peerConnection.createOffer();
	offerCreate
		.then((offer) => {
			peerConnection.setLocalDescription(
				new RTCSessionDescription(offer)
			);

			const payload = {
				destination: roomId,
				offer,
			};

			if (socket) {
				socket.emit('call-user', payload);
				peerConnection.onicecandidate = (e) => {
					console.log(peerConnection, e);

					socket.emit('ice-candidate', {
						destination: roomId,
						iceCandidate: e.candidate,
					});
				};
			}

			return offer;
		})
		.catch((err) => {
			console.error(err);
		});
};

const useCallUser = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);

	if (socket && peerConnection) {
		return (roomId: string) => callUser(roomId, socket, peerConnection);
	}

	throw new Error('Miss context');
};

export default useCallUser;
