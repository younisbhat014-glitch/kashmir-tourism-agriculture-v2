import React, { useEffect, useState } from 'react';
import { APP_INSTALL_APK_URL } from '../../config/install';

const INSTALL_DISMISSED_KEY = 'kashmir_pwa_install_dismissed';

function isStandaloneMode() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.startsWith('android-app://')
  );
}

export default function PwaInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isNativeApp = navigator.userAgent.includes('KashmirPortalApp/');

    if (isNativeApp || isStandaloneMode() || sessionStorage.getItem(INSTALL_DISMISSED_KEY) === 'true') {
      return undefined;
    }

    setIsVisible(true);
    return undefined;
  }, []);

  const hideForSession = () => {
    sessionStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pwa-install-prompt" role="dialog" aria-modal="false" aria-labelledby="pwa-install-title">
      <button
        type="button"
        className="pwa-install-close"
        onClick={hideForSession}
        aria-label="Close install app popup"
      >
        x
      </button>

      <div className="pwa-install-icon" aria-hidden="true">K</div>

      <div className="pwa-install-copy">
        <h2 id="pwa-install-title">Install Kashmir App</h2>
        <p>Get faster access to tourism, agriculture, bookings, and dashboard updates from your device.</p>
      </div>

      <a className="pwa-install-button" href={APP_INSTALL_APK_URL} onClick={hideForSession} download>
        Install App
      </a>
    </div>
  );
}
