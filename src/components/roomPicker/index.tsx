import { Grid, Button, Box, Input, Paper, Typography } from '@material-ui/core';
import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import useConnectRoom from '../../hooks/socket/useRoomConnect';

const RoomPicker = () => {
	const [roomId, setRoomId] = useState('');
	const connectRoom = useConnectRoom(roomId);
	const [connectRoomError, setConnectRoomError] = useState<string>('');

	const handleRoomConnect = useCallback(() => {
		const error = connectRoom();

		if (error) {
			return setConnectRoomError(error.message);
		}

		return setConnectRoomError('');
	}, [roomId]);

	return (
		<Grid
			style={{ height: '100%' }}
			direction="column"
			justify="center"
			alignItems="center"
			container
		>
			<Grid item>
				<Input
					onChange={(e) => {
						setRoomId(e.target.value);
					}}
					placeholder="Введите номер комнаты"
				/>
			</Grid>
			<Grid item>
				<Button onClick={handleRoomConnect}>Войти</Button>
			</Grid>
			{connectRoomError && (
				<Paper>
					<Typography color="primary">{connectRoomError}</Typography>
				</Paper>
			)}
		</Grid>
	);
};

export default RoomPicker;
