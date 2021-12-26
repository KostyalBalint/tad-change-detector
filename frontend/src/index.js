import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


var rootEl =  document.getElementById('root')
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
    rootEl,
);

// Are we in development mode?
if (module.hot) {
    // Whenever a new version of App.js is available
    module.hot.accept('./App', function () {
        // Require the new version and render it instead
        var NextApp = require('./App')
        ReactDOM.render(<NextApp />, rootEl)
    })
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
