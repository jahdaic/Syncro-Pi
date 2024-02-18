import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import reportWebVitals from './scripts/reportWebVitals';
import store from './store';
import Router from './Router';

import './css/style.css';
import './css/themes.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistStore(store)}>
				<BrowserRouter basename={process.env.REACT_APP_SUBDIRECTORY}>
					<Router />
				</BrowserRouter>
			</PersistGate>
		</Provider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
