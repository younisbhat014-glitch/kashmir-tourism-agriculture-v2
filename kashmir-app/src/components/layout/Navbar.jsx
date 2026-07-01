import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';

const ANDROID_APP_URL = 'https://expo.dev/artifacts/eas/ArLvK593o1TMPcfxejrfH_NPR5vVaXvi49rNlSvHp8w.apk';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNativeApp] = useState(() => navigator.userAgent.includes('KashmirPortalApp/'));
  const [showInstallApp, setShowInstallApp] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const isStandalone = window.matchMedia?.('(display-mode: standalone)').matches;
    setShowInstallApp(!isNativeApp && !isStandalone);
  }, [isNativeApp]);

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
            {isNativeApp && <NotificationBell />}
            {showInstallApp && (
              <a
                href={ANDROID_APP_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'var(--kashmir-deep)',
                  background: 'linear-gradient(135deg, #f3d66b, var(--kashmir-gold))',
                  border: '1px solid rgba(255,255,255,0.34)',
                  borderRadius: 50,
                  padding: '8px 15px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.16)',
                  whiteSpace: 'nowrap',
                }}
              >
                Install App
              </a>
            )}
            {user ? (
              <>
                <Link className="nav-user-pill" to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.18)', borderRadius: 50,
                  padding: '7px 14px', textDecoration: 'none', color: 'white',
                  fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.3s',
                }}>
                  {user.role !== 'admin' && <span>{user.avatar}</span>}
                  <span>{user.name.split(' ')[0]}</span>
                  {user.role === 'admin' && (
                    <span className="nav-admin-badge" style={{ background: 'var(--kashmir-gold)', color: 'var(--kashmir-deep)', fontSize: '0.6rem', padding: '2px 7px', borderRadius: 50, fontWeight: 800 }}>ADMIN</span>
                  )}
                </Link>
                <button onClick={handleLogout} style={{
                  background: 'rgba(196,112,106,0.18)', border: '1px solid rgba(196,112,106,0.4)',
                  color: '#ff8a80', padding: '7px 14px', borderRadius: 50,
                  fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                }}>Logout</button>
              </>
            ) : (
              <div className="nav-auth-combo nav-auth-combo-desktop" aria-label="Account access">
                <Link to="/login" className="nav-auth-combo-link nav-auth-login">Login</Link>
                <Link to="/register" className="nav-auth-combo-link nav-auth-signup">Sign Up</Link>
              </div>
            )}
          </div>

          {/* ── Hamburger — mobile only ── */}
          {isNativeApp && (
            <div className="nav-mobile-notification">
              <NotificationBell mobile />
            </div>
          )}

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
          {showInstallApp && (
            <a
              href={ANDROID_APP_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                width: '100%',
                marginBottom: 12,
                padding: '12px 16px',
                borderRadius: 12,
                textAlign: 'center',
                color: 'var(--kashmir-deep)',
                background: 'linear-gradient(135deg, #f3d66b, var(--kashmir-gold))',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.92rem',
                boxSizing: 'border-box',
              }}
            >
              Install App
            </a>
          )}
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
            <div className="nav-auth-combo nav-auth-combo-mobile" aria-label="Account access">
              <Link to="/login" className="nav-auth-combo-link nav-auth-login">Login</Link>
              <Link to="/register" className="nav-auth-combo-link nav-auth-signup">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Responsive CSS ── */}
      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-hamburger { display: none !important; }
        .nav-mobile-menu { display: none !important; }
        .nav-mobile-notification { display: none !important; }
        .nav-auth-combo {
          display: inline-flex;
          align-items: center;
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.24);
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08));
          box-shadow: inset 0 1px rgba(255,255,255,0.22), 0 10px 24px rgba(2,32,26,0.16);
          backdrop-filter: blur(14px);
        }
        .nav-auth-combo-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 0 18px;
          color: rgba(255,255,255,0.94);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 800;
          line-height: 1;
          white-space: nowrap;
          transition: color 0.24s ease, background 0.24s ease, transform 0.24s ease, box-shadow 0.24s ease;
        }
        .nav-auth-login:hover,
        .nav-auth-login:focus-visible {
          color: #fff7c9;
          background: rgba(255,255,255,0.08);
        }
        .nav-auth-signup {
          min-width: 104px;
          color: var(--kashmir-deep);
          background: linear-gradient(135deg, #f4d86d, var(--kashmir-gold));
          box-shadow: 0 8px 18px rgba(201,168,76,0.28);
        }
        .nav-auth-signup:hover,
        .nav-auth-signup:focus-visible {
          color: #063b2c;
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(201,168,76,0.38);
        }
        .nav-auth-combo-mobile {
          width: 100%;
          display: flex;
        }
        .nav-auth-combo-mobile .nav-auth-combo-link {
          flex: 1 1 0;
          min-height: 46px;
          font-size: 0.93rem;
        }

        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-mobile-menu { display: block !important; }
          .nav-mobile-notification { display: block !important; }
        }
      `}</style>
    </>
  );
}
