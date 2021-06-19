import { Grid, IconButton } from '@material-ui/core';
import { Cancel, LiveTv, Mouse, ScreenShare, VideoCall } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import React, { memo, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';

import useIconStyles from './styles/useIconStyles';

const Controls = ({
	onClickVideoCall,
	onClickMicrophone,
	onClickScreenShare,
	isStream,
	onClickRemoteDesktop,
}) => {
	const classes = useIconStyles();
	const history = useHistory();

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
			{!!isStream && (
				<IconButton onClick={onClickRemoteDesktop}>
					<Mouse />
				</IconButton>
			)}
			<IconButton onClick={() => history.push('/')}>
				<Cancel color="error" />
			</IconButton>
		</Grid>
	);
};

export default memo(Controls);
