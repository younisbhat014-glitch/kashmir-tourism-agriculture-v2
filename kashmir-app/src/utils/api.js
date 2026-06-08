const API = import.meta.env.VITE_API_URL || 'https://kashmir-tourism-agriculture-v2-production.up.railway.app/api';

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
