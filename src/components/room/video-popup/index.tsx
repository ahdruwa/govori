import { Dialog } from '@material-ui/core';
import { HourglassEmpty } from '@material-ui/icons';
import React, { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import useRTCStream from '../../../hooks/socket/useRTCStream';
import useRemoteDescktopTranslator from '../../../hooks/useRemoteDescktopTranslator';

type PropTypes = {
	streamId: string;
	open: boolean;
};

const VideoPopup = ({ streamId, open, userId }: PropTypes) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	const [stream] = useRTCStream([], streamId, true);
	const { emitClick, emitKeyToggle } = useRemoteDescktopTranslator();

	useEffect(() => {
		const keyDownListener = (e: KeyboardEvent) => {
			const { key } = e;

			emitKeyToggle({
				key,
				userId,
				event: 'down',
			});
		};
		const keyUpListener = (e: KeyboardEvent) => {
			const { key } = e;

			emitKeyToggle({
				key,
				userId,
				event: 'up',
			});
		};

		if (open) {
			setTimeout(() => {
				videoRef.current.srcObject = stream;
			}, 100);

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
	}, [open, stream]);

	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLVideoElement>) => {
			const { target, button } = e;

			console.log(e);

			emitClick({});
		},
		[userId]
	);

	return (
		<Dialog maxWidth={false} open={open}>
			<video
				autoPlay
				onClick={handleClick}
				ref={videoRef}
				style={{ width: '100%', height: '100%' }}
			/>
		</Dialog>
	);
};

export default VideoPopup;
