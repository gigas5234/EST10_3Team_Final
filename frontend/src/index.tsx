import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// React DOM 렌더링 진입점
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 