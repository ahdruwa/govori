import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const useRTCtrack = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [streamsRTC, setStream] = useState<readonly MediaStream[]>([
		new MediaStream(),
	]);

	useEffect(() => {
		peerConnection?.addEventListener('track', ({ streams }) => {
			console.log(streams, peerConnection);

			setStream(streams);
		});
	}, [peerConnection]);

	return streamsRTC;
};

export default useRTCtrack;
