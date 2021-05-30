import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const useRTCtrack = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [streamsRTC, setStream] = useState<readonly MediaStream[]>([
		new MediaStream(),
	]);

	console.log(999);

	useEffect(() => {
		peerConnection?.addEventListener('track', (e) => {
			const s = new MediaStream();

			console.log(s, peerConnection);
			s.addTrack(e.track);

			setStream([s]);
		});
	}, [peerConnection]);

	return streamsRTC;
};

export default useRTCtrack;
