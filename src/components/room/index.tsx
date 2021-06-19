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
import useScreenCapture from '../../hooks/socket/useScreenCapture';
import useUsers from '../../hooks/socket/useUsers';
import useConnectionState from '../../hooks/useConnectionState';
import useRemoteDescktopListener from '../../hooks/useRemoteDescktopListener';
import { WebSocketContext } from '../../websocket-context';
import Controls from './controls';
import SelectScreenDialog from './dialogs/select-sreen-dialog';
import RoomMember from './room-member';
import RoomMemberDecorator from './room-member/decorator';
import RoomVideoGrid from './room-video-grid';
import VideoPopup from './video-popup';

const Room = () => {
	const [users, getUsersList] = useUsers<any[]>();
	const { roomId } = useParams<{ roomId: string }>();
	const { peerConnection } = useContext(WebSocketContext);

	const [needVideo, setNeedVideo] = useState(false);
	const [needAudio, setNeedAudio] = useState(true);
	const [isOpenDialog, setIsOpenDialog] = useState(false);
	const [screenParams, setScreenParams] = useState('');
	const [screenShareTrack, setScreenShareTrack] = useState('');
	const [screenStream, setScreenStream] = useState('');
	const [screenCaster, setScreenCaster] = useState('');
	const [isOpenVideoPopup, setisOpenVideoPopup] = useState(false);
	const [screenCaptureError, screenCaptureStream] =
		useScreenCapture(screenParams);
	const [isRemoteDesktop, setRemoteDesktop] = useState(false);
	const connectionState = useConnectionState();

	const userOptions = useMemo(
		() => ({
			video: needVideo,
			audio: needAudio,
		}),
		[needVideo, needAudio]
	);
	const [error, localVideo] = useLocalStream(userOptions);
	console.log(localVideo);

	useRemoteDescktopListener(
		isRemoteDesktop && screenParams.includes('screen')
	);

	const onSaveScreenParams = useCallback((screenId) => {
		setScreenParams(screenId);
	}, []);

	const handleScreenShare = useCallback(
		(screenTrack, screenStreamId, userId) => {
			setisOpenVideoPopup(true);
			setScreenShareTrack(screenTrack);
			setScreenStream(screenStreamId);
			setScreenCaster(userId);
		},
		[]
	);

	useEffect(() => {
		return () => {
			peerConnection?.close();
			localVideo.getTracks().forEach((track) => {
				track.stop();
			});
			screenCaptureStream.getTracks().forEach((track) => {
				track.stop();
			});
		};
	}, [localVideo]);

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
						connectionState={connectionState || 'new'}
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
								userId={user.id}
							/>
						);
					})}
					<VideoPopup
						open={isOpenVideoPopup}
						streamId={screenStream}
						userId={screenCaster}
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
						isStream={screenCaptureStream.getTracks().length}
						onClickRemoteDesktop={() => {
							setRemoteDesktop(!isRemoteDesktop);
						}}
					/>
				</Grid>
			</Grid>
			<SelectScreenDialog
				handleClose={() => {
					setIsOpenDialog(false);
				}}
				handleSave={(display) => {
					onSaveScreenParams(display);
					setIsOpenDialog(false);
				}}
				open={isOpenDialog}
			/>
		</Box>
	);
};

export default Room;
