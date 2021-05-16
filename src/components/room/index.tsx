import { Grid, Paper, Box } from '@material-ui/core';
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

const Room = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);

	const users = useUsers();
	const { roomId } = useParams();
	const streams = useRTCtrack();

	console.log({
		users,
	});

	useEffect(() => {
		peerConnection.onicecandidate = (e) => {
			if (!e.candidate) return;

			socket?.on('new-user', () => {
				socket?.emit('ice-candidate', {
					roomId,
					iceCandidate: e.candidate,
				});
			});
		};
		socket?.on('ice-candidate', async ({ iceCandidate }) => {
			if (!iceCandidate) return;

			try {
				await peerConnection?.addIceCandidate(
					new RTCIceCandidate(iceCandidate)
				);
			} catch (e) {
				console.error('Error adding received ice candidate', e);
			}
		});
	}, [roomId, peerConnection, socket]);

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
