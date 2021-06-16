import { DesktopCapturerSource } from 'electron/main';
import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../../websocket-context';

const { desktopCapturer } = require('electron');

const useDesctopCapturer: (
	userOptions?: MediaStreamConstraints
) => [Error | undefined, DesktopCapturerSource[]] = (userOptions) => {
	const [sources, setSources] = useState<DesktopCapturerSource[]>([]);
	const [error, setError] = useState<Error>();

	useEffect(() => {
		desktopCapturer
			.getSources({ types: ['window', 'screen'] })
			.then((sourcesList: DesktopCapturerSource[]) => {
				setSources(sourcesList);
				return sourcesList;
			})
			.catch((e: Error) => setError(e));
	}, [userOptions]);

	return [error, sources];
};

export default useDesctopCapturer;
