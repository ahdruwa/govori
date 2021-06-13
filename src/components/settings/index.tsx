import React, { useState } from 'react';
import { Button, Grid, Input } from '@material-ui/core';

const Settings = () => {
	const initialName = localStorage.getItem('nickname') || '';
	const [name, setName] = useState<string>(initialName);

	const handleChangeName = (e: InputEvent) => {
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
		</Grid>
	);
};

export default Settings;
