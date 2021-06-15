import { Grid, Paper, Box } from '@material-ui/core';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';

import useLocalStream from '../../hooks/socket/useLocalStream';
import useUsers from '../../hooks/socket/useUsers';
import { WebSocketContext } from '../../websocket-context';
import Controls from './controls';
import RoomMember from './room-member';
import RoomMemberDecorator from './room-member/decorator';
import RoomVideoGrid from './room-video-grid';

const Room = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);

	const [users, getUsersList] = useUsers<any[]>();
	const { roomId } = useParams();

	const [needVideo, setNeedVideo] = useState(false);
	const [needAudio, setNeedAudio] = useState(true);
	const userOptions = useMemo(
		() => ({
			video: needVideo,
			audio: needAudio,
		}),
		[needVideo, needAudio]
	);
	const [error, localVideo] = useLocalStream(userOptions);
	console.log({
		users,
	});

	peerConnection.onicecandidate = (e) => {
		if (!e.candidate) return;

		console.log({
			candidate: e.candidate,
		});
		socket?.emit('ice-candidate', {
			roomId,
			iceCandidate: e.candidate,
		});
	};
	useEffect(() => {
		socket?.on('ice-candidate', async ({ iceCandidate }) => {
			if (!iceCandidate || users.length) return;

			try {
				await peerConnection.addIceCandidate(
					new RTCIceCandidate(iceCandidate)
				);
			} catch (e) {
				console.error('Error adding received ice candidate', e);
			}
		});
	}, []);
	// peerConnection.ontrack = () => console.log(101010);
	const nickname: string = localStorage.getItem('nickname') || 'nickname';

	return (
		<Box height={1}>
			<Grid container>
				<Grid item>
					<Paper>Номер этой комнаты: {roomId}</Paper>
				</Grid>
				<RoomVideoGrid>
					<RoomMember
						isLocal
						stream={localVideo}
						key={localVideo.id}
						nickname={nickname}
						connectionState={
							peerConnection?.connectionState || 'new'
						}
					/>
					{users.map((user: any) => {
						console.log(user.tracks, "UNDEFINED?");

						return (
							<RoomMemberDecorator
								nickname={user.nickname}
								connectionState={user.connectionState}
								tracks={user.tracks}
								key={user.id}
							/>
						);
					})}
				</RoomVideoGrid>
				<Grid item xs={12}>
					<Controls
						onClickVideoCall={() => {
							setNeedVideo(!needVideo);
						}}
						onClickMicrophone={() => {
							setNeedAudio(!needAudio);
						}}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Room;
