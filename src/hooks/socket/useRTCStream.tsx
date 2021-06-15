import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const useRTCStream = (tracks: string[]) => {
	const { peerConnection } = useContext(WebSocketContext);
	const [rtcStream, setRtcStream] = useState<MediaStream>(new MediaStream());

	console.log(tracks);

	useEffect(() => {
		peerConnection?.addEventListener('track', ({ streams, track }) => {
			const [stream] = streams;
			console.log(tracks);
			if (!tracks.includes(track.id)) {
				tracks.push(track.id);
			}

			const mediaStream = new MediaStream();

			tracks.forEach((trackId: string) => {
				const userTrack = stream.getTrackById(trackId);

				if (userTrack) {
					mediaStream.addTrack(userTrack);
				}
			});

			setRtcStream(mediaStream);
		});
	}, [tracks, peerConnection]);

	return rtcStream;
};

export default useRTCStream;
