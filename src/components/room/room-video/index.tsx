import { Container } from '@material-ui/core';
import React, { memo, useEffect, useRef } from 'react';

type Props = {
	stream?: MediaStream;
};

const RoomVideo = ({ stream }: Props) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<video
			style={{ width: '100%', height: '480px', objectFit: 'cover' }}
			ref={videoRef}
			autoPlay
		/>
	);
};

RoomVideo.defaultProps = {
	stream: new MediaStream(),
};

export default memo(RoomVideo);
