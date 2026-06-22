import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getNotificationsAPI,
  markAllNotificationsReadAPI,
  markNotificationReadAPI,
  registerPushTokenAPI,
} from '../../utils/api';

const PENDING_PUSH_TOKEN_KEY = 'kashmir_pending_push_token';

const formatTime = (value) => {
  const date = new Date(value);
  const elapsed = Date.now() - date.getTime();
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export default function NotificationBell({ mobile = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const result = await getNotificationsAPI();
      if (Array.isArray(result.notifications)) {
        setNotifications(result.notifications);
        setUnreadCount(result.unreadCount || 0);
      }
    } catch {
      // Keep the navbar usable if the notification service is temporarily unavailable.
    }
  }, [user]);

  const registerNativeToken = useCallback(async (payload) => {
    if (!payload?.token) return;
    sessionStorage.setItem(PENDING_PUSH_TOKEN_KEY, JSON.stringify(payload));
    if (!user) return;

    try {
      const result = await registerPushTokenAPI(payload);
      if (!result.message?.match(/unable|invalid/i)) {
        sessionStorage.removeItem(PENDING_PUSH_TOKEN_KEY);
      }
    } catch {
      // Retry on the next login, reload, or native token event.
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return undefined;
    }

    loadNotifications();
    const interval = window.setInterval(loadNotifications, 30000);
    const onFocus = () => loadNotifications();
    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [loadNotifications, user]);

  useEffect(() => {
    const onNativePushToken = (event) => registerNativeToken(event.detail);
    window.addEventListener('kashmir-native-push-token', onNativePushToken);

    const pending = sessionStorage.getItem(PENDING_PUSH_TOKEN_KEY);
    if (pending) {
      try {
        registerNativeToken(JSON.parse(pending));
      } catch {
        sessionStorage.removeItem(PENDING_PUSH_TOKEN_KEY);
      }
    }

    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'notification-bridge-ready' }));
    return () => window.removeEventListener('kashmir-native-push-token', onNativePushToken);
  }, [registerNativeToken]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!panelRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  if (!user) return null;

  const openNotification = async (notification) => {
    if (!notification.isRead) {
      await markNotificationReadAPI(notification._id);
      setNotifications((current) => current.map((item) => (
        item._id === notification._id ? { ...item, isRead: true } : item
      )));
      setUnreadCount((count) => Math.max(0, count - 1));
    }
    setOpen(false);
    if (notification.link?.startsWith('/')) navigate(notification.link);
  };

  const markAllRead = async () => {
    await markAllNotificationsReadAPI();
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <div className={`notification-bell ${mobile ? 'notification-bell-mobile' : ''}`} ref={panelRef}>
      <button
        type="button"
        className="notification-bell-button"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        onClick={() => {
          setOpen((value) => !value);
          if (!open) {
            setLoading(true);
            loadNotifications().finally(() => setLoading(false));
          }
        }}
      >
        <Bell size={19} strokeWidth={2.2} />
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <div>
              <strong>Notifications</strong>
              <span>{unreadCount ? `${unreadCount} unread` : 'You are all caught up'}</span>
            </div>
            <div className="notification-panel-actions">
              {unreadCount > 0 && (
                <button type="button" onClick={markAllRead} title="Mark all as read">
                  <CheckCheck size={18} />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} title="Close">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {loading && notifications.length === 0 ? (
              <div className="notification-empty">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={28} />
                <strong>No notifications yet</strong>
                <span>Portal updates will appear here.</span>
              </div>
            ) : notifications.map((notification) => (
              <button
                type="button"
                key={notification._id}
                className={`notification-item ${notification.isRead ? '' : 'is-unread'}`}
                onClick={() => openNotification(notification)}
              >
                <span className="notification-item-dot" />
                <span className="notification-item-copy">
                  <strong>{notification.title}</strong>
                  <span>{notification.message}</span>
                  <small>{formatTime(notification.createdAt)}</small>
                </span>
                {notification.link && <ExternalLink size={15} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
