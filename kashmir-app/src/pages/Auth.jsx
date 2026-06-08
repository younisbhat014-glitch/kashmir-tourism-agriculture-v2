import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

function AuthLayout({ children, title, subtitle }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, var(--kashmir-deep) 0%, #1a4a30 40%, var(--kashmir-teal) 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: 'rgba(201,168,76,0.08)', borderRadius: '50%' }}/>
      <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }}/>
      <div style={{
        background: 'white', borderRadius: 28, padding: '48px 40px',
        width: '100%', maxWidth: 460,
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
        position: 'relative', zIndex: 1,
        animation: 'slideInCard 0.5s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: '2rem' }}>🏔</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', fontWeight: 700, color: 'var(--kashmir-deep)' }}>Kashmir Portal</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--kashmir-teal)', letterSpacing: 2, textTransform: 'uppercase' }}>Paradise on Earth</div>
            </div>
          </Link>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: 'var(--kashmir-deep)', marginBottom: 6 }}>{title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // const handleSubmit = () => {
  //   if (!email || !password) { toast('Please fill in all fields', 'error'); return; }
  //   setLoading(true);
  //   setTimeout(() => {
  //     const result = login(email, password);
  //     setLoading(false);
  //     if (result.success) {
  //       toast(`Welcome back! 🌸`, 'success');
  //       navigate(result.role === 'admin' ? '/admin' : '/dashboard');
  //     } else {
  //       toast(result.message || 'Login failed', 'error');
  //     }
  //   }, 800);
  // };

const handleSubmit = async () => {
  if (!email || !password) { toast('Please fill in all fields', 'error'); return; }
  setLoading(true);
  const result = await login(email, password);
  setLoading(false);
  if (result.success) {
    toast(`Welcome back! 🌸`, 'success');
    navigate(result.role === 'admin' ? '/admin' : '/dashboard');
  } else {
    toast(result.message || 'Login failed!', 'error');
  }
};


  const demoLogin = (role) => {
    const creds = role === 'admin' ? { e: 'admin@kashmir.com', p: 'admin123' } : { e: 'user@kashmir.com', p: 'user123' };
    setEmail(creds.e); setPassword(creds.p);
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your Kashmir Portal account">
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button onClick={() => demoLogin('user')} style={{ flex: 1, padding: '9px', background: 'rgba(26,122,110,0.08)', border: '1px solid rgba(26,122,110,0.2)', borderRadius: 10, fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.78rem', color: 'var(--kashmir-teal)', cursor: 'pointer' }}>Demo User</button>
        <button onClick={() => demoLogin('admin')} style={{ flex: 1, padding: '9px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 10, fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.78rem', color: '#A07820', cursor: 'pointer' }}>Demo Admin</button>
      </div>

      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input className="form-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()}/>
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()}/>
      </div>

      <button className="btn-teal" style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }} onClick={handleSubmit}>
        {loading ? <><div className="loader" style={{ border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}/> Signing in...</> : 'Sign In →'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--kashmir-teal)', fontWeight: 700, textDecoration: 'none' }}>Create one free →</Link>
      </p>
    </AuthLayout>
  );
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // const handleSubmit = () => {
  //   if (!form.name || !form.email || !form.password) { toast('Please fill all fields', 'error'); return; }
  //   if (form.password !== form.confirm) { toast('Passwords do not match!', 'error'); return; }
  //   if (form.password.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
  //   setLoading(true);
  //   setTimeout(() => {
  //     const result = register(form.name, form.email, form.password);
  //     setLoading(false);
  //     if (result.success) {
  //       toast(`Welcome to Kashmir Portal, ${form.name}! 🌸`, 'success');
  //       navigate('/dashboard');
  //     } else {
  //       toast(result.message, 'error');
  //     }
  //   }, 900);
  // };

const handleSubmit = async () => {
  if (!form.name || !form.email || !form.password) { toast('Please fill all fields', 'error'); return; }
  if (form.password !== form.confirm) { toast('Passwords do not match!', 'error'); return; }
  if (form.password.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
  setLoading(true);
  const result = await register(form.name, form.email, form.password);
  setLoading(false);
  if (result.success) {
    toast(`Welcome to Kashmir Portal, ${form.name}! 🌸`, 'success');
    navigate('/dashboard');
  } else {
    toast(result.message || 'Register failed!', 'error');
  }
};



  return (
    <AuthLayout title="Create Account" subtitle="Join thousands of tourists and farmers on Kashmir Portal">
      {[
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
        { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
        { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
        { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
      ].map(f => (
        <div key={f.key} className="form-group">
          <label className="form-label">{f.label}</label>
          <input className="form-input" type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => set(f.key, e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()}/>
        </div>
      ))}

      <button className="btn-teal" style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }} onClick={handleSubmit}>
        {loading ? <><div className="loader" style={{ border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}/> Creating Account...</> : 'Create Free Account 🌸'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--kashmir-teal)', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
      </p>
    </AuthLayout>
  );
}
