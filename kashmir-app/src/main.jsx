import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

const PWA_INSTALL_READY_EVENT = 'kashmir:pwa-install-ready';

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  window.__kashmirPwaInstallPrompt = event;
  window.dispatchEvent(new Event(PWA_INSTALL_READY_EVENT));
});

if ('serviceWorker' in navigator && (window.isSecureContext || window.location.hostname === 'localhost')) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
