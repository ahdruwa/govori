import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const useRTCStream = (tracks: string[], screenCapture?: string, kostil = false) => {
	const { peerConnection } = useContext(WebSocketContext);
	const [rtcStream, setRtcStream] = useState<MediaStream>(new MediaStream());
	const [screenTrackId, setScreenTrackId] = useState<string>('');

	console.log(tracks, kostil, 777777777777);

	useEffect(() => {
		peerConnection?.addEventListener('track', ({ streams, track }) => {
			const [stream] = streams;
			console.log(tracks, 111111);
			if (!tracks.includes(track.id)) {
				tracks.push(track.id);
			}

			if (kostil) {
				console.log(stream, screenCapture, 'KOSTILLLLLLLLLLLLLLLLLLLLL');

				if (stream.id === screenCapture) {
					setScreenTrackId(track.id);
					setRtcStream(stream);

					return;
				}

				setRtcStream(rtcStream);

				return;
			}

			if (stream.id !== screenCapture) {
				setRtcStream(stream);

				return;
			}

			setRtcStream(rtcStream);
		});
	}, [tracks, peerConnection, screenCapture, kostil]);

	console.log(rtcStream);

	return [rtcStream, screenTrackId];
};

export default useRTCStream;
