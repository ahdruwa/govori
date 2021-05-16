import { useCallback, useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const callAccept: CallAcceptFunction = async (data, socket, peerConnection) => {
	await peerConnection.setRemoteDescription(
		new RTCSessionDescription(data.offer)
	);
	console.log('call-accept-rd', peerConnection);

	const answer = await peerConnection.createAnswer();
	await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

	console.log(peerConnection, 'peer-connection-ld');

	if (socket) {
		socket.emit('make-answer', {
			answer,
			destination: data.socket,
		});
	}
};

const callDecline: CallDeclineFunction = (data, socket) => {
	socket.emit('reject-call', {
		from: data.socket,
	});
};

const callMadeListener: CallMadeListerFunction = (socket, onCallMade) => {
	socket.on('call-made', onCallMade);
};

const useCallMadeListener: () => [
	boolean,
	{ callAccept: () => void; callDecline: () => void }
] = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [isCall, setCall] = useState(false);
	const [data, setData] = useState<CallMadeServerMessageDTO>();

	const callDeclineFunction = useCallback(() => {
		if (!(data && socket)) {
			throw new Error('Cant`t decline');
		}

		callDecline(data, socket);
	}, [data, socket]);

	const callAcceptFunction = useCallback(() => {
		if (!(data && socket && peerConnection)) {
			throw new Error('Cant`t accept');
		}

		callAccept(data, socket, peerConnection);
	}, [data, socket, peerConnection]);

	useEffect(() => {
		if (socket && peerConnection) {
			callMadeListener(socket, (callData: CallMadeServerMessageDTO) => {
				console.log(999);

				setCall(true);
				setData(callData);
			});

			return () => socket.off('call-made');
		}

		return () => {};
	}, [socket, peerConnection]);

	const callHandlers = {
		callAccept: callAcceptFunction,
		callDecline: callDeclineFunction,
	};

	return [isCall, callHandlers];
};

export default useCallMadeListener;
