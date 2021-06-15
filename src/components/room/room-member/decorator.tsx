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
};

const RoomMemberDecorator = ({
	connectionState,
	nickname,
	tracks,
}: PropTypes) => {
	const stream = useRTCStream(tracks);

	return (
		<>
			<RoomMember
				connectionState={connectionState}
				nickname={nickname}
				stream={stream}
			/>
		</>
	);
};

export default RoomMemberDecorator;
