import React from 'react';
import { Link } from 'react-router-dom';

const TEAM = [
  { name: 'Dr. Farooq Ahmed', role: 'Director of Tourism', avatar: '👨‍💼', desc: 'IAS Officer, 20+ years in J&K administration.' },
  { name: 'Rukhsana Bhat', role: 'Agriculture Head', avatar: '👩‍🌾', desc: 'PhD Agronomy, KVK expert, farmer welfare advocate.' },
  { name: 'Imran Khan', role: 'Technology Lead', avatar: '👨‍💻', desc: 'IIT graduate, digital transformation specialist.' },
  { name: 'Zara Wani', role: 'Cultural Liaison', avatar: '👩‍🎨', desc: 'Heritage conservation, arts & crafts promoter.' },
];

export default function About() {
  return (
    <div className="about-page" style={{ minHeight: '100vh', background: 'var(--kashmir-light)' }}>
      {/* Hero */}
      <div className="about-hero" style={{
        height: 400, position: 'relative', overflow: 'hidden',
        backgroundImage: 'url(https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,59,46,0.88), rgba(0,0,0,0.5))' }}/>
        <div className="about-hero-content" style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 8%', paddingTop: 80 }}>
          <div className="section-badge" style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', color: 'var(--kashmir-gold)', marginBottom: 16 }}>🕌 About Us</div>
          <h1 className="about-hero-title" style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2.5rem,5vw,4rem)', color: 'white', fontWeight: 700, marginBottom: 16 }}>
            About <span style={{ color: 'var(--kashmir-gold)', fontStyle: 'italic' }}>Kashmir Portal</span>
          </h1>
          <p className="about-hero-text" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: 580, lineHeight: 1.7 }}>
            The official digital gateway connecting Kashmir's tourism, culture, and agricultural heritage with the world.
          </p>
        </div>
      </div>

      <div className="about-shell" style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px' }}>
        {/* Mission */}
        <div className="about-mission" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 80 }}>
          <div>
            <div className="section-badge">🎯 Our Mission</div>
            <h2 className="section-title">Connecting Kashmir<br/>with the <span style={{ color: 'var(--kashmir-teal)', fontStyle: 'italic' }}>World</span></h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 20 }}>
              Kashmir Portal is a J&K Government initiative to digitize and democratize access to Kashmir's tourism infrastructure and agricultural marketplace. We bridge the gap between local farmers, businesses, and tourists worldwide.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28 }}>
              From booking a luxury houseboat on Dal Lake to purchasing GI-tagged Pampore saffron directly from farmers — our platform makes it seamless, transparent, and trustworthy.
            </p>
            <div className="about-actions" style={{ display: 'flex', gap: 16 }}>
              <Link to="/tourism" className="btn-teal" style={{ textDecoration: 'none' }}>Explore Tourism</Link>
              <Link to="/agriculture" style={{ textDecoration: 'none', padding: '12px 28px', border: '2px solid var(--kashmir-teal)', borderRadius: 50, color: 'var(--kashmir-teal)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.95rem' }}>Agriculture Hub</Link>
            </div>
          </div>
          <div className="about-image-wrap" style={{ position: 'relative' }}>
            <img className="about-mission-image" src="https://kashmirrootstock.com/wp-content/uploads/2022/04/collage-5.jpg" alt="Kashmir" style={{ width: '100%', height: 380, objectFit: 'cover', borderRadius: 24 }}/>
            <div className="about-stat-card" style={{ position: 'absolute', bottom: -20, left: -20, background: 'white', borderRadius: 16, padding: '16px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', fontWeight: 700, color: 'var(--kashmir-teal)' }}>4.2M+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Annual Tourists</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="about-section" style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-badge">💎 Our Values</div>
            <h2 className="section-title">What We <span style={{ color: 'var(--kashmir-teal)' }}>Stand For</span></h2>
          </div>
          <div className="grid-4">
            {[
              { icon: '🌿', title: 'Sustainability', desc: 'Promoting eco-tourism and organic farming for a greener Kashmir.' },
              { icon: '🤝', title: 'Empowerment', desc: 'Putting technology in the hands of local farmers and businesses.' },
              { icon: '🛡', title: 'Transparency', desc: 'No hidden fees, no middlemen — fair prices for all.' },
              { icon: '🌸', title: 'Heritage', desc: 'Preserving and promoting Kashmir\'s 5000-year-old culture.' },
            ].map(v => (
              <div key={v.title} className="glass-card about-card" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{v.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>{v.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="about-section" style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-badge">👥 The Team</div>
            <h2 className="section-title">People Behind <span style={{ color: 'var(--kashmir-teal)' }}>Kashmir Portal</span></h2>
          </div>
          <div className="grid-4">
            {TEAM.map(member => (
              <div key={member.name} className="glass-card about-card" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, var(--kashmir-teal), var(--kashmir-gold))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>{member.avatar}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{member.name}</h3>
                <div style={{ color: 'var(--kashmir-teal)', fontSize: '0.78rem', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{member.role}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="about-contact" style={{ background: 'linear-gradient(135deg, var(--kashmir-deep), var(--kashmir-teal))', borderRadius: 28, padding: '50px', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, background: 'rgba(201,168,76,0.08)', borderRadius: '50%' }}/>
          <div style={{ position: 'absolute', bottom: -60, right: -60, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}/>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="about-contact-title" style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', marginBottom: 12 }}>Get In Touch</h2>
            <p className="about-contact-text" style={{ opacity: 0.85, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>Have questions about tourism or agriculture? Our team is here to help!</p>
            <div className="about-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 20, maxWidth: 700, margin: '0 auto 36px' }}>
              {[
                { icon: '📍', label: 'Address', value: 'Tourist Reception Centre, Srinagar' },
                { icon: '📞', label: 'Phone', value: '+91-194-2452690' },
                { icon: '✉️', label: 'Email', value: 'info@kashmirportal.gov.in' },
                { icon: '🕐', label: 'Hours', value: 'Mon–Sat: 9am – 6pm' },
              ].map(item => (
                <div className="about-contact-card" key={item.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.value}</div>
                </div>
              ))}
            </div>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', fontSize: '1rem', padding: '14px 36px' }}>Join Kashmir Portal Today →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
