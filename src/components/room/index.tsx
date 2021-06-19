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
import useRemoteDescktopListener from '../../hooks/useRemoteDescktopListener';
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
	const { roomId } = useParams<{ roomId: string }>();
	useRemoteDescktopListener();

	const [needVideo, setNeedVideo] = useState(false);
	const [needAudio, setNeedAudio] = useState(true);
	const [isOpenDialog, setIsOpenDialog] = useState(false);
	const [screenParams, setScreenParams] = useState('');
	const [screenShareTrack, setScreenShareTrack] = useState('');
	const [screenStream, setScreenStream] = useState('');
	const [isOpenVideoPopup, setisOpenVideoPopup] = useState(false);

	const userOptions = useMemo(
		() => ({
			video: needVideo,
			audio: needAudio,
		}),
		[needVideo, needAudio]
	);
	const [error, localVideo] = useLocalStream(userOptions);
	const [screenCaptureError] = useScreenCapture(screenParams);

	const onSaveScreenParams = useCallback((screenId) => {
		setScreenParams(screenId);
	}, []);

	const handleScreenShare = useCallback((screenTrack, screenStreamId) => {
		setisOpenVideoPopup(true);
		setScreenShareTrack(screenTrack);
		setScreenStream(screenStreamId);
		console.log(screenTrack, screenStreamId, 2222228888888888);
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
						if (user.screenCast && !screenStream) {
							setScreenStream(user.screenCast);
						}

						return (
							<RoomMemberDecorator
								nickname={user.nickname}
								connectionState={user.connectionState}
								tracks={user.tracks}
								key={user.id}
								onClickScreenShare={handleScreenShare}
								screenCaptureStream={user.screenCast}
							/>
						);
					})}
					<VideoPopup
						open={isOpenVideoPopup}
						streamId={screenStream}
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
