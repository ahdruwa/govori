interface CommonSocketMessageDTO {
	destination: string;
}

interface CommonServerMessageDTO {
	socket: string;
}

interface CallUserSocketMessageDTO extends CommonSocketMessageDTO {
	offer: RTCSessionDescriptionInit;
}

interface CallMadeServerMessageDTO extends CommonServerMessageDTO {
	offer: RTCSessionDescriptionInit;
}

interface AnswerMadeServerMessageDTO extends CommonServerMessageDTO {
	answer: RTCSessionDescriptionInit;
}

interface CreateRoomDTO {
	roomId: string;
}
interface UserListDTO {
	users: string[];
}
