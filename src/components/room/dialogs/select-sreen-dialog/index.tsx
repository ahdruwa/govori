import React, { useCallback, useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	FormControl,
	InputLabel,
	Select,
	DialogActions,
	Button,
	Input,
} from '@material-ui/core';
import useStyles from './styles/useSelectScreenDialogStyles';
import useDesctopCapturer from '../../../../hooks/socket/useDesctopCapturer';

type PropTypes = {
	handleClose: () => void;
	handleSave: (displayId: string) => void;
	open: boolean;
};

const SelectScreenDialog = ({ handleClose, handleSave, open }: PropTypes) => {
	const classes = useStyles();
	const [display, setDisplay] = useState<string>('');

	const [error, sources] = useDesctopCapturer();
	const handleChange = useCallback(
		(event: React.ChangeEvent<{ value: unknown }>) => {
			setDisplay(String(event.target.value) || '');
		},
		[setDisplay]
	);

	const onSave = useCallback(() => {
		handleSave(display);
	}, [display, handleSave]);

	return (
		<Dialog
			disableBackdropClick
			disableEscapeKeyDown
			open={open}
			onClose={handleClose}
		>
			<DialogTitle>Выберите окно</DialogTitle>
			<DialogContent>
				<form className={classes.container}>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="input-dialog-screencapture">
							Устройство вывода
						</InputLabel>
						<Select
							value={display}
							native
							onChange={handleChange}
							input={<Input id="input-dialog-screencapture" />}
						>
							<option aria-label="Пусто" value="" />
							{sources.map((source) => {
								return (
									<option value={source.id} key={source.id}>
										{source.name}
									</option>
								);
							})}
						</Select>
					</FormControl>
				</form>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Отмена
				</Button>
				<Button onClick={onSave} color="primary">
					ОК
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SelectScreenDialog;
