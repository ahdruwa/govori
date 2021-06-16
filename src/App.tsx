import { Button, Grid } from '@material-ui/core';
import { BrowserWindow } from 'electron/main';
import React, { useContext, useEffect, useMemo } from 'react';
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
	const opts = useMemo(
		() => ({
			video: true,
			audio: true,
		}),
		[]
	);
	// const [e, localStream] = useLocalStream(opts);
	// const userList = useUserList();
	// const video = useRef();
	// const { socket, peerConnection } = useContext(WebSocketContext);
	// const answerMade = useAnswerlMadeListener();

	// const callUser = useCallUser();
	// const [callMade, callHandlers] = useCallMadeListener();

	// const { callAccept } = callHandlers;

	// const stream = useRTCtrack();
	const handleRoomCreate = useRoomCreate();

	return (
		<Grid>
			<Button onClick={handleRoomCreate}>Создать комнату</Button>
			<NavLink to="/connection">
				<Button>Подключится к комнате</Button>
			</NavLink>
			<NavLink to="/settings">
				<Button>Настройки</Button>
			</NavLink>
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
