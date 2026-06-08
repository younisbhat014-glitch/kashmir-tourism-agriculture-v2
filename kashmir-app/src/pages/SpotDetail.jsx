import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TOURIST_SPOTS } from '../data/touristSpotsData';

export default function SpotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const spot = TOURIST_SPOTS.find(s => s.id === parseInt(id));
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  if (!spot) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: '4rem' }}>🏔</div>
      <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem' }}>Spot not found</h2>
      <Link to="/tourism" className="btn-teal" style={{ textDecoration: 'none' }}>← Back to Tourism</Link>
    </div>
  );

  const tabs = [
    { id: 'overview', label: '📋 Overview' },
    { id: 'activities', label: '🎯 Activities' },
    { id: 'howtoreach', label: '🚗 How to Reach' },
    { id: 'tips', label: '💡 Tips' },
    { id: 'hotels', label: '🏨 Nearby Hotels' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--kashmir-light)', paddingTop: 80 }}>

      {/* Hero Image Gallery */}
      <div className="spot-hero" style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        <img
          src={spot.gallery[activeImg]}
          alt={spot.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)', pointerEvents: 'none' }} />

        {/* Back Button */}
        <button className="spot-back-btn" onClick={() => navigate('/tourism')} style={{
          position: 'absolute', top: 24, left: 32,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50,
          color: 'white', padding: '8px 20px', cursor: 'pointer',
          fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.85rem',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>← Back</button>

        {/* Gallery Thumbnails */}
        <div className="spot-gallery-thumbs" style={{
          position: 'absolute', bottom: 100, right: 32,
          display: 'flex', gap: 8, zIndex: 3,
        }}>
          {spot.gallery.map((img, i) => (
            <div key={i} onClick={() => setActiveImg(i)} style={{
              width: 60, height: 44, borderRadius: 8, overflow: 'hidden',
              border: i === activeImg ? '2px solid var(--kashmir-gold)' : '2px solid rgba(255,255,255,0.3)',
              cursor: 'pointer', transition: 'all 0.3s',
            }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Title */}
        <div className="spot-hero-title" style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <span className="badge badge-teal">{spot.category}</span>
            <span style={{ color: '#FFD700', fontSize: '1rem' }}>⭐ {spot.rating}</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>({spot.reviews?.toLocaleString()} reviews)</span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'white', fontWeight: 700, marginBottom: 6 }}>{spot.name}</h1>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>📍 {spot.location}</div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="spot-quick-bar" style={{ background: 'var(--kashmir-deep)', padding: '16px 8%' }}>
        <div className="spot-quick-inner" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '🎟', label: 'Entry Fee', value: spot.entry },
            { icon: '📅', label: 'Best Time', value: spot.bestTime },
            { icon: '⏱', label: 'Duration', value: spot.duration },
            { icon: '🥾', label: 'Difficulty', value: spot.difficulty },
          ].map(item => (
            <div className="spot-quick-item" key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 2 }}>{item.icon}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</div>
              <div style={{ color: 'var(--kashmir-gold)', fontWeight: 700, fontSize: '0.9rem' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="spot-tabs" style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', position: 'sticky', top: 72, zIndex: 50 }}>
        <div className="spot-tabs-inner" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 8%', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '14px 18px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap',
              color: activeTab === t.id ? 'var(--kashmir-teal)' : 'var(--text-secondary)',
              borderBottom: activeTab === t.id ? '3px solid var(--kashmir-teal)' : '3px solid transparent',
              transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="spot-content" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 8%' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="spot-overview-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40 }}>
            <div>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 16 }}>About {spot.name}</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '1rem', marginBottom: 24 }}>{spot.longDescription}</p>

              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', marginBottom: 16 }}>Top Activities</h3>
              <div className="spot-activity-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
                {spot.activities.map(activity => (
                  <div key={activity} className="glass-card" style={{ padding: '12px 16px', fontSize: '0.88rem', fontWeight: 600 }}>
                    {activity}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="glass-card" style={{ padding: '24px', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', marginBottom: 16 }}>Quick Info</h3>
                {[
                  { icon: '🎟', label: 'Entry Fee', value: spot.entry },
                  { icon: '📅', label: 'Best Time', value: spot.bestTime },
                  { icon: '⏱', label: 'Duration', value: spot.duration },
                  { icon: '🥾', label: 'Difficulty', value: spot.difficulty },
                  { icon: '📍', label: 'Location', value: spot.location },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.icon} {item.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--kashmir-deep)' }}>{item.value}</span>
                  </div>
                ))}
                <a href={spot.mapLink} target="_blank" rel="noreferrer" style={{
                  display: 'block', textAlign: 'center', marginTop: 16,
                  background: 'var(--kashmir-teal)', color: 'white',
                  padding: '11px', borderRadius: 50, textDecoration: 'none',
                  fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.88rem',
                }}>📍 View on Google Maps</a>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', marginBottom: 16 }}>Book Your Stay</h3>
                {spot.nearbyHotels.map(hotel => (
                  <div key={hotel} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.88rem' }}>
                    <span>🏨</span>
                    <span style={{ flex: 1, fontWeight: 600 }}>{hotel}</span>
                  </div>
                ))}
                <Link to="/tourism?tab=hotels" style={{
                  display: 'block', textAlign: 'center', marginTop: 16,
                  background: 'var(--kashmir-gold)', color: 'var(--kashmir-deep)',
                  padding: '11px', borderRadius: 50, textDecoration: 'none',
                  fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.88rem',
                }}>Book Hotel Now →</Link>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="spot-tab-panel">
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 24 }}>Things to Do at {spot.name}</h2>
            <div className="spot-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 20 }}>
              {spot.activities.map((activity, i) => (
                <div key={i} className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 52, height: 52, flexShrink: 0, background: 'linear-gradient(135deg, var(--kashmir-teal), var(--kashmir-gold))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {activity.split(' ')[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{activity.split(' ').slice(1).join(' ')}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Available at {spot.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOW TO REACH */}
        {activeTab === 'howtoreach' && (
          <div style={{ maxWidth: 700 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 24 }}>How to Reach {spot.name}</h2>
            <div className="glass-card" style={{ padding: '32px', marginBottom: 24 }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>🗺</div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '1rem' }}>{spot.howToReach}</p>
            </div>
            <div className="spot-card-grid spot-reach-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: '✈️', mode: 'By Air', info: 'Nearest airport: Srinagar International Airport' },
                { icon: '🚂', mode: 'By Train', info: 'Nearest railway station: Udhampur / Banihal' },
                { icon: '🚌', mode: 'By Bus', info: 'J&K SRTC buses from Srinagar available' },
                { icon: '🚗', mode: 'By Taxi', info: 'Private taxis easily available from Srinagar' },
              ].map(item => (
                <div key={item.mode} className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.mode}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{item.info}</div>
                </div>
              ))}
            </div>
            <a href={spot.mapLink} target="_blank" rel="noreferrer" className="btn-teal" style={{ display: 'inline-block', marginTop: 24, textDecoration: 'none' }}>
              📍 Open in Google Maps
            </a>
          </div>
        )}

        {/* TIPS */}
        {activeTab === 'tips' && (
          <div style={{ maxWidth: 700 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 24 }}>Travel Tips for {spot.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {spot.tips.map((tip, i) => (
                <div key={i} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 36, height: 36, flexShrink: 0, background: 'linear-gradient(135deg, var(--kashmir-gold), #E8C96C)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--kashmir-deep)', fontWeight: 800, fontSize: '0.85rem' }}>{i + 1}</div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, paddingTop: 6 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEARBY HOTELS */}
        {activeTab === 'hotels' && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 24 }}>Nearby Accommodation</h2>
            <div className="spot-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 20, marginBottom: 32 }}>
              {spot.nearbyHotels.map((hotel, i) => (
                <div key={i} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏨</div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{hotel}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 16 }}>Near {spot.name}</div>
                  <Link to="/tourism" className="btn-teal" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: '0.82rem' }}>Book Now</Link>
                </div>
              ))}
            </div>
            <div style={{ background: 'linear-gradient(135deg, var(--kashmir-teal), var(--kashmir-deep))', borderRadius: 20, padding: '28px', color: 'white', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', marginBottom: 8 }}>More Hotels Available</h3>
              <p style={{ opacity: 0.8, marginBottom: 20 }}>Check our full hotel listings near {spot.name}</p>
              <Link to="/tourism" className="btn-primary" style={{ textDecoration: 'none' }}>View All Hotels →</Link>
            </div>
          </div>
        )}
      </div>

      {/* Other Spots */}
      <div className="spot-more-section" style={{ background: 'white', padding: '48px 8%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', marginBottom: 24 }}>More Places to Explore</h2>
          <div className="spot-card-grid spot-more-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 16 }}>
            {TOURIST_SPOTS.filter(s => s.id !== spot.id).slice(0, 4).map(s => (
              <Link key={s.id} to={`/spot/${s.id}`} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ overflow: 'hidden', cursor: 'pointer' }}>
                  <img src={s.image} alt={s.name} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                  <div style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--kashmir-deep)' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>⭐ {s.rating} · {s.category}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
