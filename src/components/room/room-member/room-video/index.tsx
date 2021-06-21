import { Container } from '@material-ui/core';
import React, { memo, useEffect, useRef } from 'react';
import useRoomVideoStyles from './styles/useRoomVideoStyles';

type Props = {
	stream?: MediaStream;
	muted?: boolean;
	isNeedVideo?: boolean;
};

const RoomVideo = ({ stream, muted, isNeedVideo }: Props) => {
	const classes = useRoomVideoStyles({
		isNeedVideo,
	});
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}

		// return () => {
		// 	stream?.getTracks().forEach((track) => {
		// 		track.stop();
		// 	});
		// };
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
	isNeedVideo: false,
};

export default memo(RoomVideo);
