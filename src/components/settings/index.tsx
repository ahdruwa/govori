import React, { ChangeEvent, ChangeEventHandler, useState } from 'react';
import { Button, Grid, Input } from '@material-ui/core';
import { useHistory } from 'react-router';

const Settings = () => {
	const initialName = localStorage.getItem('nickname') || '';
	const [name, setName] = useState<string>(initialName);
	const history = useHistory();

	const handleChangeName: ChangeEventHandler = (
		e: ChangeEvent<HTMLInputElement>
	) => {
		const evenTarget: HTMLInputElement = e.target;
		const { value } = evenTarget;

		setName(value);
	};

	const handleSaveName = () => {
		localStorage.setItem('nickname', name);
	};

	return (
		<Grid>
			<Grid item>Введите никнейм:</Grid>
			<Grid item>
				<Input onChange={handleChangeName} value={name} />
			</Grid>
			<Grid item>
				<Button onClick={handleSaveName}>Сохранить</Button>
			</Grid>
			<Grid item>
				<Button onClick={() => history.push('/')}>Назад</Button>
			</Grid>
		</Grid>
	);
};

export default Settings;
