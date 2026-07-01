import React, { useEffect, useState } from 'react';

const INSTALL_STATE_KEY = 'kashmir_pwa_installed';
const INSTALL_DISMISSED_KEY = 'kashmir_pwa_install_dismissed';

function isStandaloneMode() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.startsWith('android-app://')
  );
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isStandaloneMode() || localStorage.getItem(INSTALL_STATE_KEY) === 'true') {
      return undefined;
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      if (sessionStorage.getItem(INSTALL_DISMISSED_KEY) === 'true') {
        setDeferredPrompt(event);
        return;
      }

      setDeferredPrompt(event);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      localStorage.setItem(INSTALL_STATE_KEY, 'true');
      sessionStorage.removeItem(INSTALL_DISMISSED_KEY);
      setDeferredPrompt(null);
      setIsVisible(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    setIsVisible(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setIsVisible(false);
      return;
    }

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      localStorage.setItem(INSTALL_STATE_KEY, 'true');
      sessionStorage.removeItem(INSTALL_DISMISSED_KEY);
    } else {
      sessionStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <div className="pwa-install-prompt" role="dialog" aria-modal="false" aria-labelledby="pwa-install-title">
      <button
        type="button"
        className="pwa-install-close"
        onClick={handleClose}
        aria-label="Close install app popup"
      >
        x
      </button>

      <div className="pwa-install-icon" aria-hidden="true">K</div>

      <div className="pwa-install-copy">
        <h2 id="pwa-install-title">Install Kashmir App</h2>
        <p>Get faster access to tourism, agriculture, bookings, and dashboard updates from your device.</p>
      </div>

      <button type="button" className="pwa-install-button" onClick={handleInstall}>
        Install App
      </button>
    </div>
  );
}
