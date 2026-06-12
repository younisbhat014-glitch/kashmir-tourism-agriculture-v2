import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { API } from '../utils/api';
import ImagePickerField from '../components/ui/ImagePickerField';

const getToken = () => localStorage.getItem('kashmir_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

const MONTHLY_DATA = [
  { month: 'Jan', tourists: 42000, revenue: 180000, bookings: 320 },
  { month: 'Feb', tourists: 38000, revenue: 165000, bookings: 290 },
  { month: 'Mar', tourists: 55000, revenue: 240000, bookings: 410 },
  { month: 'Apr', tourists: 72000, revenue: 320000, bookings: 580 },
  { month: 'May', tourists: 89000, revenue: 410000, bookings: 720 },
  { month: 'Jun', tourists: 95000, revenue: 450000, bookings: 810 },
  { month: 'Jul', tourists: 102000, revenue: 490000, bookings: 890 },
  { month: 'Aug', tourists: 98000, revenue: 470000, bookings: 850 },
  { month: 'Sep', tourists: 88000, revenue: 400000, bookings: 760 },
  { month: 'Oct', tourists: 76000, revenue: 350000, bookings: 640 },
  { month: 'Nov', tourists: 48000, revenue: 210000, bookings: 380 },
  { month: 'Dec', tourists: 62000, revenue: 280000, bookings: 520 },
];

const PIE_DATA = [
  { name: 'Hotels', value: 38, color: '#1A7A6E' },
  { name: 'Restaurants', value: 22, color: '#C9A84C' },
  { name: 'Vehicles', value: 18, color: '#4A90B8' },
  { name: 'Agriculture', value: 22, color: '#2D5016' },
];

// Add/Edit Modal
function ItemModal({ type, item, onClose, onSave }) {
  const [form, setForm] = useState(item || {});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fields = {
    hotel: [
      { key: 'name', label: 'Hotel Name', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'price', label: 'Price/Night (₹)', type: 'number' },
      { key: 'stars', label: 'Stars (1-5)', type: 'number' },
      { key: 'rating', label: 'Rating (1-5)', type: 'number' },
      { key: 'image', label: 'Image URL', type: 'text' },
      { key: 'amenities', label: 'Amenities (comma separated)', type: 'text' },
    ],
    crop: [
      { key: 'name', label: 'Crop Name', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'price', label: 'Price (₹)', type: 'number' },
      { key: 'unit', label: 'Unit (kg/gram/litre)', type: 'text' },
      { key: 'seller', label: 'Seller Name', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'stock', label: 'Stock', type: 'number' },
      { key: 'image', label: 'Image URL', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
    ],
    vehicle: [
      { key: 'name', label: 'Vehicle Name', type: 'text' },
      { key: 'type', label: 'Type (SUV/Sedan/Bike/Bus/Boat)', type: 'text' },
      { key: 'capacity', label: 'Capacity (seats)', type: 'number' },
      { key: 'pricePerDay', label: 'Price/Day (₹)', type: 'number' },
      { key: 'image', label: 'Image URL', type: 'text' },
      { key: 'features', label: 'Features (comma separated)', type: 'text' },
    ],
    machine: [
      { key: 'name', label: 'Machine Name', type: 'text' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'owner', label: 'Owner / Supplier', type: 'text' },
      { key: 'hp', label: 'Horsepower (optional)', type: 'number' },
      { key: 'rentPerDay', label: 'Rent/Day (₹)', type: 'number' },
      { key: 'buyPrice', label: 'Buy Price (₹)', type: 'number' },
      { key: 'image', label: 'Image URL', type: 'text' },
      { key: 'available', label: 'Available for rent/buy', type: 'checkbox' },
    ],
    restaurant: [
      { key: 'name', label: 'Restaurant Name', type: 'text' },
      { key: 'cuisine', label: 'Cuisine Type', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'price', label: 'Price Range (₹/₹₹/₹₹₹)', type: 'text' },
      { key: 'specialty', label: 'Specialty Dish', type: 'text' },
      { key: 'timings', label: 'Timings', type: 'text' },
      { key: 'image', label: 'Image URL', type: 'text' },
    ],
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem' }}>
            {item?._id ? '✏️ Edit' : '➕ Add'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {(fields[type] || []).map(f => (
            <div key={f.key} className="form-group" style={{ gridColumn: f.key === 'image' || f.key === 'description' || f.key === 'amenities' || f.key === 'features' ? '1/-1' : 'auto' }}>
              {f.key === 'image' ? (
                <ImagePickerField value={form[f.key] || ''} onChange={value => set(f.key, value)} />
              ) : f.type === 'checkbox' ? (
                <>
                  <label className="form-label">{f.label}</label>
                  <input
                    type="checkbox"
                    checked={form[f.key] !== false}
                    onChange={e => set(f.key, e.target.checked)}
                    style={{ width: 20, height: 20, accentColor: 'var(--kashmir-teal)' }}
                  />
                </>
              ) : (
                <>
                  <label className="form-label">{f.label}</label>
                  <input
                    className="form-input"
                    type={f.type}
                    value={form[f.key] || ''}
                    onChange={e => set(f.key, e.target.value)}
                    placeholder={f.label}
                  />
                </>
              )}
            </div>
          ))}
        </div>
        <button className="btn-teal" style={{ width: '100%', padding: '13px', marginTop: 16, fontSize: '1rem' }}
          onClick={() => onSave(form)}>
          {item?._id ? 'Update' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)} ✓
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, totalHotels: 0, totalCrops: 0, totalVehicles: 0, totalMachines: 0 });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [crops, setCrops] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [machines, setMachines] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'hotels') fetchHotels();
    if (activeTab === 'crops') fetchCrops();
    if (activeTab === 'vehicles') fetchVehicles();
    if (activeTab === 'machines') fetchMachines();
    if (activeTab === 'restaurants') fetchRestaurants();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/admin/stats`, { headers: authHeaders() });
      const data = await res.json();
      setStats(data);
    } catch (err) { console.log(err); }
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API}/admin/users`, { headers: authHeaders() });
    setUsers(await res.json());
  };

  const fetchBookings = async () => {
    const res = await fetch(`${API}/admin/bookings`, { headers: authHeaders() });
    setBookings(await res.json());
  };

  const fetchHotels = async () => {
    const res = await fetch(`${API}/hotels`);
    setHotels(await res.json());
  };

  const fetchCrops = async () => {
    const res = await fetch(`${API}/crops`);
    setCrops(await res.json());
  };

  const fetchVehicles = async () => {
    const res = await fetch(`${API}/vehicles`);
    setVehicles(await res.json());
  };

  const fetchMachines = async () => {
    const res = await fetch(`${API}/machines`);
    setMachines(await res.json());
  };

  const fetchRestaurants = async () => {
    const res = await fetch(`${API}/restaurants`);
    setRestaurants(await res.json());
  };

  const handleSave = async (type, form, id) => {
    setLoading(true);
    const url = id ? `${API}/${type}s/${id}` : `${API}/${type}s`;
    const method = id ? 'PUT' : 'POST';
    // Handle comma separated arrays
    if (form.amenities && typeof form.amenities === 'string') form.amenities = form.amenities.split(',').map(a => a.trim());
    if (form.features && typeof form.features === 'string') form.features = form.features.split(',').map(f => f.trim());
    await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
    setLoading(false);
    setModal(null);
    if (type === 'hotel') fetchHotels();
    if (type === 'crop') fetchCrops();
    if (type === 'vehicle') fetchVehicles();
    if (type === 'machine') fetchMachines();
    if (type === 'restaurant') fetchRestaurants();
    fetchStats();
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Delete karna chahte ho?')) return;
    await fetch(`${API}/${type}s/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (type === 'hotel') fetchHotels();
    if (type === 'crop') fetchCrops();
    if (type === 'vehicle') fetchVehicles();
    if (type === 'machine') fetchMachines();
    if (type === 'restaurant') fetchRestaurants();
    fetchStats();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('User delete karna chahte ho?')) return;
    await fetch(`${API}/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() });
    fetchUsers();
  };

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'users', label: '👥 Users' },
    { id: 'bookings', label: '📋 Bookings' },
    { id: 'hotels', label: '🏨 Hotels' },
    { id: 'crops', label: '🌾 Crops' },
    { id: 'vehicles', label: '🚗 Vehicles' },
    { id: 'machines', label: '🚜 Machines' },
    { id: 'restaurants', label: '🍽 Restaurants' },
    { id: 'analytics', label: '📈 Analytics' },
  ];

  const statCards = [
    { icon: '👥', label: 'Total Users', value: stats.totalUsers || 0, color: 'var(--kashmir-teal)' },
    { icon: '📋', label: 'Total Bookings', value: stats.totalBookings || 0, color: 'var(--kashmir-gold)' },
    { icon: '🏨', label: 'Hotels', value: stats.totalHotels || 0, color: 'var(--kashmir-rose)' },
    { icon: '🌾', label: 'Crops', value: stats.totalCrops || 0, color: 'var(--kashmir-forest)' },
    { icon: '🚗', label: 'Vehicles', value: stats.totalVehicles || 0, color: 'var(--kashmir-sky)' },
    { icon: '🚜', label: 'Machines', value: stats.totalMachines || 0, color: 'var(--kashmir-forest)' },
    { icon: '👑', label: 'Admins', value: stats.totalAdmins || 0, color: '#8B5CF6' },
  ];

  return (
    <div className="admin-dashboard" style={{ minHeight: '100vh', background: 'var(--kashmir-light)', paddingTop: 80 }}>
      {/* Header */}
      <div className="admin-dashboard-hero" style={{ background: 'linear-gradient(135deg, #0D1B0A, var(--kashmir-deep), var(--kashmir-teal))', padding: '36px 5%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, background: 'rgba(201,168,76,0.07)', borderRadius: '50%' }} />
        <div className="admin-dashboard-hero-inner" style={{ position: 'relative', zIndex: 1, maxWidth: 1300, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div className="admin-dashboard-profile" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 68, height: 68, background: 'linear-gradient(135deg, var(--kashmir-gold), #E8C96C)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👑</div>
            <div>
              <div style={{ fontFamily: 'Dancing Script', fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)' }}>Admin Panel</div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: 'white', fontWeight: 700 }}>{user.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Live · Kashmir Portal</span>
              </div>
            </div>
          </div>
          <div className="admin-dashboard-mini-stats" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { val: stats.totalUsers || 0, label: 'Users' },
              { val: stats.totalBookings || 0, label: 'Bookings' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 22px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', fontWeight: 700, color: 'var(--kashmir-gold)' }}>{s.val}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-dashboard-tabs" style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', position: 'sticky', top: 72, zIndex: 50 }}>
        <div className="admin-dashboard-tabs-inner" style={{ maxWidth: 1300, margin: '0 auto', padding: '0 5%', display: 'flex', gap: 2, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.id} className="admin-dashboard-tab-btn" onClick={() => setActiveTab(t.id)} style={{
              padding: '15px 16px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap',
              color: activeTab === t.id ? 'var(--kashmir-deep)' : 'var(--text-secondary)',
              borderBottom: activeTab === t.id ? '3px solid var(--kashmir-gold)' : '3px solid transparent',
              transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="admin-dashboard-content" style={{ maxWidth: 1300, margin: '0 auto', padding: '36px 5%' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div className="admin-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 20, marginBottom: 32 }}>
              {statCards.map(card => (
                <div key={card.label} className="glass-card admin-stat-card" style={{ padding: '24px' }}>
                  <div style={{ width: 48, height: 48, background: `${card.color}18`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 12 }}>{card.icon}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', fontWeight: 700, color: card.color }}>{card.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{card.label}</div>
                </div>
              ))}
            </div>

            <div className="admin-chart-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              <div className="glass-card admin-chart-card" style={{ padding: '28px' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', marginBottom: 20 }}>Monthly Tourist Traffic</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={MONTHLY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => v.toLocaleString()} />
                    <Line type="monotone" dataKey="tourists" stroke="var(--kashmir-teal)" strokeWidth={3} dot={{ fill: 'var(--kashmir-teal)', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="glass-card admin-chart-card" style={{ padding: '28px' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', marginBottom: 20 }}>Booking Split</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {PIE_DATA.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                      <span style={{ fontWeight: 700 }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 24 }}>User Management ({users.length})</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 20, overflow: 'hidden', fontSize: '0.88rem' }}>
                <thead style={{ background: 'var(--kashmir-deep)' }}>
                  <tr>
                    {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: 'white', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '13px 18px', fontWeight: 700 }}>{u.name}</td>
                      <td style={{ padding: '13px 18px', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '13px 18px' }}><span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-teal'}`}>{u.role}</span></td>
                      <td style={{ padding: '13px 18px', color: 'var(--text-secondary)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {u.role !== 'admin' && (
                            <button onClick={async () => { await fetch(`${API}/admin/make-admin/${u._id}`, { method: 'PUT', headers: authHeaders() }); fetchUsers(); }} style={{ padding: '5px 12px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, color: '#A07820', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Make Admin</button>
                          )}
                          <button onClick={() => handleDeleteUser(u._id)} style={{ padding: '5px 12px', background: 'rgba(196,112,106,0.1)', border: '1px solid rgba(196,112,106,0.2)', borderRadius: 8, color: 'var(--kashmir-rose)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Koi user nahi hai abhi</div>}
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === 'bookings' && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 24 }}>All Bookings ({bookings.length})</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 20, overflow: 'hidden', fontSize: '0.88rem' }}>
                <thead style={{ background: 'var(--kashmir-deep)' }}>
                  <tr>
                    {['User', 'Type', 'Action', 'Item', 'Date', 'Status'].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: 'white', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={b._id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '13px 18px', fontWeight: 700 }}>{b.user?.name || 'N/A'}</td>
                      <td style={{ padding: '13px 18px' }}><span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{b.type}</span></td>
                      <td style={{ padding: '13px 18px', textTransform: 'capitalize' }}>{b.action || 'book'}</td>
                      <td style={{ padding: '13px 18px', color: 'var(--text-secondary)' }}>{b.itemName}</td>
                      <td style={{ padding: '13px 18px', color: 'var(--text-secondary)' }}>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '13px 18px' }}><span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>✓ {b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Koi booking nahi hai abhi</div>}
            </div>
          </div>
        )}

        {/* HOTELS */}
        {activeTab === 'hotels' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem' }}>Hotels ({hotels.length})</h2>
              <button className="btn-primary" onClick={() => setModal({ type: 'hotel', item: null })} style={{ padding: '10px 24px' }}>+ Add Hotel</button>
            </div>
            <div className="grid-3">
              {hotels.map(hotel => (
                <div key={hotel._id} className="glass-card" style={{ overflow: 'hidden' }}>
                  <img src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'} alt={hotel.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{hotel.name}</h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8 }}>📍 {hotel.location}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800, color: 'var(--kashmir-teal)' }}>₹{hotel.price?.toLocaleString()}/night</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setModal({ type: 'hotel', item: hotel })} style={{ padding: '5px 12px', background: 'rgba(26,122,110,0.1)', border: '1px solid rgba(26,122,110,0.2)', borderRadius: 8, color: 'var(--kashmir-teal)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete('hotel', hotel._id)} style={{ padding: '5px 12px', background: 'rgba(196,112,106,0.1)', border: '1px solid rgba(196,112,106,0.2)', borderRadius: 8, color: 'var(--kashmir-rose)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hotels.length === 0 && <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 20, color: 'var(--text-secondary)' }}>Koi hotel nahi — "+ Add Hotel" se add karo!</div>}
          </div>
        )}

        {/* CROPS */}
        {activeTab === 'crops' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem' }}>Crops ({crops.length})</h2>
              <button className="btn-primary" onClick={() => setModal({ type: 'crop', item: null })} style={{ padding: '10px 24px' }}>+ Add Crop</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 20, overflow: 'hidden', fontSize: '0.88rem' }}>
                <thead style={{ background: 'var(--kashmir-deep)' }}>
                  <tr>
                    {['Crop', 'Category', 'Seller', 'Location', 'Price', 'Stock', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: 'white', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {crops.map((crop, i) => (
                    <tr key={crop._id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '13px 18px', fontWeight: 700 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={crop.image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                          {crop.name}
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px' }}><span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{crop.category}</span></td>
                      <td style={{ padding: '13px 18px', color: 'var(--text-secondary)' }}>{crop.seller}</td>
                      <td style={{ padding: '13px 18px', color: 'var(--text-secondary)' }}>📍 {crop.location}</td>
                      <td style={{ padding: '13px 18px', fontWeight: 700, color: 'var(--kashmir-teal)' }}>₹{crop.price}/{crop.unit}</td>
                      <td style={{ padding: '13px 18px', fontWeight: 700, color: crop.stock < 100 ? '#e74c3c' : 'var(--kashmir-forest)' }}>{crop.stock} {crop.unit}</td>
                      <td style={{ padding: '13px 18px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setModal({ type: 'crop', item: crop })} style={{ padding: '5px 12px', background: 'rgba(26,122,110,0.1)', border: '1px solid rgba(26,122,110,0.2)', borderRadius: 8, color: 'var(--kashmir-teal)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => handleDelete('crop', crop._id)} style={{ padding: '5px 12px', background: 'rgba(196,112,106,0.1)', border: '1px solid rgba(196,112,106,0.2)', borderRadius: 8, color: 'var(--kashmir-rose)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {crops.length === 0 && <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 20, color: 'var(--text-secondary)' }}>Koi crop nahi — "+ Add Crop" se add karo!</div>}
            </div>
          </div>
        )}

        {/* VEHICLES */}
        {activeTab === 'vehicles' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem' }}>Vehicles ({vehicles.length})</h2>
              <button className="btn-primary" onClick={() => setModal({ type: 'vehicle', item: null })} style={{ padding: '10px 24px' }}>+ Add Vehicle</button>
            </div>
            <div className="grid-3">
              {vehicles.map(v => (
                <div key={v._id} className="glass-card" style={{ overflow: 'hidden' }}>
                  <img src={v.image || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80'} alt={v.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{v.name}</h3>
                      <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>{v.type}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 10 }}>👥 {v.capacity} seats</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800, color: 'var(--kashmir-teal)' }}>₹{v.pricePerDay}/day</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setModal({ type: 'vehicle', item: v })} style={{ padding: '5px 12px', background: 'rgba(26,122,110,0.1)', border: '1px solid rgba(26,122,110,0.2)', borderRadius: 8, color: 'var(--kashmir-teal)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete('vehicle', v._id)} style={{ padding: '5px 12px', background: 'rgba(196,112,106,0.1)', border: '1px solid rgba(196,112,106,0.2)', borderRadius: 8, color: 'var(--kashmir-rose)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {vehicles.length === 0 && <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 20, color: 'var(--text-secondary)' }}>Koi vehicle nahi — "+ Add Vehicle" se add karo!</div>}
          </div>
        )}

        {/* MACHINES */}
        {activeTab === 'machines' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem' }}>Machines ({machines.length})</h2>
              <button className="btn-primary" onClick={() => setModal({ type: 'machine', item: null })} style={{ padding: '10px 24px' }}>+ Add Machine</button>
            </div>
            <div className="grid-3">
              {machines.map(machine => (
                <div key={machine._id} className="glass-card" style={{ overflow: 'hidden', opacity: machine.available ? 1 : 0.7 }}>
                  <img src={machine.image || 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400&q=80'} alt={machine.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{machine.name}</h3>
                      <span className={`badge ${machine.available ? 'badge-teal' : 'badge-rose'}`} style={{ fontSize: '0.65rem' }}>{machine.available ? 'Available' : 'Unavailable'}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{machine.type} · {machine.owner}</div>
                    <div style={{ fontSize: '0.82rem', marginBottom: 12 }}>
                      <strong style={{ color: 'var(--kashmir-teal)' }}>₹{machine.rentPerDay?.toLocaleString()}/day</strong>
                      <span style={{ color: 'var(--text-secondary)' }}> · Buy ₹{machine.buyPrice?.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setModal({ type: 'machine', item: machine })} style={{ padding: '5px 12px', background: 'rgba(26,122,110,0.1)', border: '1px solid rgba(26,122,110,0.2)', borderRadius: 8, color: 'var(--kashmir-teal)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete('machine', machine._id)} style={{ padding: '5px 12px', background: 'rgba(196,112,106,0.1)', border: '1px solid rgba(196,112,106,0.2)', borderRadius: 8, color: 'var(--kashmir-rose)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {machines.length === 0 && <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 20, color: 'var(--text-secondary)' }}>Koi machine nahi - "+ Add Machine" se add karo!</div>}
          </div>
        )}

        {/* RESTAURANTS */}
        {activeTab === 'restaurants' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem' }}>Restaurants ({restaurants.length})</h2>
              <button className="btn-primary" onClick={() => setModal({ type: 'restaurant', item: null })} style={{ padding: '10px 24px' }}>+ Add Restaurant</button>
            </div>
            <div className="grid-3">
              {restaurants.map(r => (
                <div key={r._id} className="glass-card" style={{ overflow: 'hidden' }}>
                  <img src={r.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80'} alt={r.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{r.name}</h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>🍽 {r.cuisine}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8 }}>📍 {r.location}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, color: 'var(--kashmir-teal)' }}>{r.price}</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setModal({ type: 'restaurant', item: r })} style={{ padding: '5px 12px', background: 'rgba(26,122,110,0.1)', border: '1px solid rgba(26,122,110,0.2)', borderRadius: 8, color: 'var(--kashmir-teal)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete('restaurant', r._id)} style={{ padding: '5px 12px', background: 'rgba(196,112,106,0.1)', border: '1px solid rgba(196,112,106,0.2)', borderRadius: 8, color: 'var(--kashmir-rose)', fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {restaurants.length === 0 && <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 20, color: 'var(--text-secondary)' }}>Koi restaurant nahi — "+ Add Restaurant" se add karo!</div>}
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 28 }}>Analytics & Reports</h2>
            <div className="admin-chart-grid admin-analytics-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="glass-card admin-chart-card" style={{ padding: '28px' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', marginBottom: 20 }}>Monthly Revenue (₹)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={MONTHLY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="var(--kashmir-teal)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="glass-card admin-chart-card" style={{ padding: '28px' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', marginBottom: 20 }}>Monthly Bookings</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={MONTHLY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="bookings" stroke="var(--kashmir-gold)" strokeWidth={3} dot={{ fill: 'var(--kashmir-gold)', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ItemModal
          type={modal.type}
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={(form) => handleSave(modal.type, form, modal.item?._id)}
        />
      )}
    </div>
  );
}
