import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { WEATHER_DATA } from '../data/appData';
import { TOURIST_SPOTS } from '../data/touristSpotsData';
import { fetchWeatherByQuery } from '../services/weatherApi';
import { getHotelsAPI, getRestaurantsAPI, getVehiclesAPI } from '../utils/api';

function BookingModal({ item, type, onClose, onBook }) {
  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: 1, name: '', phone: '', date: '', time: '12:00', from: '', to: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', color: 'var(--kashmir-deep)' }}>
              Book {type === 'hotel' ? '🏨' : type === 'restaurant' ? '🍽' : '🚗'} {item.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Fill in your details to confirm booking</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your Name" value={form.name} onChange={e => set('name', e.target.value)}/>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Phone Number</label>
            <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => set('phone', e.target.value)}/>
          </div>
          {type === 'hotel' && <>
            <div className="form-group">
              <label className="form-label">Check-In Date</label>
              <input className="form-input" type="date" value={form.checkIn} onChange={e => set('checkIn', e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Check-Out Date</label>
              <input className="form-input" type="date" value={form.checkOut} onChange={e => set('checkOut', e.target.value)}/>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Number of Guests</label>
              <select className="form-select" value={form.guests} onChange={e => set('guests', e.target.value)}>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
              </select>
            </div>
          </>}
          {type === 'restaurant' && <>
            <div className="form-group">
              <label className="form-label">Reservation Date</label>
              <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <select className="form-select" value={form.time} onChange={e => set('time', e.target.value)}>
                {['12:00','13:00','14:00','19:00','19:30','20:00','20:30','21:00'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Number of Guests</label>
              <select className="form-select" value={form.guests} onChange={e => set('guests', e.target.value)}>
                {[1,2,3,4,5,6,7,8,10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </>}
          {type === 'vehicle' && <>
            <div className="form-group">
              <label className="form-label">Pickup Date</label>
              <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Duration (Days)</label>
              <select className="form-select" value={form.guests} onChange={e => set('guests', e.target.value)}>
                {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} Day{n>1?'s':''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">From Location</label>
              <input className="form-input" placeholder="e.g. Srinagar Airport" value={form.from} onChange={e => set('from', e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">To Location</label>
              <input className="form-input" placeholder="e.g. Gulmarg" value={form.to} onChange={e => set('to', e.target.value)}/>
            </div>
          </>}
        </div>

        <div style={{ background: 'var(--kashmir-light)', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{item.name}</span>
            <span style={{ fontWeight: 600 }}>
              {type === 'hotel' ? `₹${item.price}/night` : type === 'vehicle' ? `₹${item.pricePerDay}/day` : item.price}
            </span>
          </div>
          <div style={{ borderTop: '1px dashed #ddd', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, color: 'var(--kashmir-deep)' }}>Estimated Total</span>
            <span style={{ fontWeight: 800, color: 'var(--kashmir-teal)', fontSize: '1.1rem' }}>
              {type === 'hotel' ? `₹${(item.price * Math.max(1, parseInt(form.checkOut && form.checkIn ? (new Date(form.checkOut)-new Date(form.checkIn))/(1000*60*60*24) : 1))).toLocaleString()}` : type === 'vehicle' ? `₹${(item.pricePerDay * parseInt(form.guests || 1)).toLocaleString()}` : 'Confirm at venue'}
            </span>
          </div>
        </div>

        <button className="btn-teal" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} onClick={() => onBook(form)}>
          Confirm Booking ✓
        </button>
      </div>
    </div>
  );
}

function WeatherSection() {
  const [query, setQuery] = useState('Srinagar');
  const [place, setPlace] = useState('Srinagar, Jammu & Kashmir, India');
  const [weather, setWeather] = useState(WEATHER_DATA.Srinagar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const w = weather;

  const searchWeather = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const liveWeather = await fetchWeatherByQuery(query);
      if (!liveWeather) throw new Error('Weather unavailable');
      setWeather(liveWeather);
      setPlace(liveWeather.place || query.trim());
    } catch {
      setError('Weather nahi mila. City name thoda clearly likho.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', marginBottom: 20 }}>Live Weather Forecast</h3>
      <form onSubmit={searchWeather} style={{ display: 'flex', gap: 10, marginBottom: 20, maxWidth: 560 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search any place..."
          className="form-input"
          style={{ borderRadius: 50, padding: '12px 18px', flex: 1, minWidth: 0 }}
        />
        <button className="btn-teal" disabled={loading} style={{ whiteSpace: 'nowrap', padding: '12px 22px' }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div style={{ color: 'var(--kashmir-rose)', fontWeight: 700, fontSize: '0.86rem', marginBottom: 14 }}>{error}</div>}
      <div className="weather-widget">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '3.5rem', fontFamily: 'Cormorant Garamond', fontWeight: 700 }}>{w.temp}°C</div>
            <div style={{ fontSize: '1.1rem', opacity: 0.85, marginBottom: 16 }}>{w.condition}</div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div><div style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase' }}>Humidity</div><div style={{ fontWeight: 700 }}>{w.humidity}%</div></div>
              <div><div style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase' }}>Wind</div><div style={{ fontWeight: 700 }}>{w.wind} km/h</div></div>
            </div>
          </div>
          <div style={{ fontSize: '6rem', opacity: 0.9 }}>{w.icon}</div>
        </div>
        <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', fontSize: '0.82rem' }}>
          📍 {place}
        </div>
        {w.forecast?.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
            {w.forecast.map(day => (
              <div key={day.day} style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14,
                padding: '10px 12px',
              }}>
                <div style={{ fontSize: '0.72rem', opacity: 0.65, textTransform: 'uppercase', letterSpacing: 0.8 }}>{day.day}</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', marginTop: 4 }}>{day.max}° / {day.min}°</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: 2 }}>Rain {day.rain} mm</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Tourism() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'hotels' ? 'hotels' : 'spots');
  const [modal, setModal] = useState(null);
  const { user, addBooking } = useAuth();
  const toast = useToast();
  const [filter, setFilter] = useState('All');
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (['spots', 'hotels', 'restaurants', 'vehicles', 'weather'].includes(requestedTab)) {
      setTab(requestedTab);
    }
  }, [searchParams]);

  useEffect(() => {
    Promise.all([getHotelsAPI(), getRestaurantsAPI(), getVehiclesAPI()])
      .then(([hotelData, restaurantData, vehicleData]) => {
        if (Array.isArray(hotelData)) setHotels(hotelData);
        if (Array.isArray(restaurantData)) setRestaurants(restaurantData);
        if (Array.isArray(vehicleData)) setVehicles(vehicleData);
      })
      .catch(() => {});
  }, []);

  const handleBook = (item, type) => {
    if (!user) { toast('Please login to book!', 'error'); return; }
    setModal({ item, type });
  };

  const confirmBook = (form) => {
    if (!form.name || !form.phone) { toast('Please fill all fields!', 'error'); return; }
    addBooking({ type: modal.type, item: modal.item.name, ...form });
    toast(`${modal.item.name} booked successfully! 🎉`, 'success');
    setModal(null);
  };

  const tabs = [
    { id: 'spots', label: '🗺 Tourist Spots' },
    { id: 'hotels', label: '🏨 Hotels' },
    { id: 'restaurants', label: '🍽 Restaurants' },
    { id: 'vehicles', label: '🚗 Vehicles' },
    { id: 'weather', label: '🌤 Weather' },
  ];

  const spotCategories = ['All', ...new Set(TOURIST_SPOTS.map(s => s.category))];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--kashmir-light)' }}>
      {/* Hero Banner */}
      <div className="page-hero-banner" style={{
        height: 340, position: 'relative', overflow: 'hidden',
        // backgroundImage: 'url(https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&q=80)',
         backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,59,46,0.85), rgba(0,0,0,0.5))' }}/>
        <div className="page-hero-content" style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%', paddingTop: 80 }}>
          <div className="section-badge" style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', color: 'var(--kashmir-gold)', marginBottom: 12 }}>✈️ Tourism Hub</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2.5rem,5vw,4rem)', color: 'white', fontWeight: 700, marginBottom: 12 }}>
            Explore <span style={{ color: 'var(--kashmir-gold)', fontStyle: 'italic' }}>Kashmir</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', maxWidth: 500 }}>
            Book hotels, restaurants, vehicles & discover iconic destinations — all in one place.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="page-tabs" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: 72, zIndex: 50 }}>
        <div className="page-tabs-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap',
              color: tab === t.id ? 'var(--kashmir-teal)' : 'var(--text-secondary)',
              borderBottom: tab === t.id ? '3px solid var(--kashmir-teal)' : '3px solid transparent',
              transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="page-content-shell" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px' }}>

        {/* TOURIST SPOTS */}
        {tab === 'spots' && (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 30, flexWrap: 'wrap' }}>
              {spotCategories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} style={{
                  padding: '8px 18px', borderRadius: 50, border: 'none', cursor: 'pointer',
                  fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.82rem', transition: 'all 0.3s',
                  background: filter === cat ? 'var(--kashmir-teal)' : 'white',
                  color: filter === cat ? 'white' : 'var(--text-secondary)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>{cat}</button>
              ))}
            </div>
            <div className="grid-3">
              {TOURIST_SPOTS.filter(s => filter === 'All' || s.category === filter).map((spot, i) => (
                <Link key={spot.id} to={`/spot/${spot.id}`} style={{ textDecoration: 'none' }}>
                  <div className="glass-card" style={{ overflow: 'hidden', animation: `slideInCard 0.5s ease ${i*0.08}s both`, cursor: 'pointer' }}>
                  <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                    <img src={spot.image} alt={spot.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={e => e.target.style.transform='scale(1.08)'}
                      onMouseLeave={e => e.target.style.transform='scale(1)'}
                    />
                    <div style={{ position: 'absolute', top: 12, left: 12 }}><span className="badge badge-teal">{spot.category}</span></div>
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.65)', color: '#FFD700', borderRadius: 50, padding: '4px 10px', fontSize: '0.78rem', fontWeight: 700 }}>⭐ {spot.rating}</div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: 'var(--kashmir-deep)' }}>{spot.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: 14 }}>{spot.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>🗓 {spot.bestTime}</span>
                      <span style={{ fontWeight: 700, color: 'var(--kashmir-teal)' }}>Entry: {spot.entry}</span>
                    </div>
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
          
         

        {/* HOTELS */}
        {tab === 'hotels' && (
          <div className="grid-3">
            {hotels.map((hotel, i) => (
              <div key={hotel._id} className="glass-card" style={{ overflow: 'hidden', animation: `slideInCard 0.5s ease ${i*0.08}s both` }}>
                <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                  <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform='scale(1.08)'}
                    onMouseLeave={e => e.target.style.transform='scale(1)'}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.7))', padding: '16px 14px 10px' }}>
                    <div style={{ color: '#FFD700' }}>{'⭐'.repeat(hotel.stars)}</div>
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 50, padding: '4px 10px', fontSize: '0.78rem', fontWeight: 700 }}>⭐ {hotel.rating} ({hotel.reviews})</div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>{hotel.name}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 12 }}>📍 {hotel.location}</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 16 }}>
                    {hotel.amenities.map(a => <span key={a} className="badge badge-teal" style={{ fontSize: '0.68rem' }}>{a}</span>)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="price-tag">₹{hotel.price.toLocaleString()}<span>/night</span></div>
                    <button className="btn-teal" onClick={() => handleBook(hotel, 'hotel')} style={{ padding: '9px 20px', fontSize: '0.85rem' }}>Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RESTAURANTS */}
        {tab === 'restaurants' && (
          <div className="grid-3">
            {restaurants.map((r, i) => (
              <div key={r._id} className="glass-card" style={{ overflow: 'hidden', animation: `slideInCard 0.5s ease ${i*0.08}s both` }}>
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform='scale(1.08)'}
                    onMouseLeave={e => e.target.style.transform='scale(1)'}
                  />
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.65)', color: '#FFD700', borderRadius: 50, padding: '4px 10px', fontSize: '0.78rem', fontWeight: 700 }}>⭐ {r.rating}</div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--kashmir-deep)' }}>{r.name}</h3>
                    <span style={{ fontWeight: 800, color: 'var(--kashmir-teal)' }}>{r.price}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 6 }}>📍 {r.location}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 6 }}>🍽 {r.cuisine}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 6 }}>⏰ {r.timings}</div>
                  <div className="badge badge-gold" style={{ fontSize: '0.72rem', marginBottom: 16 }}>⭐ {r.specialty}</div>
                  <button className="btn-teal" style={{ width: '100%', padding: '10px' }} onClick={() => handleBook(r, 'restaurant')}>Reserve Table</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VEHICLES */}
        {tab === 'vehicles' && (
          <div className="grid-3">
            {vehicles.map((v, i) => (
              <div key={v._id} className="glass-card" style={{ overflow: 'hidden', animation: `slideInCard 0.5s ease ${i*0.08}s both` }}>
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform='scale(1.08)'}
                    onMouseLeave={e => e.target.style.transform='scale(1)'}
                  />
                  <div style={{ position: 'absolute', top: 12, left: 12 }}><span className="badge badge-gold">{v.type}</span></div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{v.name}</h3>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span>👥 {v.capacity} seats</span>
                    <span>{v.driver ? '👨‍✈️ Driver incl.' : '🗝 Self Drive'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 16 }}>
                    {v.features.map(f => <span key={f} className="badge badge-green" style={{ fontSize: '0.68rem' }}>{f}</span>)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="price-tag">₹{v.pricePerDay.toLocaleString()}<span>/day</span></div>
                      {v.pricePerKm && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>₹{v.pricePerKm}/km extra</div>}
                    </div>
                    <button className="btn-teal" onClick={() => handleBook(v, 'vehicle')} style={{ padding: '9px 20px', fontSize: '0.85rem' }}>Book Ride</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WEATHER */}
        {tab === 'weather' && (
          <div style={{ maxWidth: 600 }}>
            <WeatherSection />
            <div style={{ marginTop: 40 }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', marginBottom: 20 }}>Best Time to Visit</h3>
              {[
                { season: 'Spring (Mar–May)', desc: 'Flowers bloom, pleasant weather 10–22°C. Perfect for sightseeing.', icon: '🌸' },
                { season: 'Summer (Jun–Aug)', desc: 'Warm days, green valleys, ideal for trekking and Pahalgam.', icon: '☀️' },
                { season: 'Autumn (Sep–Nov)', desc: 'Saffron harvest, golden chinar leaves, mystical atmosphere.', icon: '🍂' },
                { season: 'Winter (Dec–Feb)', desc: 'Snow sports in Gulmarg, skiing, and magical snowscapes.', icon: '❄️' },
              ].map(item => (
                <div key={item.season} className="glass-card" style={{ padding: '16px 20px', marginBottom: 12, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{item.season}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {modal && <BookingModal item={modal.item} type={modal.type} onClose={() => setModal(null)} onBook={confirmBook}/>}
    </div>
  );
}
