import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const AppBarPlaceholder = () => <div style={{height: 64}}></div>;

ReactDOM.render(
  <React.StrictMode>
    <AppBarPlaceholder />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);