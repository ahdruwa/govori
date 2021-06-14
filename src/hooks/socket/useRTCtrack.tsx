import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const useRTCtrack = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [streamsRTC, setStream] = useState<MediaStream>(new MediaStream());

	useEffect(() => {
		const s = new MediaStream();
		peerConnection?.addEventListener('track', (e) => {
			setStream(e.streams[0]);
		});
	}, [peerConnection]);

	return streamsRTC;
};

export default useRTCtrack;
