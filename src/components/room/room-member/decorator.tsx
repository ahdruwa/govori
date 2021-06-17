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
};

const RoomMemberDecorator = ({
	connectionState,
	nickname,
	tracks,
	onClickScreenShare,
	screenCaptureStream,
}: PropTypes) => {
	const stream = useRTCStream(tracks, screenCaptureStream);
	const [screenShareTrack, setScreenShareTrack] = useState<string>('');

	useEffect(() => {
		console.log(stream.getTracks(), tracks);

		stream.getTracks().forEach((track) => {
			if (track.screenCapture) {
				stream.removeTrack(track);
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
			/>
		</>
	);
};

export default RoomMemberDecorator;
