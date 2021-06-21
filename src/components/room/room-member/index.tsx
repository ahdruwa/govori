import { Grid, Paper, Box, Typography, IconButton } from '@material-ui/core';
import { Person, ScreenShareTwoTone } from '@material-ui/icons';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import useCallMadeListener from '../../hooks/socket/useCallMade';
import useCallUser from '../../hooks/socket/useCallUser';

import useLocalStream from '../../hooks/socket/useLocalStream';
import useRoomCreate from '../../hooks/socket/useRoomCreate';
import useRTCtrack from '../../hooks/socket/useRTCtrack';
import useUsers from '../../hooks/socket/useUsers';
import { WebSocketContext } from '../../websocket-context';
import Controls from './controls';
import RoomVideo from './room-video';
import RoomVideoGrid from './room-video-grid';
import useRoomMemberStyles from './styles/useRoomMemberStyles';

type PropTypes = {
	stream?: MediaStream;
	isLocal?: boolean;
	connectionState:
		| 'connected'
		| 'disconnected'
		| 'failed'
		| 'new'
		| 'closed'
		| 'connecting';
	nickname: string;
	screenShareTrack?: string;
	onClickScreenShare: (
		screenTrack: string,
		captureStream: string,
		userId: string
	) => void;
	screenCaptureStream: string;
	userId: string;
	isNeedVideo: boolean;
};

type ConnectionState =
	| 'room-nicknameContainer__connected'
	| 'room-nicknameContainer__failed'
	| 'room-nicknameContainer__new'
	| 'room-nicknameContainer__disconnected';

const RoomMember = ({
	stream,
	isLocal,
	connectionState,
	nickname,
	screenShareTrack,
	onClickScreenShare,
	screenCaptureStream,
	userId,
	isNeedVideo,
}: PropTypes) => {
	console.log(nickname);
	const classes = useRoomMemberStyles();

	const connectionStateClass: ConnectionState = `room-nicknameContainer__${connectionState}`;

	console.log(nickname);

	return (
		<Box>
			<Box
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
				}}
			>
				<Paper className={classes['room-memberCard']}>
					<RoomVideo
						muted={isLocal}
						stream={stream}
						key={stream?.id}
						isNeedVideo={isNeedVideo}
					/>
					{!isNeedVideo && (
						<Person fontSize="large" color="primary" />
					)}
					{!!screenShareTrack && (
						<IconButton
							style={{
								position: 'absolute',
								left: '15px',
								bottom: '15px',
							}}
							onClick={() =>
								onClickScreenShare(
									screenShareTrack,
									screenCaptureStream,
									userId
								)
							}
						>
							<ScreenShareTwoTone />
						</IconButton>
					)}
				</Paper>
			</Box>
			<Paper className={classes[connectionStateClass]} color="secondary">
				<Typography>{nickname}</Typography>
			</Paper>
		</Box>
	);
};

RoomMember.defaultProps = {
	stream: new MediaStream(),
	isLocal: false,
	screenShareTrack: '',
};

export default RoomMember;
