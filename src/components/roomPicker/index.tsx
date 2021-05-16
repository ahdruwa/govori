import { Grid, Button, Box, Input } from '@material-ui/core';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import useConnectRoom from '../../hooks/socket/useRoomConnect';

const RoomPicker = () => {
	const [roomId, setRoomId] = useState('');
	const connectRoom = useConnectRoom(roomId);

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
				<Button onClick={connectRoom}>Войти</Button>
			</Grid>
		</Grid>
	);
};

export default RoomPicker;
