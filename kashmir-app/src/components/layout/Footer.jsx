import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const tourismLinks = [
    { label: 'Hotels & Stays', to: '/tourism?tab=hotels' },
    { label: 'Restaurant Booking', to: '/tourism?tab=restaurants' },
    { label: 'Vehicle Rental', to: '/tourism?tab=vehicles' },
    { label: 'Tourist Spots', to: '/tourism?tab=spots' },
    { label: 'Weather Info', to: '/tourism?tab=weather' },
    // { label: 'Travel Packages', to: '/tourism' },
  ];

  const agricultureLinks = [
    { label: 'Buy Fresh Crops', to: '/agriculture?tab=buy' },
    { label: 'Sell Produce', to: '/agriculture?tab=sell' },
    { label: 'Rent Machines', to: '/agriculture?tab=machines' },
    { label: 'Season Calendar', to: '/agriculture?tab=calendar' },
    { label: 'Farmer Support', to: '/agriculture?tab=info' },
    // { label: 'Market Prices', to: '/agriculture' },
  ];

  return (
    <footer style={{
      background: 'linear-gradient(180deg, var(--kashmir-deep) 0%, #050f0a 100%)',
      color: 'rgba(255,255,255,0.8)',
      paddingTop: 60, paddingBottom: 30,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, var(--kashmir-gold), var(--kashmir-teal), var(--kashmir-rose), var(--kashmir-gold))',
        backgroundSize: '200%',
        animation: 'gradientShift 4s linear infinite',
      }}/>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 40, marginBottom: 50 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: '2rem' }}>🏔</span>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Kashmir Portal</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--kashmir-gold)', letterSpacing: 2 }}>PARADISE ON EARTH</div>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
              Your complete gateway to Kashmiri tourism, culture, and agricultural excellence. Connecting the valley with the world.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {['📘','📷','🐦','▶️'].map((icon,i) => (
                <div key={i} style={{
                  width: 36, height: 36, background: 'rgba(255,255,255,0.08)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', fontSize: '0.9rem',
                  transition: 'all 0.3s', border: '1px solid rgba(255,255,255,0.1)',
                }}>{icon}</div>
              ))}
            </div>
          </div>

          {/* Tourism */}
          <div>
            <h4 style={{ color: 'var(--kashmir-gold)', marginBottom: 16, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>Tourism</h4>
            {tourismLinks.map(item => (
              <Link key={item.label} to={item.to} style={{ display: 'block', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: 10, fontSize: '0.88rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='var(--kashmir-gold)'}
                onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.6)'}
              >{item.label}</Link>
            ))}
          </div>

          {/* Agriculture */}
          <div>
            <h4 style={{ color: 'var(--kashmir-gold)', marginBottom: 16, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>Agriculture</h4>
            {agricultureLinks.map(item => (
              <Link key={item.label} to={item.to} style={{ display: 'block', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: 10, fontSize: '0.88rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='var(--kashmir-gold)'}
                onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.6)'}
              >{item.label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'var(--kashmir-gold)', marginBottom: 16, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1 }}>Contact</h4>
            {[
              { icon: '📍', text: 'Tourist Reception Centre, Srinagar' },
              { icon: '📞', text: '+91-194-2452690' },
              { icon: '✉️', text: 'info@kashmirportal.gov.in' },
              { icon: '🕐', text: 'Mon–Sat: 9am – 6pm' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)' }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}

            <div style={{
              marginTop: 20, padding: '14px 18px',
              background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 12,
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--kashmir-gold)', fontWeight: 700, marginBottom: 8 }}>EMERGENCY HELPLINE</div>
              <div style={{ fontSize: '1.1rem', color: 'white', fontWeight: 700 }}>1800-180-7480</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>
            © 2025 Kashmir Tourism & Agriculture Portal. Government of J&K.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy','Terms of Use','Sitemap'].map(item => (
              <span key={item} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
