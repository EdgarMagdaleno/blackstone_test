import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './App';
import rootReducer from './reducers'

import './assets/button.css';
import './assets/home.css';
import './assets/note.css';
import './assets/sidebar.css';

const store = createStore(rootReducer);

ReactDOM.render(
  <React.StrictMode>
  	<Provider store={store}>
    	<App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);