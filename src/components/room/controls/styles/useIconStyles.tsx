import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useIconStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& > svg': {
				margin: theme.spacing(2),
			},
			position: 'absolute',
			bottom: '24px',
		},
	})
);

export default useIconStyles;
