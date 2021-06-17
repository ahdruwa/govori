import { Button, Grid, Paper, Typography } from '@material-ui/core';
import { BrowserWindow } from 'electron/main';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { HashRouter as Router, Switch, Route, NavLink } from 'react-router-dom';

import Room from './components/room';
import RoomPicker from './components/roomPicker';
import Settings from './components/settings';
import useRoomCreate from './hooks/socket/useRoomCreate';
import { WebSocketContext } from './websocket-context';

const usePizdec = () => {
	const { socket } = useContext(WebSocketContext);

	return socket;
};

const Hello = () => {
	const [errorMessage, setErrorMessage] = useState<string>('');
	const roomCreate = useRoomCreate();

	const handleRoomCreate = () => {
		const error = roomCreate();

		if (error) return setErrorMessage(error.message);

		return setErrorMessage('');
	};

	return (
		<Grid>
			<Button onClick={handleRoomCreate}>Создать комнату</Button>
			<NavLink to="/connection">
				<Button>Подключится к комнате</Button>
			</NavLink>
			<NavLink to="/settings">
				<Button>Настройки</Button>
			</NavLink>
			{errorMessage && (
				<Paper>
					<Typography color="primary">{errorMessage}</Typography>
				</Paper>
			)}
		</Grid>
	);
};

export default function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={Hello} />
				<Route path="/room/:roomId" component={Room} />
				<Route path="/connection" component={RoomPicker} />
				<Route path="/settings" component={Settings} />
			</Switch>
		</Router>
	);
}
