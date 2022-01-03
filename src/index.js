import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {init} from '@rematch/core';
import * as models from './models/index.js';
import 'modern-normalize/modern-normalize.css';
import App from './app.js';

const store = init({models});

ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.querySelector('#root'),
);
