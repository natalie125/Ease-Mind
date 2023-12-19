import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const publicUrl = process.env.NODE_ENV === 'development'
  ? process.env.PUBLIC_URL_DEV
  : process.env.PUBLIC_URL_PROD;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <BrowserRouter basename={publicUrl}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>,
);
