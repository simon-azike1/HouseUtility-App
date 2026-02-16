import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './i18n'; // Initialize i18n
import App from './App.jsx';
import './index.css';

// Configure axios base URL
axios.defaults.baseURL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
