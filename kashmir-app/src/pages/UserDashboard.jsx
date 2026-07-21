import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WEATHER_DATA } from '../data/appData';
import { getMyBookingsAPI } from '../utils/api';

const paymentModeLabels = {
  online: 'Pay Online',
  pay_at_hotel: 'Pay at Hotel',
  pay_at_restaurant: 'Pay at Restaurant',
  pay_to_driver: 'Pay to Driver',
  cash_on_delivery: 'Cash on Delivery',
  pay_to_seller: 'Pay to Seller',
  pay_to_owner: 'Pay to Owner',
};

const paymentStatusLabels = {
  initiated: 'Online Initiated',
  pay_at_location: 'Pay at Location',
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
};

const getBookingName = (booking) => booking.itemName || booking.item || 'Booking';
const getBookingDate = (booking) => new Date(booking.createdAt || booking.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const getPaymentStatusBadgeStyle = (status) => {
  const base = {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'inline-block'
  };
  
  if (status === 'paid') {
    return { ...base, background: '#eef6f2', color: '#1a7a6e', border: '1px solid #1a7a6e' };
  }
  if (status === 'failed') {
    return { ...base, background: '#fdf3f2', color: '#c4706a', border: '1px solid #c4706a' };
  }
  if (status === 'pay_at_location') {
    return { ...base, background: '#f0f5ff', color: '#2b6cb0', border: '1px solid #b3d1ff' };
  }
  return { ...base, background: '#fff9e8', color: '#b7791f', border: '1px solid #f6e0b5' };
};

const getPaymentModeBadgeStyle = () => {
  return {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 800,
    background: 'rgba(201,168,76,0.12)',
    color: '#8a6d1c',
    border: '1px solid rgba(201,168,76,0.25)',
    display: 'inline-block'
  };
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardBookings, setDashboardBookings] = useState(user?.bookings || []);

  useEffect(() => {
    if (!user) return;
    getMyBookingsAPI()
      .then(data => {
        if (Array.isArray(data)) setDashboardBookings(data);
      })
      .catch(() => {});
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;

  const bookings = dashboardBookings;
  const purchases = user.purchases || [];

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'bookings', label: '📋 My Bookings' },
    { id: 'profile', label: '👤 Profile' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--kashmir-light)', paddingTop: 80 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--kashmir-deep), var(--kashmir-teal))', padding: '40px 8%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(201,168,76,0.08)', borderRadius: '50%' }}/>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, var(--kashmir-gold), #E8C96C)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: '0 8px 24px rgba(201,168,76,0.4)' }}>{user.avatar}</div>
            <div>
              <div style={{ fontFamily: 'Dancing Script', fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)' }}>Welcome back,</div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: 'white', fontWeight: 700 }}>{user.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>Member since {user.joinDate}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { val: bookings.length, label: 'Bookings' },
              { val: purchases.length, label: 'Orders' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px 24px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', fontWeight: 700, color: 'var(--kashmir-gold)' }}>{stat.val}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 8%', display: 'flex', gap: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.88rem',
              color: activeTab === t.id ? 'var(--kashmir-teal)' : 'var(--text-secondary)',
              borderBottom: activeTab === t.id ? '3px solid var(--kashmir-teal)' : '3px solid transparent',
              transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 8%' }}>

        {activeTab === 'overview' && (
          <div>
            {/* Quick Actions */}
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', marginBottom: 24 }}>Quick Actions</h2>
            <div className="grid-4" style={{ marginBottom: 40 }}>
              {[
                { icon: '🏨', label: 'Book Hotel', desc: 'Find & book accommodation', to: '/tourism', color: 'var(--kashmir-teal)' },
                { icon: '🍽', label: 'Reserve Table', desc: 'Kashmiri cuisine awaits', to: '/tourism', color: 'var(--kashmir-rose)' },
                { icon: '🌾', label: 'Buy Crops', desc: 'Fresh from the farm', to: '/agriculture', color: 'var(--kashmir-forest)' },
                { icon: '🚗', label: 'Rent Vehicle', desc: 'Explore the valley', to: '/tourism', color: 'var(--kashmir-sky)' },
              ].map(action => (
                <Link key={action.label} to={action.to} style={{ textDecoration: 'none' }}>
                  <div className="glass-card" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ width: 56, height: 56, background: `${action.color}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 14px', border: `2px solid ${action.color}30` }}>{action.icon}</div>
                    <div style={{ fontWeight: 700, color: 'var(--kashmir-deep)', marginBottom: 4 }}>{action.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{action.desc}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Weather Widget */}
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', marginBottom: 20 }}>Kashmir Weather Today</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 16, marginBottom: 40 }}>
              {Object.entries(WEATHER_DATA).map(([city, w]) => (
                <div key={city} className="weather-widget" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{city}</div>
                      <div style={{ fontSize: '2rem', fontFamily: 'Cormorant Garamond', fontWeight: 700 }}>{w.temp}°C</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{w.condition}</div>
                    </div>
                    <span style={{ fontSize: '2rem' }}>{w.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            {bookings.length > 0 && (
              <>
                <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', marginBottom: 20 }}>Recent Bookings</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {bookings.slice(-3).reverse().map((b, i) => (
                    <div key={i} className="glass-card" style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, var(--kashmir-teal), var(--kashmir-gold))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                          {b.type === 'hotel' ? '🏨' : b.type === 'restaurant' ? '🍽' : b.type === 'vehicle' ? '🚗' : b.type === 'crop' ? '🌾' : '📦'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{getBookingName(b)}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{b.type} · {getBookingDate(b)}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <span style={getPaymentModeBadgeStyle()}>{paymentModeLabels[b.paymentMode] || 'Payment'}</span>
                        <span style={getPaymentStatusBadgeStyle(b.paymentStatus)}>{paymentStatusLabels[b.paymentStatus] || b.paymentStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {bookings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 24 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗺</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', marginBottom: 10 }}>No Bookings Yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Start your Kashmir journey today!</p>
                <Link to="/tourism" className="btn-teal" style={{ textDecoration: 'none' }}>Explore Tourism →</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', marginBottom: 24 }}>My Bookings & Orders</h2>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 24 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', marginBottom: 10 }}>No Bookings Yet</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Your bookings will appear here.</p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                  <Link to="/tourism" className="btn-teal" style={{ textDecoration: 'none' }}>Book Tourism</Link>
                  <Link to="/agriculture" style={{ textDecoration: 'none', padding: '12px 28px', border: '2px solid var(--kashmir-teal)', borderRadius: 50, color: 'var(--kashmir-teal)', fontFamily: 'Nunito', fontWeight: 700 }}>Buy Crops</Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[...bookings].reverse().map((b, i) => (
                  <div key={i} className="glass-card" style={{ padding: '20px 26px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{ width: 52, height: 52, flexShrink: 0, background: 'linear-gradient(135deg, var(--kashmir-teal), var(--kashmir-deep))', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                          {b.type === 'hotel' ? '🏨' : b.type === 'restaurant' ? '🍽' : b.type === 'vehicle' ? '🚗' : b.type === 'crop' ? '🌾' : '📦'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{getBookingName(b)}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{b.type}</div>
                          {b.checkIn && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Check-in: {b.checkIn} · Out: {b.checkOut}</div>}
                          {b.qty && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Quantity: {b.qty} · Total: ₹{b.total?.toLocaleString()}</div>}
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>Booked on {getBookingDate(b)}</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                            <span style={getPaymentModeBadgeStyle()}>{paymentModeLabels[b.paymentMode] || 'Payment Option'}</span>
                            <span style={getPaymentStatusBadgeStyle(b.paymentStatus)}>{paymentStatusLabels[b.paymentStatus] || b.paymentStatus || 'Recorded'}</span>
                            {b.paymentReference && <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, background: '#edf2f7', color: '#4a5568', border: '1px solid #cbd5e0' }}>Ref: {b.paymentReference}</span>}
                          </div>
                          {b.paymentNote && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 8, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span>ℹ️</span> <span>{b.paymentNote}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="badge badge-teal">Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ maxWidth: 500 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', marginBottom: 24 }}>Profile Settings</h2>
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, var(--kashmir-teal), var(--kashmir-gold))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 12px' }}>{user.avatar}</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.email}</div>
              </div>
              {[
                { label: 'Full Name', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Account Type', value: 'User' },
                { label: 'Member Since', value: user.joinDate },
              ].map(field => (
                <div key={field.label} className="form-group">
                  <label className="form-label">{field.label}</label>
                  <input className="form-input" value={field.value} readOnly style={{ background: 'var(--kashmir-light)', cursor: 'default' }}/>
                </div>
              ))}
              <button className="btn-teal" style={{ width: '100%', padding: '12px' }}>Update Profile</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
