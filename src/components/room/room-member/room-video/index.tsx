import { Container } from '@material-ui/core';
import React, { memo, useEffect, useRef } from 'react';
import useRoomVideoStyles from './styles/useRoomVideoStyles';

type Props = {
	stream?: MediaStream;
	muted?: boolean;
};

const RoomVideo = ({ stream, muted }: Props) => {
	const classes = useRoomVideoStyles();
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<video
			className={classes['room-video']}
			ref={videoRef}
			autoPlay
			muted={muted}
		/>
	);
};

RoomVideo.defaultProps = {
	stream: new MediaStream(),
	muted: false,
};

export default memo(RoomVideo);
