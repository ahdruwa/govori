import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const useLocalStream: (
	userOptions: MediaStreamConstraints
) => [Error | undefined, MediaStream] = (userOptions) => {
	const { peerConnection } = useContext(WebSocketContext);
	const [stream, setStream] = useState<MediaStream>(new MediaStream());
	const [error, setError] = useState<Error>();

	useEffect(() => {
		if (!userOptions.video) {
			stream.getVideoTracks().forEach((track) => {
				track.stop();
			});

			setStream(new MediaStream());

			return;
		}

		navigator.mediaDevices
			.getUserMedia({
				video: userOptions.video,
				audio: true,
			})
			.then((mediaStream) => {
				setStream(mediaStream);

				mediaStream.getTracks().forEach((track) => {
					peerConnection?.addTrack(track, mediaStream);
				});

				return mediaStream;
			})
			.catch((e: Error) => {
				setError(e);
				console.error(e.message);
			});
	}, [userOptions]);

	return [error, stream];
};

export default useLocalStream;
