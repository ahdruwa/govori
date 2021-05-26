export default class SocketService {
	constructor(
		private socket: SocketIOClient.Socket,
		private peerConnection: RTCPeerConnection
	) {}

	private onAnswerMade(data: AnswerMadeServerMessageDTO) {
		this.peerConnection.setRemoteDescription(
			new RTCSessionDescription(data.answer)
		);
	}

	createRoom(): void {
		this.socket.emit('create-room');
	}

	answerMadeListener(
		onConnect: React.Dispatch<React.SetStateAction<boolean>>
	) {
		this.socket.on('answer-made', (data: AnswerMadeServerMessageDTO) => {
			this.onAnswerMade(data);
			onConnect(true);
		});
	}
}
