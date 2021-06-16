import { Grid, Paper, Box, Popover, Dialog } from '@material-ui/core';
import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useParams } from 'react-router';

import useLocalStream from '../../hooks/socket/useLocalStream';
import useRTCStream from '../../hooks/socket/useRTCStream';
import useScreenCapture from '../../hooks/socket/useScreenCapture';
import useUsers from '../../hooks/socket/useUsers';
import { WebSocketContext } from '../../websocket-context';
import Controls from './controls';
import SelectScreenDialog from './dialogs/select-sreen-dialog';
import RoomMember from './room-member';
import RoomMemberDecorator from './room-member/decorator';
import RoomVideo from './room-member/room-video';
import RoomVideoGrid from './room-video-grid';
import VideoPopup from './video-popup';

const Room = () => {
	const { socket, peerConnection } = useContext(WebSocketContext);

	const [users, getUsersList] = useUsers<any[]>();
	const { roomId } = useParams();

	const [needVideo, setNeedVideo] = useState(false);
	const [needAudio, setNeedAudio] = useState(true);
	const [isOpenDialog, setIsOpenDialog] = useState(false);
	const [screenParams, setScreenParams] = useState('');
	const [screenShareTrack, setScreenShareTrack] = useState('');
	const [isOpenVideoPopup, setisOpenVideoPopup] = useState(false);

	const userOptions = useMemo(
		() => ({
			video: needVideo,
			audio: needAudio,
		}),
		[needVideo, needAudio]
	);
	const [error, localVideo] = useLocalStream(userOptions);

	const onSaveScreenParams = useCallback((screenId) => {
		setScreenParams(screenId);
	}, []);

	const handleScreenShare = useCallback((screenTrack) => {
		setisOpenVideoPopup(true);
		setScreenShareTrack(screenTrack);
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
						console.log(user.tracks, 'UNDEFINED?');

						return (
							<RoomMemberDecorator
								nickname={user.nickname}
								connectionState={user.connectionState}
								tracks={user.tracks}
								key={user.id}
								onClickScreenShare={handleScreenShare}
								screenCaprureTrack={user.screenCapture}
							/>
						);
					})}
					<VideoPopup
						open={isOpenVideoPopup}
						track={screenShareTrack}
					/>
				</RoomVideoGrid>
				<Grid item xs={12}>
					<Controls
						onClickVideoCall={() => {
							setNeedVideo(!needVideo);
						}}
						onClickMicrophone={() => {
							setNeedAudio(!needAudio);
						}}
						onClickScreenShare={() => {
							setIsOpenDialog(true);
						}}
					/>
				</Grid>
			</Grid>
			<SelectScreenDialog
				handleClose={() => {
					setIsOpenDialog(false);
				}}
				handleSave={onSaveScreenParams}
				open={isOpenDialog}
			/>
		</Box>
	);
};

export default Room;
