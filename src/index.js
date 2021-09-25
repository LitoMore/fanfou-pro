import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {init} from '@rematch/core';
import * as models from './models.js';
import 'modern-normalize/modern-normalize.css';

import App from './app.js';
import * as serviceWorker from './service-worker.js';

const store = init({models});

ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.querySelector('#root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
