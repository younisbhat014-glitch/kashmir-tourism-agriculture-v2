import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBookingAPI, loginAPI, registerAPI } from '../utils/api';

const AuthContext = createContext();

const USER_KEY = 'kashmir_user';
const TOKEN_KEY = 'kashmir_token';

const saveSession = ({ user, token }) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await loginAPI(email, password);

      if (!result.token || !result.user) {
        return { success: false, message: result.message || 'Invalid credentials' };
      }

      saveSession(result);
      setUser(result.user);
      return { success: true, role: result.user.role };
    } catch {
      return { success: false, message: 'Backend connection failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const result = await registerAPI(name, email, password);

      if (!result.token || !result.user) {
        return { success: false, message: result.message || 'Register failed' };
      }

      saveSession(result);
      setUser(result.user);
      return { success: true, role: result.user.role };
    } catch {
      return { success: false, message: 'Backend connection failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const addBooking = async (booking) => {
    if (!user) return { success: false, message: 'Please login first' };

    const payload = {
      ...booking,
      itemName: booking.itemName || booking.item,
    };

    try {
      const savedBooking = await createBookingAPI(payload);
      if (savedBooking.message && !savedBooking._id) {
        return { success: false, message: savedBooking.message };
      }

      const updated = {
        ...user,
        bookings: [...(user.bookings || []), savedBooking],
      };
      setUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      return { success: true, booking: savedBooking };
    } catch {
      return { success: false, message: 'Booking failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, loading, login, register, logout, addBooking }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
