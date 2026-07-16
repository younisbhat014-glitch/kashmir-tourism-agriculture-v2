import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Chatbot from './components/chatbot/Chatbot';
import WebsiteNotificationPopup from './components/notifications/WebsiteNotificationPopup';
import ScrollReveal from './components/ui/ScrollReveal';
import SwipeIndicators from './components/ui/SwipeIndicators';
import PwaInstallPrompt from './components/ui/PwaInstallPrompt';
import Home from './pages/Home';
import Tourism from './pages/Tourism';
import Agriculture from './pages/Agriculture';
import About from './pages/About';
import { Login, Register } from './pages/Auth';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SpotDetail from './pages/SpotDetail';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Chatbot />
      <WebsiteNotificationPopup />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ScrollReveal />
          <SwipeIndicators />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/dashboard" element={<Layout><UserDashboard /></Layout>} />
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/tourism" element={<Layout><Tourism /></Layout>} />
            <Route path="/agriculture" element={<Layout><Agriculture /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/spot/:id" element={<Layout><SpotDetail /></Layout>} />
          </Routes>
          <PwaInstallPrompt />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
