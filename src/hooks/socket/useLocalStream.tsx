import { useContext, useEffect, useRef, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const { desktopCapturer } = require('electron');

const useLocalStream: (
	userOptions: MediaStreamConstraints
) => [Error | undefined, MediaStream] = (userOptions) => {
	const { peerConnection, socket } = useContext(WebSocketContext);
	const stream = useRef(new MediaStream());
	const [error, setError] = useState<Error>();

	useEffect(() => {
		stream.current.getTracks().forEach((track) => {
			stream.current.removeTrack(track);
			peerConnection?.getSenders().forEach((sender) => {
				peerConnection.removeTrack(sender);
			});
			track.stop();
		});

		// if (!userOptions.video) {
		// 	stream.current.getVideoTracks().forEach((track) => {
		// 		stream.current.removeTrack(track);
		// 		track.stop();
		// 	});
		// }

		// if (!userOptions.audio) {
		// 	stream.current.getAudioTracks().forEach((track) => {
		// 		stream.current.removeTrack(track);
		// 		track.stop();
		// 	});
		// }

		navigator.mediaDevices
			.getUserMedia({
				video: userOptions.video,
				audio: userOptions.audio,
			})
			.then((mediaStream) => {
				mediaStream.getTracks().forEach((track) => {
					stream.current.addTrack(track);
					peerConnection?.addTrack(track, stream.current);
				});

				return mediaStream;
			})
			.catch((e: Error) => {
				setError(e);
				console.error(e.message);
			});
	}, [userOptions, peerConnection, socket]);

	return [error, stream.current];
};

export default useLocalStream;
