import { WSAEACCES } from 'constants';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const onAnswerMade: OnAnswerMadeFunction = async (data, peerConnection) => {
	await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
	console.log(peerConnection, 2);
};

const answerMadeListener = (
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection,
	onConnect: React.Dispatch<React.SetStateAction<boolean>>
) => {
	socket.on('answer-made', async (data: AnswerMadeServerMessageDTO) => {
		onAnswerMade(data, peerConnection);
		onConnect(true);
	});
};

const useAnswerlMadeListener = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [answerMade, setAnswerMade] = useState(false);

	useEffect(() => {
		if (!(socket && peerConnection)) {
			throw new Error('miss context');
		}

		answerMadeListener(socket, peerConnection, setAnswerMade);
	}, [socket, peerConnection]);

	return answerMade;
};

export default useAnswerlMadeListener;
