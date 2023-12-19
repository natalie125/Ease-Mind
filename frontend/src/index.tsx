import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { publicUrl } from './utils/urls';
import App from './App';

(document.getElementById('head') as HTMLElement).prepend(
  `<base href="${publicUrl}/" />`,
);

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
