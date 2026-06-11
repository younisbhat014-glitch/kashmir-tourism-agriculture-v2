import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/app-theme';

export const TOKEN_KEY = 'kashmir_mobile_token';
export const USER_KEY = 'kashmir_mobile_user';

type RequestOptions = RequestInit & { authenticated?: boolean };

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (options.authenticated) {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed. Please try again.');
  }

  return data as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    apiRequest<AuthResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
};

export const catalogApi = {
  hotels: () => apiRequest<CatalogItem[]>('/hotels'),
  restaurants: () => apiRequest<CatalogItem[]>('/restaurants'),
  vehicles: () => apiRequest<CatalogItem[]>('/vehicles'),
  crops: () => apiRequest<CatalogItem[]>('/crops'),
  machines: () => apiRequest<CatalogItem[]>('/machines'),
};

export const bookingApi = {
  mine: () => apiRequest<Booking[]>('/bookings/my', { authenticated: true }),
  cancel: (id: string) =>
    apiRequest<{ message: string }>(`/bookings/${id}`, {
      method: 'DELETE',
      authenticated: true,
    }),
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
};

export type AuthResult = { token: string; user: User };

export type CatalogItem = {
  _id: string;
  name: string;
  image?: string;
  location?: string;
  price?: number | string;
  pricePerDay?: number;
  rentPerDay?: number;
  rating?: number;
  category?: string;
  type?: string;
};

export type Booking = {
  _id: string;
  itemName?: string;
  type?: string;
  status?: string;
};
