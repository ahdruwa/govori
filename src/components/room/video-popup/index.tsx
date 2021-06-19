import { Dialog } from '@material-ui/core';
import { HourglassEmpty } from '@material-ui/icons';
import React, {
	SyntheticEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import useRTCStream from '../../../hooks/socket/useRTCStream';
import useRemoteDescktopTranslator from '../../../hooks/useRemoteDescktopTranslator';

type PropTypes = {
	streamId: string;
	open: boolean;
	userId: string;
};

const VideoPopup = ({ streamId, open, userId }: PropTypes) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [screenParams, setScreenParams] =
		useState<{ height: number; width: number }>();

	const [stream] = useRTCStream([], streamId, true);
	const { emitClick, emitKeyToggle } = useRemoteDescktopTranslator();

	useEffect(() => {
		const keyDownListener = (e: KeyboardEvent) => {
			const { key } = e;

			emitKeyToggle({
				key: key.toLocaleLowerCase().replace('arrow', ''),
				userId,
				event: 'down',
			});
		};
		const keyUpListener = (e: KeyboardEvent) => {
			const { key } = e;

			emitKeyToggle({
				key: key.toLocaleLowerCase().replace('arrow', ''),
				userId,
				event: 'up',
			});
		};

		if (open) {
			setTimeout(() => {
				videoRef.current.srcObject = stream;
			}, 100);

			const [video] = stream.getTracks();
			const { height, width } = video.getSettings();
			setScreenParams({
				height,
				width,
			});

			window.addEventListener('keydown', keyDownListener);
			window.addEventListener('keyup', keyUpListener);
		}

		if (!open) {
			window.removeEventListener('keydown', keyDownListener);
			window.removeEventListener('keyup', keyUpListener);
		}

		return () => {
			window.removeEventListener('keydown', keyDownListener);
			window.removeEventListener('keyup', keyUpListener);
		};
	}, [open]);

	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLVideoElement>) => {
			console.log(e, 77777777);
			const { target, button, nativeEvent } = e;

			const { height, width } = screenParams;
			const { layerX, layerY } = nativeEvent;
			const { clientHeight, clientWidth } = target;

			const heightCoef = height / clientHeight;
			const widthCoef = width / clientWidth;

			console.log({
				x: layerX * widthCoef,
				y: layerY * heightCoef,
				button,
				userId,
			});

			emitClick({
				x: layerX * widthCoef,
				y: layerY * heightCoef,
				button,
				userId,
			});
		},
		[userId, screenParams, emitClick]
	);

	return (
		<Dialog maxWidth={false} open={open}>
			<video
				autoPlay
				onClick={handleClick}
				ref={videoRef}
				onContextMenu={(e) => {
					e.preventDefault();
					handleClick(e);

					return false;
				}}
				style={{ width: '100%', height: '100%' }}
			/>
		</Dialog>
	);
};

export default VideoPopup;
