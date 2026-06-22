import React, { useEffect, useMemo, useState } from 'react';
import { BellRing, Send, Trash2, Users } from 'lucide-react';
import { useToast } from '../ui/Toast';
import {
  deleteAdminNotificationAPI,
  getAdminNotificationHistoryAPI,
  sendAdminNotificationAPI,
} from '../../utils/api';

const emptyForm = {
  title: '',
  message: '',
  audience: 'all',
  targetUserId: '',
  link: '',
};

export default function AdminNotifications({ users }) {
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [history, setHistory] = useState([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectableUsers = useMemo(
    () => users.filter((user) => user.role !== 'admin'),
    [users],
  );

  const loadHistory = async () => {
    setLoading(true);
    try {
      const result = await getAdminNotificationHistoryAPI();
      setHistory(Array.isArray(result) ? result : []);
    } catch {
      toast('Notification history load nahi hui', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const sendNotification = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      toast('Title aur message likho', 'error');
      return;
    }
    if (form.audience === 'specific' && !form.targetUserId) {
      toast('Ek user select karo', 'error');
      return;
    }

    setSending(true);
    try {
      const result = await sendAdminNotificationAPI(form);
      if (!result.notification) {
        toast(result.message || 'Notification send nahi hui', 'error');
        return;
      }

      const pushText = result.push?.accepted
        ? ` ${result.push.accepted} phone push delivered.`
        : ' Bell notification sent.';
      toast(`Notification sent.${pushText}`, 'success');
      setForm(emptyForm);
      await loadHistory();
    } catch {
      toast('Notification send nahi hui', 'error');
    } finally {
      setSending(false);
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Is notification ko delete karna hai?')) return;
    const result = await deleteAdminNotificationAPI(id);
    if (result.message?.match(/deleted/i)) {
      setHistory((current) => current.filter((item) => item._id !== id));
      toast('Notification deleted', 'success');
    } else {
      toast(result.message || 'Delete nahi hui', 'error');
    }
  };

  return (
    <div className="admin-notifications">
      <div className="admin-notification-composer glass-card">
        <div className="admin-notification-heading">
          <div className="admin-notification-icon"><BellRing size={24} /></div>
          <div>
            <span>Portal communication</span>
            <h2>Send Notification</h2>
            <p>Users ke notification bell aur installed app par update bhejo.</p>
          </div>
        </div>

        <form onSubmit={sendNotification} className="admin-notification-form">
          <div className="form-group">
            <label className="form-label" htmlFor="notification-title">Title</label>
            <input
              id="notification-title"
              className="form-input"
              value={form.title}
              maxLength={100}
              onChange={(event) => update('title', event.target.value)}
              placeholder="Example: Gulmarg weather update"
            />
            <small>{form.title.length}/100</small>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notification-audience">Send to</label>
            <select
              id="notification-audience"
              className="form-input"
              value={form.audience}
              onChange={(event) => update('audience', event.target.value)}
            >
              <option value="all">All registered users</option>
              <option value="specific">Specific user</option>
            </select>
          </div>

          {form.audience === 'specific' && (
            <div className="form-group admin-notification-user">
              <label className="form-label" htmlFor="notification-user">Select user</label>
              <select
                id="notification-user"
                className="form-input"
                value={form.targetUserId}
                onChange={(event) => update('targetUserId', event.target.value)}
              >
                <option value="">Choose user</option>
                {selectableUsers.map((user) => (
                  <option key={user._id} value={user._id}>{user.name} - {user.email}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group admin-notification-message">
            <label className="form-label" htmlFor="notification-message">Message</label>
            <textarea
              id="notification-message"
              className="form-input"
              value={form.message}
              maxLength={500}
              rows={5}
              onChange={(event) => update('message', event.target.value)}
              placeholder="Notification ka clear aur useful message likho..."
            />
            <small>{form.message.length}/500</small>
          </div>

          <div className="form-group admin-notification-link">
            <label className="form-label" htmlFor="notification-link">Open page (optional)</label>
            <select
              id="notification-link"
              className="form-input"
              value={form.link}
              onChange={(event) => update('link', event.target.value)}
            >
              <option value="">No page</option>
              <option value="/">Home</option>
              <option value="/tourism">Tourism</option>
              <option value="/agriculture">Agriculture</option>
              <option value="/dashboard">User Dashboard</option>
              <option value="/about">About</option>
            </select>
          </div>

          <button type="submit" className="btn-teal admin-notification-send" disabled={sending}>
            <Send size={18} />
            {sending ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
      </div>

      <div className="admin-notification-history">
        <div className="admin-notification-history-heading">
          <div>
            <span>Delivery history</span>
            <h2>Sent Notifications</h2>
          </div>
          <div className="admin-notification-total"><Users size={17} /> {history.length} sent</div>
        </div>

        {loading ? (
          <div className="notification-admin-empty">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="notification-admin-empty">Abhi koi notification send nahi hui.</div>
        ) : (
          <div className="admin-notification-history-list">
            {history.map((notification) => (
              <article key={notification._id} className="admin-notification-history-card">
                <div>
                  <div className="admin-notification-card-meta">
                    <span>{notification.audience === 'all' ? 'All users' : notification.targetUser?.name || 'Specific user'}</span>
                    <time>{new Date(notification.createdAt).toLocaleString('en-IN')}</time>
                  </div>
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  {notification.link && <small>Opens: {notification.link}</small>}
                </div>
                <button type="button" onClick={() => deleteNotification(notification._id)} title="Delete notification">
                  <Trash2 size={17} />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
