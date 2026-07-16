import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BellRing, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNotificationsAPI, markNotificationReadAPI } from '../../utils/api';

const DISMISSED_KEY = 'kashmir_web_notification_dismissed';

const getDismissedIds = () => {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveDismissedId = (id) => {
  const ids = Array.from(new Set([...getDismissedIds(), id])).slice(-40);
  sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
};

const formatTime = (value) => {
  const date = new Date(value);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export default function WebsiteNotificationPopup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);

  const isNativeApp = useMemo(
    () => navigator.userAgent.includes('KashmirPortalApp/'),
    []
  );

  const loadLatestNotification = useCallback(async () => {
    if (!user || isNativeApp) return;
    try {
      const result = await getNotificationsAPI();
      const dismissedIds = new Set(getDismissedIds());
      const latestUnread = (result.notifications || []).find((item) => (
        !item.isRead && !dismissedIds.has(item._id)
      ));
      if (latestUnread) {
        setNotification(latestUnread);
        setVisible(true);
      }
    } catch {
      // The bell still works if the popup check misses a network beat.
    }
  }, [isNativeApp, user]);

  useEffect(() => {
    setNotification(null);
    setVisible(false);
    if (!user || isNativeApp) return undefined;

    loadLatestNotification();
    const interval = window.setInterval(loadLatestNotification, 45000);
    const onFocus = () => loadLatestNotification();
    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [isNativeApp, loadLatestNotification, user]);

  if (!user || isNativeApp || !notification || !visible) return null;

  const closePopup = () => {
    saveDismissedId(notification._id);
    setVisible(false);
  };

  const openNotification = async () => {
    saveDismissedId(notification._id);
    setVisible(false);
    if (!notification.isRead) {
      markNotificationReadAPI(notification._id).catch(() => {});
    }
    if (notification.link?.startsWith('/')) navigate(notification.link);
  };

  return (
    <aside className="web-notification-popup" role="status" aria-live="polite">
      <div className="web-notification-icon">
        <BellRing size={20} />
      </div>
      <div className="web-notification-copy">
        <span>Portal notification</span>
        <strong>{notification.title}</strong>
        <p>{notification.message}</p>
        <small>{formatTime(notification.createdAt)}</small>
      </div>
      <div className="web-notification-actions">
        <button type="button" className="web-notification-open" onClick={openNotification}>
          {notification.link ? <ExternalLink size={15} /> : <BellRing size={15} />}
          Open
        </button>
        <button type="button" className="web-notification-close" onClick={closePopup} aria-label="Dismiss notification">
          <X size={17} />
        </button>
      </div>
    </aside>
  );
}
