/* eslint-disable @typescript-eslint/no-unused-vars */
type CallUserFunction = (
	roomId: string,
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection
) => void;

type CallAcceptFunction = (
	data: CallMadeServerMessageDTO,
	socket: SocketIOClient.Socket,
	peerConnection: RTCPeerConnection
) => Promise<void>;

type CallDeclineFunction = (
	data: CallMadeServerMessageDTO,
	socket: SocketIOClient.Socket
) => void;

type OnCallMadeFunction = (data: CallMadeServerMessageDTO) => void;

type CallMadeListerFunction = (
	socket: SocketIOClient.Socket,
	onCallMade: OnCallMadeFunction
) => void;

type OnAnswerMadeFunction = (
	data: AnswerMadeServerMessageDTO,
	peerConnection: RTCPeerConnection
) => void;

type WebSocketEntity = {
	socket: SocketIOClient.Socket | undefined;
	peerConnection: RTCPeerConnection | undefined;
	dataChannel: RTCDataChannel | undefined;
};
