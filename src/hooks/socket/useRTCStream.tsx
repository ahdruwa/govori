import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const useRTCStream = (tracks: string[], screenCapture?: string) => {
	const { peerConnection } = useContext(WebSocketContext);
	const [rtcStream, setRtcStream] = useState<MediaStream>(new MediaStream());

	console.log(tracks);

	useEffect(() => {
		peerConnection?.addEventListener('track', ({ streams, track }) => {
			const [stream] = streams;
			console.log(tracks, 111111);
			if (!tracks.includes(track.id)) {
				tracks.push(track.id);
			}

			const mediaStream = new MediaStream();

			tracks.forEach((trackId: string) => {
				console.log(trackId, 222222);
				const userTrack = stream.getTrackById(trackId);
				console.log(userTrack, 100100);


				if (userTrack) {
					console.log(userTrack);

					console.log(stream.id, screenCapture);

					if (!screenCapture && stream.id === screenCapture) {
						track.screenCapture = true;

						return;
					}

					mediaStream.addTrack(userTrack);
				}
			});

			console.log(mediaStream, 44444444);

			setRtcStream(mediaStream);
		});
	}, [tracks, peerConnection]);

	return rtcStream;
};

export default useRTCStream;
