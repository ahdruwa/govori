import { Dialog } from '@material-ui/core';
import { HourglassEmpty } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import useRTCStream from '../../../hooks/socket/useRTCStream';

type PropTypes = {
	track: string;
	open: boolean;
};

const VideoPopup = ({ track, open }: PropTypes) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [stream] = useRTCStream([track]);

	console.log(track, stream);


	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<Dialog maxWidth={false} open={open}>
			{track ? (
				<video
					autoPlay
					ref={videoRef}
					style={{ width: '100%', height: '100%' }}
				/>
			) : (
				<HourglassEmpty fontSize="large" />
			)}
		</Dialog>
	);
};

export default VideoPopup;
