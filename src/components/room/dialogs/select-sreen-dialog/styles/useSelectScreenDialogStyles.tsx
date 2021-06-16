import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			display: 'flex',
			flexWrap: 'wrap',
		},
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120,
		},
	})
);

export default useStyles;
