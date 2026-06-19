import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/ui/Hero';
import { TOURIST_SPOTS } from '../data/appData';
import { getCropsAPI, getHotelsAPI } from '../utils/api';

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(c => {
          c.style.opacity = '1';
        });
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

function FeatureTicker() {
  const features = [
    'Tourism bookings',
    'Premium hotel stays',
    'Vehicle rentals',
    'Fresh Kashmiri crops',
    'Farmer marketplace',
    'Live travel support',
    'Heritage experiences',
    'Secure account access',
  ];
  const tickerItems = [...features, ...features];

  return (
    <section className="home-feature-ticker" aria-label="Available services">
      <div className="home-feature-ticker-track">
        {tickerItems.map((feature, index) => (
          <div
            key={`${feature}-${index}`}
            className="home-feature-ticker-item"
            aria-hidden={index >= features.length}
          >
            <span className={`home-feature-ticker-dot ${index % 2 === 0 ? 'green' : 'blue'}`} />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </section>
  );

}

function FeaturedPlaces() {
  const ref = useInView();
  return (
    <section ref={ref} className="home-showcase-section" style={{ padding: '80px 8%', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div className="section-badge fade-in-up">🗺 Must Visit</div>
          <h2 className="section-title fade-in-up animate-delay-1">Top Tourist <span style={{ color: 'var(--kashmir-teal)' }}>Destinations</span></h2>
          <p className="section-subtitle fade-in-up animate-delay-2" style={{ margin: '0 auto' }}>From the shimmering Dal Lake to the snow-draped Gulmarg, discover Kashmir's iconic wonders.</p>
        </div>
        <div className="grid-3 mobile-swipe-row">
          {TOURIST_SPOTS.slice(0, 6).map((spot, i) => (
            <div key={spot.id} className={`glass-card home-destination-card fade-in-up animate-delay-${i % 3 + 1}`}
              style={{ overflow: 'hidden', cursor: 'pointer' }}>
              <div className="home-destination-card-image" style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                <img src={spot.image} alt={spot.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span className="badge badge-teal">{spot.category}</span>
                </div>
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', borderRadius: 50, padding: '4px 10px', color: 'white', fontSize: '0.78rem', fontWeight: 700 }}>
                  ⭐ {spot.rating}
                </div>
              </div>
              <div className="home-destination-card-content" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 6, color: 'var(--kashmir-deep)' }}>{spot.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 16 }}>{spot.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>🗓 {spot.bestTime}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--kashmir-teal)' }}>Entry: {spot.entry}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/tourism" className="btn-teal" style={{ textDecoration: 'none', padding: '14px 36px' }}>View All Destinations →</Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedHotels({ hotels }) {
  const ref = useInView();
  return (
    <section ref={ref} className="home-showcase-section home-hotel-section" style={{ padding: '80px 8%', background: 'var(--kashmir-light)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="section-badge fade-in-left">🏨 Top Rated</div>
            <h2 className="section-title fade-in-left animate-delay-1">Premium <span style={{ color: 'var(--kashmir-teal)' }}>Hotels</span></h2>
          </div>
          <Link to="/tourism?tab=hotels" className="btn-teal" style={{ textDecoration: 'none' }}>View All Hotels →</Link>
        </div>
        <div className="grid-3 mobile-swipe-row">
          {hotels.slice(0, 3).map((hotel, i) => (
            <div key={hotel._id} className={`glass-card home-hotel-card fade-in-up animate-delay-${i+1}`} style={{ overflow: 'hidden' }}>
              <div className="home-hotel-card-image" style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.target.style.transform='scale(1.08)'}
                  onMouseLeave={e => e.target.style.transform='scale(1)'}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '20px 16px 12px' }}>
                  <div style={{ color: '#FFD700', fontSize: '0.85rem' }}>{'⭐'.repeat(hotel.stars)}</div>
                </div>
              </div>
              <div className="home-hotel-card-content" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>{hotel.name}</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 12 }}>📍 {hotel.location}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {hotel.amenities.slice(0,3).map(a => <span key={a} className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{a}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="price-tag">₹{hotel.price.toLocaleString()}<span>/night</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgricultureHighlight({ crops }) {
  const ref = useInView();
  return (
    <section ref={ref} className="agri-highlight-section">
      <div className="agri-highlight-orb" aria-hidden="true" />
      <div className="agri-highlight-shell">
        <div className="agri-highlight-grid">
          <div className="agri-story-panel fade-in-left">
            <div className="section-badge agri-section-badge">🌾 Fresh from the fields</div>
            <h2 className="agri-highlight-title">
              Fresh from Kashmir's<br/><span>Fertile Fields</span>
            </h2>
            <p className="agri-highlight-copy">
              World-renowned Pampore Saffron, crisp Sopore Apples, premium Doon Walnuts — buy directly from farmers. No middlemen. Fresh quality.
            </p>
            <div className="agri-feature-grid">
              {[
                { icon: '🌸', title: 'GI Tagged Saffron', desc: 'Certified authentic' },
                { icon: '🍎', title: '62K+ Farmers', desc: 'Direct sourcing' },
                { icon: '🚜', title: 'Machine Rental', desc: 'Affordable access' },
                { icon: '📅', title: 'Season Calendar', desc: 'Plan your harvest' },
              ].map(item => (
                <div key={item.title} className="agri-feature-card">
                  <div className="agri-feature-icon">{item.icon}</div>
                  <div className="agri-feature-title">{item.title}</div>
                  <div className="agri-feature-desc">{item.desc}</div>
                </div>
              ))}
            </div>
            <Link to="/agriculture" className="btn-primary agri-highlight-button">
              <span>Explore Agriculture Hub</span>
              <span className="agri-highlight-button-arrow">→</span>
            </Link>
          </div>
          <div className="agri-products-panel fade-in-right">
            <div className="agri-products-heading">
              <div>
                <span>From valley to your doorstep</span>
                <h3>Farm Fresh Collection</h3>
              </div>
              <span className="agri-products-count">{Math.min(crops.length, 4)} picks</span>
            </div>
            <div className="agri-crop-preview-grid">
              {crops.slice(0,4).map(crop => (
                <div key={crop._id} className="agri-crop-preview-card">
                  <div className="agri-crop-image-wrap">
                    <img className="agri-crop-preview-image" src={crop.image} alt={crop.name}/>
                    <span className="agri-crop-fresh-badge">Fresh</span>
                  </div>
                  <div className="agri-crop-preview-content">
                    <div className="agri-crop-preview-name">{crop.name}</div>
                    <div className="agri-crop-preview-price">₹{crop.price}/{crop.unit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    { name: 'Rahul Sharma', from: 'Delhi', text: 'Kashmir Portal made our family vacation absolutely seamless. Hotel booking, shikara rides — all in one place!', rating: 5, avatar: '👨' },
    { name: 'Priya Mehta', from: 'Mumbai', text: 'Bought fresh saffron directly from the farmer. Best quality I\'ve ever tasted. Highly recommend the agriculture section!', rating: 5, avatar: '👩' },
    { name: 'Ahmed Farooq', from: 'Hyderabad', text: 'The weather feature helped plan our Gulmarg ski trip perfectly. Amazing experience from start to finish.', rating: 5, avatar: '🧔' },
  ];

  return (
    <section className="home-reviews-section" style={{ padding: '80px 8%', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div className="section-badge">💬 Reviews</div>
          <h2 className="section-title">What Our <span style={{ color: 'var(--kashmir-teal)' }}>Visitors Say</span></h2>
        </div>
        <div className="grid-3 mobile-swipe-row">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card home-review-card" style={{ padding: '28px', position: 'relative' }}>
              <div style={{ fontSize: '2rem', position: 'absolute', top: 20, right: 24, opacity: 0.15 }}>"</div>
              <div style={{ color: '#F5A623', marginBottom: 12, fontSize: '1.1rem' }}>{'⭐'.repeat(t.rating)}</div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
              <div className="home-review-author" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="home-review-avatar" style={{ width: 44, height: 44, background: 'linear-gradient(135deg, var(--kashmir-teal), var(--kashmir-gold))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{t.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>from {t.from}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="home-cta-section" style={{
      padding: '80px 8%', textAlign: 'center',
      background: 'linear-gradient(135deg, #0c5d54 0%, #095048 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,168,76,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)' }}/>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2rem,5vw,3.5rem)', color: 'white', marginBottom: 16 }}>
          Ready to Explore <span style={{ color: 'var(--kashmir-gold)', fontStyle: 'italic' }}>Paradise?</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          Join thousands of satisfied tourists and farmers on Kashmir's premier digital portal.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '16px 40px' }}>Create Free Account</Link>
          <Link to="/tourism" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '1rem' }}>Browse Tourism</Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    Promise.all([getHotelsAPI(), getCropsAPI()])
      .then(([hotelData, cropData]) => {
        if (Array.isArray(hotelData)) setHotels(hotelData);
        if (Array.isArray(cropData)) setCrops(cropData);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <Hero />
      <FeatureTicker />
      <FeaturedPlaces />
      <FeaturedHotels hotels={hotels} />
      <AgricultureHighlight crops={crops} />
      <Testimonials />
      <CTASection />
    </div>
  );
}
