import { Button, Grid } from '@material-ui/core';
import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	HashRouter as Router,
	Switch,
	Route,
	Link,
	NavLink,
} from 'react-router-dom';
import robot from 'robotjs';

import Room from './components/room';
import RoomPicker from './components/roomPicker';
import useAnswerlMadeListener from './hooks/socket/useAnswerMade';
import useCallMadeListener from './hooks/socket/useCallMade';
import useCallUser from './hooks/socket/useCallUser';
import useLocalStream from './hooks/socket/useLocalStream';
import useRoomCreate from './hooks/socket/useRoomCreate';
import useRTCtrack from './hooks/socket/useRTCtrack';
import useUserList from './hooks/socket/useUserList';
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

	// useEffect(() => {
	// 	video.current.srcObject = stream;
	// }, [stream]);
	const handleRoomCreate = useRoomCreate();

	return (
		<Grid>
			<Button onClick={handleRoomCreate}>Создать комнату</Button>
			<NavLink to="/connection">
				<Button>Подключится к комнате</Button>
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
			</Switch>
		</Router>
	);
}
