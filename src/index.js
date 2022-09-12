import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import store from './App/store';
import App from './components/App';
import './main.css';

const ReduxApp = () => {
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
};

ReactDom.render(<ReduxApp />, document.getElementById('root'));
