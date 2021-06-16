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
};

const RoomMemberDecorator = ({
	connectionState,
	nickname,
	tracks,
	onClickScreenShare,
}: PropTypes) => {
	const stream = useRTCStream(tracks);
	const [screenShareTrack, setScreenShareTrack] = useState<string>('');

	useEffect(() => {
		stream.getTracks().forEach((track) => {
			if (track.label === 'Screen') {
				setScreenShareTrack(track.id);
			}
		});
		// console.log(screenShareTrack);
	}, [stream]);

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
