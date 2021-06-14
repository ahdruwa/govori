import { Grid, IconButton } from '@material-ui/core';
import { Camera, CameraAlt, VideoCall } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import React, { memo, useEffect, useRef } from 'react';

import useIconStyles from './styles/useIconStyles';

const Controls = ({ onClickVideoCall, onClickMicrophone }) => {
	const classes = useIconStyles();

	return (
		<Grid
			container
			direction="row"
			justify="center"
			alignItems="center"
			className={classes.root}
		>
			<IconButton onClick={onClickMicrophone}>
				<MicIcon />
			</IconButton>
			<IconButton onClick={onClickVideoCall}>
				<VideoCall />
			</IconButton>
		</Grid>
	);
};

export default memo(Controls);
