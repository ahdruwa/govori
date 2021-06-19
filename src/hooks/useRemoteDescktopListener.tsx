import { DesktopCapturerSource } from 'electron/main';
import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../websocket-context';

const robotjs = require('robotjs');

const keysMap = ['left', 'middle', 'right'];

const useRemoteDescktopListener: (
	isRemoteDesktop: boolean
) => [Error | undefined, DesktopCapturerSource[]] = (isRemoteDesktop) => {
	const { peerConnection, socket } =
		useContext<WebSocketEntity>(WebSocketContext);
	const [sources, setSources] = useState<DesktopCapturerSource[]>([]);
	const [error, setError] = useState<Error>();

	useEffect(() => {
		if (!socket) {
			throw new Error('miss context!');
		}

		const removeListeners = () => {
			socket.off('click');
			socket.off('keytoggle');
		};

		if (!isRemoteDesktop) {
			return removeListeners();
		}

		socket.on('click', (data) => {
			const { x, y, button, kind } = data;

			robotjs.moveMouse(x, y);
			robotjs.mouseClick(keysMap[button]);
		});

		socket.on('keytoggle', (data) => {
			const { key, event } = data;

			robotjs.keyToggle(key, event);
		});

		return removeListeners;
	}, [isRemoteDesktop, socket]);

	return [error, sources];
};

export default useRemoteDescktopListener;
