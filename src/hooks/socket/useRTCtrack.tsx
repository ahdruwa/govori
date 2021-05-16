import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const useRTCtrack = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);
	const [stream, setStream] = useState(new MediaStream());

	useEffect(() => {
		peerConnection?.addEventListener(
			'track',
			({ streams: [RTCStream] }) => {
				console.log(1);
				setStream(RTCStream);
			}
		);
	}, [peerConnection]);

	return stream;
};

export default useRTCtrack;
