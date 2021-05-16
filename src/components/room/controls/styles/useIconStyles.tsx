import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useIconStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& > svg': {
				margin: theme.spacing(2),
			},
		},
	})
);

export default useIconStyles;
