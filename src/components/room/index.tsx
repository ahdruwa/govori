import { Grid, Paper, Box } from '@material-ui/core';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import useCallMadeListener from '../../hooks/socket/useCallMade';
import useCallUser from '../../hooks/socket/useCallUser';

import useLocalStream from '../../hooks/socket/useLocalStream';
import useRoomCreate from '../../hooks/socket/useRoomCreate';
import useUsers from '../../hooks/socket/useUsers';
import Controls from './controls';
import RoomVideo from './room-video';
import RoomVideoGrid from './room-video-grid';

const Room = () => {
	const users = useUsers();
	const { roomId } = useParams();

	const [needVideo, setNeedVideo] = useState(false);
	const userOptions = useMemo(
		() => ({
			video: needVideo,
		}),
		[needVideo]
	);

	const [error, localVideo] = useLocalStream(userOptions);

	return (
		<Box height={1}>
			<Grid container>
				<Grid item>
					<Paper>Номер этой комнаты: {roomId}</Paper>
				</Grid>
				<RoomVideoGrid>
					<RoomVideo stream={localVideo} />
				</RoomVideoGrid>
				<Grid item xs={12}>
					<Controls
						onClickVideoCall={() => {
							setNeedVideo(!needVideo);
						}}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Room;
