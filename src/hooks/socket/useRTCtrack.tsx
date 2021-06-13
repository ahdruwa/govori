import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const useRTCtrack = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [streamsRTC, setStream] = useState<MediaStream[]>([]);

	useEffect(() => {
		const s = new MediaStream();
		peerConnection?.addEventListener('track', (e) => {
			s.addTrack(e.track);

			setStream([...e.streams]);
		});
	}, [peerConnection]);

	return streamsRTC;
};

export default useRTCtrack;
