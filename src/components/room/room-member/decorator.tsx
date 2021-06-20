import { Grid, Paper, Box, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import RoomMember from '.';
import useRTCStream from '../../../hooks/socket/useRTCStream';

type PropTypes = {
	connectionState:
		| 'connected'
		| 'disconnected'
		| 'failed'
		| 'new'
		| 'closed'
		| 'connecting';
	nickname: string;
	tracks: string[];
	onClickScreenShare: (trackId: any) => void;
	screenCaptureStream: string;
	userId: string;
};

const RoomMemberDecorator = ({
	connectionState,
	nickname,
	tracks,
	onClickScreenShare,
	screenCaptureStream,
	userId,
}: PropTypes) => {
	const [stream, screenTrackId] = useRTCStream(tracks, screenCaptureStream);
	const [screenShareTrack, setScreenShareTrack] = useState<string>('');

	useEffect(() => {
		console.log(stream.getTracks(), tracks);

		stream.getTracks().forEach((track) => {
			if (stream.id === screenCaptureStream) {
				setScreenShareTrack(track.id);
			}
		});
		console.log(screenShareTrack);
	}, [stream, screenCaptureStream]);

	return (
		<>
			<RoomMember
				connectionState={connectionState}
				nickname={nickname}
				stream={stream}
				screenShareTrack={screenShareTrack}
				onClickScreenShare={onClickScreenShare}
				screenCaptureStream={screenCaptureStream}
				userId={userId}
			/>
		</>
	);
};

export default RoomMemberDecorator;
