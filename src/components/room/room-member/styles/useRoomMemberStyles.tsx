import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useRoomMemberStyles = makeStyles((theme: Theme) =>
	createStyles({
		'room-memberCard': {
			width: '320px',
			height: '240px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		'room-nicknameContainer__connected': {
			width: '320px',
			textAlign: 'center',
			color: theme.palette.success.dark,
		},
		'room-nicknameContainer__failed': {
			width: '320px',
			textAlign: 'center',
			color: theme.palette.error.dark,
		},
		'room-nicknameContainer__new': {
			width: '320px',
			textAlign: 'center',
			color: theme.palette.info.main,
		},
		'room-nicknameContainer__disconnected': {
			width: '320px',
			textAlign: 'center',
		},
	})
);

export default useRoomMemberStyles;
