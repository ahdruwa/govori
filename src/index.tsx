import React from 'react';
import { render } from 'react-dom';
import App from './App';
import WebSocketContextProvider from './websocket-context';

render(
	<WebSocketContextProvider>
		<App />
	</WebSocketContextProvider>,
	document.getElementById('root')
);
