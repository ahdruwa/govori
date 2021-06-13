import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const useRTCtrack = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [streamsRTC, setStream] = useState<readonly MediaStream[]>([
		new MediaStream(),
	]);

	useEffect(() => {
		const s = new MediaStream();
		peerConnection?.addEventListener('track', (e) => {
			s.addTrack(e.track);

			setStream([s]);
			console.log(s);
		});
	}, [peerConnection]);

	return streamsRTC;
};

export default useRTCtrack;
