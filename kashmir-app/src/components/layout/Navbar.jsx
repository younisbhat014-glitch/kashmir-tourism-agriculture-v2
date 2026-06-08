import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/tourism', label: 'Tourism' },
    { to: '/agriculture', label: 'Agriculture' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '10px 5%' : '18px 5%',
        background: scrolled ? 'rgba(13,59,46,0.94)' : 'linear-gradient(90deg, rgba(7,74,56,0.76), rgba(21,113,133,0.62))',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(16px)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'inset 0 -1px 0 rgba(140,255,195,0.22), 0 4px 24px rgba(7,74,56,0.16)',
        transition: 'all 0.4s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--kashmir-gold), var(--kashmir-teal))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
          }}>🏔</div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.2rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>Kashmir</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--kashmir-gold)', letterSpacing: 2, textTransform: 'uppercase' }}>Paradise Portal</div>
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="nav-desktop">
          {links.map(l => (
            <Link key={l.to} to={l.to} className="nav-link" style={{
              color: isActive(l.to) ? 'var(--kashmir-gold)' : 'rgba(255,255,255,0.9)',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem',
              transition: 'color 0.3s', letterSpacing: 0.3,
              borderBottom: isActive(l.to) ? '2px solid var(--kashmir-gold)' : '2px solid transparent',
              paddingBottom: 2,
            }}>{l.label}</Link>
          ))}
        </div>

        {/* ── Desktop Auth + Hamburger ── */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Auth buttons — desktop only */}
          <div className="nav-desktop" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.18)', borderRadius: 50,
                  padding: '7px 14px', textDecoration: 'none', color: 'white',
                  fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.3s',
                }}>
                  {user.role !== 'admin' && <span>{user.avatar}</span>}
                  <span>{user.name.split(' ')[0]}</span>
                  {user.role === 'admin' && (
                    <span style={{ background: 'var(--kashmir-gold)', color: 'var(--kashmir-deep)', fontSize: '0.6rem', padding: '2px 7px', borderRadius: 50, fontWeight: 800 }}>ADMIN</span>
                  )}
                </Link>
                <button onClick={handleLogout} style={{
                  background: 'rgba(196,112,106,0.18)', border: '1px solid rgba(196,112,106,0.4)',
                  color: '#ff8a80', padding: '7px 14px', borderRadius: 50,
                  fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem' }}>Login</Link>
                <Link to="/register" className="btn-primary" style={{ padding: '9px 22px', textDecoration: 'none', fontSize: '0.82rem' }}>Sign Up</Link>
              </>
            )}
          </div>

          {/* ── Hamburger — mobile only ── */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="nav-hamburger"
            aria-label="Toggle menu"
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 10, width: 42, height: 42,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 5, cursor: 'pointer', padding: 0, transition: 'background 0.3s',
            }}
          >
            <span style={{
              display: 'block', width: 20, height: 2, background: 'white', borderRadius: 2,
              transition: 'all 0.3s',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }}/>
            <span style={{
              display: 'block', width: 20, height: 2, background: 'white', borderRadius: 2,
              transition: 'all 0.3s', opacity: menuOpen ? 0 : 1,
            }}/>
            <span style={{
              display: 'block', width: 20, height: 2, background: 'white', borderRadius: 2,
              transition: 'all 0.3s',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }}/>
          </button>
        </div>
      </nav>

      {/* ── Mobile Dropdown Menu ── */}
      <div style={{
        position: 'fixed', top: 70, left: 0, right: 0, zIndex: 99,
        background: 'rgba(13,59,46,0.98)', backdropFilter: 'blur(20px)',
        padding: menuOpen ? '20px 6% 24px' : '0 6%',
        maxHeight: menuOpen ? 500 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s ease, padding 0.3s ease',
        borderBottom: menuOpen ? '1px solid rgba(201,168,76,0.2)' : 'none',
      }} className="nav-mobile-menu">
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            display: 'block', color: isActive(l.to) ? 'var(--kashmir-gold)' : 'rgba(255,255,255,0.9)',
            textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
            padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
            transition: 'color 0.2s',
          }}>{l.label}</Link>
        ))}

        {/* Mobile auth */}
        <div style={{ marginTop: 16 }}>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 16px',
                textDecoration: 'none', color: 'white', fontWeight: 700,
              }}>
                {user.role !== 'admin' && <span style={{ fontSize: '1.3rem' }}>{user.avatar}</span>}
                <div>
                  <div style={{ fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--kashmir-gold)', textTransform: 'uppercase' }}>{user.role} Dashboard</div>
                </div>
              </Link>
              <button onClick={handleLogout} style={{
                background: 'rgba(196,112,106,0.15)', border: '1px solid rgba(196,112,106,0.3)',
                color: '#ff8a80', padding: '11px', borderRadius: 12,
                fontFamily: 'Nunito', fontWeight: 700, cursor: 'pointer', width: '100%',
              }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/login" style={{
                flex: 1, textAlign: 'center', padding: '11px',
                border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12,
                color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
              }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{
                flex: 1, textAlign: 'center', textDecoration: 'none',
                padding: '11px', fontSize: '0.9rem', borderRadius: 12,
              }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Responsive CSS ── */}
      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-hamburger { display: none !important; }
        .nav-mobile-menu { display: none !important; }

        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-mobile-menu { display: block !important; }
        }
      `}</style>
    </>
  );
}
