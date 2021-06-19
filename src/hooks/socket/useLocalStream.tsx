import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const { desktopCapturer } = require('electron');

const useLocalStream: (
	userOptions: MediaStreamConstraints
) => [Error | undefined, MediaStream] = (userOptions) => {
	const { peerConnection, socket } = useContext(WebSocketContext);
	const [stream, setStream] = useState<MediaStream>(new MediaStream());
	const [error, setError] = useState<Error>();

	useEffect(() => {
		console.log(userOptions);

		if (!userOptions.video) {
			stream.getVideoTracks().forEach((track) => {
				track.stop();
				socket?.emit('remove-track', {
					track: track.id,
				});
			});
		}

		if (!userOptions.audio) {
			stream.getAudioTracks().forEach((track) => {
				track.stop();
				socket?.emit('remove-track', {
					track: track.id,
				});
			});
		}

		navigator.mediaDevices
			.getUserMedia({
				video: userOptions.video,
				audio: userOptions.audio,
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
	}, [userOptions, peerConnection, socket]);

	return [error, stream];
};

export default useLocalStream;
