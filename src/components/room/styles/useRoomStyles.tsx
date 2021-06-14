import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useRoomStyles = makeStyles((theme: Theme) =>
	createStyles({
		'room-memberCard': {
			width: '320px',
			height: '240px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
	})
);

export default useRoomStyles;
