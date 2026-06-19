import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BG_IMAGES, THUMB_IMAGES, STATS } from '../../data/appData';

const SLIDES = [
  { bg: BG_IMAGES[0], thumb: THUMB_IMAGES[0], title: 'Dal Lake', sub: 'Jewel of Kashmir', tag: 'Srinagar' },
  { bg: BG_IMAGES[1], thumb: THUMB_IMAGES[1], title: 'Kashmir Valley', sub: 'Paradise on Earth', tag: 'J&K, India' },
  { bg: BG_IMAGES[2], thumb: THUMB_IMAGES[2], title: 'Gulmarg', sub: 'Winter Wonderland', tag: 'Ski Destination' },
  { bg: BG_IMAGES[3], thumb: THUMB_IMAGES[3], title: 'Kashmir\'s Sacred Land', sub: 'Where Earth Meets Heaven', tag: 'Kashmir Farmlands' },
  { bg: BG_IMAGES[4], thumb: THUMB_IMAGES[4], title: 'Saffron Fields', sub: 'World\'s Finest Spice', tag: 'Pampore, Kashmir' },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="home-hero" style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden' }}>

      {/* ── Background Images (position:absolute, behind everything) ── */}
      {SLIDES.map((s, i) => (
        <div key={i} className={`home-hero-bg ${s.title === 'Gulmarg' ? 'home-hero-bg-gulmarg' : ''}`} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${s.bg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: i === current ? 1 : 0,
          transform: i === current ? 'scale(1)' : 'scale(1.04)',
          transition: 'opacity 1.4s ease, transform 1.4s ease',
          zIndex: 0,
        }}/>
      ))}

      {/* ── Dark Overlay ── */}
      <div className="home-hero-overlay" style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(120deg, rgba(13,59,46,0.55) 0%, rgba(0,0,0,0.15) 55%, rgba(13,59,46,0.35) 100%)',
      }}/>

      {/* ── MAIN CONTENT WRAPPER — fills full height, flex column, space-between ── */}
      <div className="home-hero-main" style={{
        position: 'relative', zIndex: 5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',        /* vertically center the left+right row */
        paddingTop: 90,                  /* keep desktop badge clear of fixed navbar */
        paddingBottom: 90,               /* leave room for stats bar */
      }}>

        {/* ── Left text  +  Right floating thumb ── */}
        <div className="home-hero-row" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 6%',
          gap: 24,
        }}>

          {/* LEFT TEXT — fixed layout so it never pushes buttons down */}
          <div className="home-hero-copy" style={{ flex: '0 0 auto', maxWidth: 580 }}>

            <div key={`heading-${current}`} className="hero-slide-heading-enter">
              {/* Badge */}
              <div className="home-hero-badge" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.55)',
                padding: '5px 14px', borderRadius: 50, marginBottom: 16,
                backdropFilter: 'blur(6px)',
              }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--kashmir-gold)', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
                  🌸 Welcome to {slide.tag}
                </span>
              </div>

              {/* Title — clamp keeps it from exploding on small screens */}
              <h1 className="home-hero-title" style={{
                fontFamily: 'Cormorant Garamond',
                fontSize: 'clamp(2rem, 5vw, 4.8rem)',
                fontWeight: 700, color: 'white',
                lineHeight: 1.1, marginBottom: 10,
                /* fixed min-height prevents reflow pushing buttons */
                minHeight: '2.2em',
              }}>
                {slide.title}<br/>
                <span style={{ color: 'var(--kashmir-gold)', fontStyle: 'italic' }}>{slide.sub}</span>
              </h1>
            </div>

            <p className="home-hero-copy-text" style={{
              color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(0.85rem,1.5vw,1.05rem)',
              lineHeight: 1.7, marginBottom: 28, maxWidth: 460,
            }}>
              Discover the breathtaking beauty of Kashmir — from snow-capped peaks to fragrant saffron fields.
            </p>

            {/* Buttons — always visible, never pushed below fold */}
            <div className="home-hero-actions" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/tourism" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.95rem', padding: '13px 30px' }}>
                🗺 Explore Tourism
              </Link>
              <Link to="/agriculture" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.95rem', padding: '12px 28px' }}>
                🌾 Agriculture Hub
              </Link>
            </div>
          </div>

          {/* RIGHT — Floating Thumbnail (hidden on small phones) */}
          <div className="hero-thumb" style={{
            flex: '0 0 auto',
            animation: 'floatSide 8s ease-in-out infinite',
          }}>
            {/* Glass card behind thumb */}
            <div key={`media-${current}`} className="hero-thumb-card hero-slide-media-enter" style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 28, padding: 10,
              boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
            }}>
              <div className="hero-thumb-image" style={{ width: 170, height: 210, borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 0 0 2px rgba(201,168,76,0.5)' }}>
                <img
                  src={slide.thumb} alt={slide.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.9s ease' }}
                />
              </div>
            </div>

            {/* Caption */}
            <div key={`caption-${current}`} className="hero-thumb-caption hero-slide-caption-enter" style={{
              marginTop: 10, textAlign: 'center',
              background: 'rgba(13,59,46,0.75)', backdropFilter: 'blur(12px)',
              borderRadius: 12, padding: '7px 14px',
              border: '1px solid rgba(201,168,76,0.3)',
            }}>
              <div style={{ color: 'var(--kashmir-gold)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: 1 }}>{slide.tag}</div>
              <div style={{ color: 'white', fontSize: '0.88rem', fontFamily: 'Cormorant Garamond', fontWeight: 600 }}>{slide.title}</div>
            </div>

            {/* Dots */}
            <div className="hero-thumb-dots" style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
              {SLIDES.map((_, i) => (
                <div key={i} onClick={() => setCurrent(i)} style={{
                  width: i === current ? 22 : 7, height: 7,
                  borderRadius: 50, cursor: 'pointer',
                  background: i === current ? 'var(--kashmir-gold)' : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.35s',
                }}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Bar — pinned to bottom ── */}
      <div className="hero-stats" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        background: 'linear-gradient(90deg, rgba(249,255,250,0.94), rgba(239,255,252,0.90), rgba(255,251,239,0.94))',
        backdropFilter: 'blur(24px) saturate(1.35)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.35)',
        borderTop: '1px solid rgba(255,255,255,0.78)',
        boxShadow: '0 -18px 46px rgba(5,68,53,0.16), inset 0 1px 0 rgba(255,255,255,0.86)',
        padding: '12px 5.5%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', flexWrap: 'wrap', gap: 12,
      }}>
        {[
          { val: STATS.tourists, label: 'Annual Tourists', icon: '✈️' },
          { val: STATS.farmers, label: 'Registered Farmers', icon: '🌾' },
          { val: STATS.hotels, label: 'Accommodations', icon: '🏨' },
          { val: STATS.crops, label: 'Crop Varieties', icon: '🌿' },
          { val: STATS.heritage, label: 'Heritage Sites', icon: '🕌' },
        ].map(({ val, label, icon }) => (
          <div key={label} className="hero-stat-card" style={{ textAlign: 'center', flex: 1, minWidth: 92 }}>
            <div className="hero-stat-icon">{icon}</div>
            <div className="hero-stat-value">{val}</div>
            <div className="hero-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .hero-thumb {
            display: block !important;
            position: relative !important;
            z-index: 1 !important;
            width: fit-content !important;
            margin: 0 0 12px auto !important;
            animation: floatSide 8s ease-in-out infinite !important;
          }
          .hero-thumb-card {
            padding: 5px !important;
            border-radius: 16px !important;
            box-shadow: 0 12px 28px rgba(0,0,0,0.28) !important;
          }
          .hero-thumb-image {
            width: 76px !important;
            height: 88px !important;
            border-radius: 12px !important;
          }
          .hero-thumb-caption {
            margin-top: 5px !important;
            border-radius: 10px !important;
            padding: 4px 7px !important;
            max-width: 92px !important;
          }
          .hero-thumb-caption div:first-child {
            font-size: 0.5rem !important;
            letter-spacing: 0.4px !important;
          }
          .hero-thumb-caption div:last-child {
            font-size: 0.66rem !important;
            line-height: 1.1 !important;
          }
          .hero-thumb-dots {
            display: none !important;
          }
          .home-hero-bg-gulmarg {
            background-position: 36% center !important;
          }
        }
        @media (max-width: 480px) {
          .hero-thumb {
            margin: 0 0 10px auto !important;
          }
          .hero-thumb-image {
            width: 68px !important;
            height: 80px !important;
          }
          .hero-thumb-caption {
            max-width: 84px !important;
          }
          .home-hero-bg-gulmarg {
            background-position: 34% center !important;
          }
          .hero-stats { flex-wrap: nowrap !important; overflow-x: auto; }
        }
      `}</style>
    </section>
  );
}
