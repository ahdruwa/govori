import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const useScreenCapture: (screenId: string) => [Error | undefined, MediaStream] =
	(screenId) => {
		const { peerConnection, socket } = useContext(WebSocketContext);
		const [stream, setStream] = useState<MediaStream>(new MediaStream());
		const [error, setError] = useState<Error>();

		useEffect(() => {
			if (! screenId) {
				return;
			}

			navigator.mediaDevices
				.getUserMedia({
					audio: false,
					video: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: screenId,
							maxWidth: 1920,
							maxHeight: 1080,
						},
					},
				})
				.then((mediaStream) => {
					setStream(mediaStream);

					mediaStream.getTracks().forEach((track) => {
						socket?.emit('screen-cast', {
							track: track.id,
						})
						peerConnection?.addTrack(track, mediaStream);
					});

					return mediaStream;
				})
				.catch((e: Error) => {
					setError(e);
					console.error(e.message);
				});
		}, [screenId, peerConnection]);

		return [error, stream];
	};

export default useScreenCapture;
