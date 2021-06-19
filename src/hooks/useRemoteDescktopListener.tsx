import { DesktopCapturerSource } from 'electron/main';
import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../websocket-context';

const robotjs = require('robotjs');

const keysMap = {

}

const useRemoteDescktopListener: (
	userOptions?: MediaStreamConstraints
) => [Error | undefined, DesktopCapturerSource[]] = (userOptions) => {
	const { peerConnection, socket } =
		useContext<WebSocketEntity>(WebSocketContext);
	const [sources, setSources] = useState<DesktopCapturerSource[]>([]);
	const [error, setError] = useState<Error>();

	useEffect(() => {
		if (!socket) {
			throw new Error('miss context!');
		}

		socket.on('click', (data) => {
			const { x, y, button, kind } = data;

			robotjs.moveMouse(x, y);
			robotjs.mouseClick(button);
		});

		socket.on('keytoggle', (data) => {
			const { key, event } = data;

			robotjs.keyToggle(key, event);
		});

		return () => {
			socket.off('click');
			socket.off('keytoggle');
		};
	}, []);

	return [error, sources];
};

export default useRemoteDescktopListener;
