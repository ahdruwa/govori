import { useContext } from 'react';
import { WebSocketContext } from '../websocket-context';

const useRemoteDescktopTranslator = () => {
	const { socket } = useContext<WebSocketEntity>(WebSocketContext);

	const emitClick = (clickData) => {
		socket?.emit('click', clickData);
	};

	const emitKeyToggle = (keyToggleData) => {
		socket?.emit('keyToggle', keyToggleData);
	};

	return {
		emitClick,
		emitKeyToggle,
	};
};

export default useRemoteDescktopTranslator;
