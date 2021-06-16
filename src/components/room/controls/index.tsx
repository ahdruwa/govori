import { Grid, IconButton } from '@material-ui/core';
import { Camera, CameraAlt, ScreenShare, VideoCall } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import React, { memo, useEffect, useRef } from 'react';

import useIconStyles from './styles/useIconStyles';

const Controls = ({ onClickVideoCall, onClickMicrophone, onClickScreenShare }) => {
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
			<IconButton onClick={onClickScreenShare}>
				<ScreenShare />
			</IconButton>
		</Grid>
	);
};

export default memo(Controls);
