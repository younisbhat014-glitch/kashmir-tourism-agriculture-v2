export const API = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : 'https://kashmir-tourism-agriculture-v2-production.up.railway.app/api');

const getToken = () => localStorage.getItem('kashmir_token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Auth APIs
export const loginAPI = (email, password) =>
  fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(r => r.json());

export const registerAPI = (name, email, password) =>
  fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  }).then(r => r.json());

// Booking APIs
export const createBookingAPI = (data) =>
  fetch(`${API}/bookings`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  }).then(r => r.json());

export const getMyBookingsAPI = () =>
  fetch(`${API}/bookings/my`, {
    headers: headers()
  }).then(r => r.json());

// Crop listing APIs
export const getHotelsAPI = () =>
  fetch(`${API}/hotels`).then(r => r.json());

export const getRestaurantsAPI = () =>
  fetch(`${API}/restaurants`).then(r => r.json());

export const getVehiclesAPI = () =>
  fetch(`${API}/vehicles`).then(r => r.json());

export const getCropsAPI = () =>
  fetch(`${API}/crops`).then(r => r.json());

export const createCropAPI = (data) =>
  fetch(`${API}/crops`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  }).then(r => r.json());

export const getMachinesAPI = () =>
  fetch(`${API}/machines`).then(r => r.json());

// Admin APIs
export const getAdminStatsAPI = () =>
  fetch(`${API}/admin/stats`, {
    headers: headers()
  }).then(r => r.json());

export const getAllUsersAPI = () =>
  fetch(`${API}/admin/users`, {
    headers: headers()
  }).then(r => r.json());

export const getAllBookingsAPI = () =>
  fetch(`${API}/admin/bookings`, {
    headers: headers()
  }).then(r => r.json());

// Notification APIs
export const getNotificationsAPI = () =>
  fetch(`${API}/notifications`, {
    headers: headers()
  }).then(r => r.json());

export const markNotificationReadAPI = (id) =>
  fetch(`${API}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: headers()
  }).then(r => r.json());

export const markAllNotificationsReadAPI = () =>
  fetch(`${API}/notifications/read-all`, {
    method: 'PATCH',
    headers: headers()
  }).then(r => r.json());

export const registerPushTokenAPI = (data) =>
  fetch(`${API}/notifications/push-token`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  }).then(r => r.json());

export const getAdminNotificationHistoryAPI = () =>
  fetch(`${API}/notifications/admin/history`, {
    headers: headers()
  }).then(r => r.json());

export const sendAdminNotificationAPI = (data) =>
  fetch(`${API}/notifications/admin/send`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  }).then(r => r.json());

export const deleteAdminNotificationAPI = (id) =>
  fetch(`${API}/notifications/admin/${id}`, {
    method: 'DELETE',
    headers: headers()
  }).then(r => r.json());
