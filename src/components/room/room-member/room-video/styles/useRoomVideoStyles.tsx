import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useRoomVideoStyles = makeStyles((theme: Theme) =>
	createStyles({
		'room-video': {
			width: '320px',
			display: ({ isNeedVideo }) => (isNeedVideo ? 'block' : 'none'),
		},
	})
);

export default useRoomVideoStyles;
