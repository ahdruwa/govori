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

	answerMadeListener(
		onConnect: React.Dispatch<React.SetStateAction<boolean>>
	) {
		this.socket.on('answer-made', (data: AnswerMadeServerMessageDTO) => {
			this.onAnswerMade(data);
			onConnect(true);
		});
	}
}
