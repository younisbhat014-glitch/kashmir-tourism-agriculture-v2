import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { CROP_CALENDAR } from '../data/appData';
import { createCropAPI, getCropsAPI, getMachinesAPI } from '../utils/api';
import ImagePickerField from '../components/ui/ImagePickerField';

function SellModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ cropName: '', category: 'Fruit', quantity: '', unit: 'kg', price: '', location: '', image: '', description: '', organic: false });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem' }}>🌾 List Your Produce</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Crop / Produce Name</label>
            <input className="form-input" placeholder="e.g. Kashmiri Saffron" value={form.cropName} onChange={e => set('cropName', e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
              {['Fruit','Vegetable','Grain','Spice','Dry Fruit','Oil','Other'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Unit</label>
            <select className="form-select" value={form.unit} onChange={e => set('unit', e.target.value)}>
              {['kg','gram','litre','quintal','ton','dozen','piece'].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity Available</label>
            <input className="form-input" type="number" placeholder="e.g. 50" value={form.quantity} onChange={e => set('quantity', e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Price per {form.unit} (₹)</label>
            <input className="form-input" type="number" placeholder="e.g. 450" value={form.price} onChange={e => set('price', e.target.value)}/>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Your Location / Village</label>
            <input className="form-input" placeholder="e.g. Pampore, Pulwama" value={form.location} onChange={e => set('location', e.target.value)}/>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <ImagePickerField value={form.image} onChange={value => set('image', value)} label="Produce Image" />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} placeholder="Describe your produce quality, grade, packaging..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }}/>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.organic} onChange={e => set('organic', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--kashmir-teal)' }}/>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>✅ Organically Grown</span>
            </label>
          </div>
        </div>
        <button className="btn-teal" style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8 }} onClick={() => onSubmit(form)}>
          Submit Listing 🌾
        </button>
      </div>
    </div>
  );
}

function BuyModal({ item, type, action, onClose, onBuy }) {
  const [qty, setQty] = useState(1);
  const isMachineBuy = type === 'machine' && action === 'buy';
  const total = isMachineBuy ? item.buyPrice * qty : type === 'crop' ? item.price * qty : item.rentPerDay * qty;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem' }}>
            {type === 'crop' || isMachineBuy ? '🛒 Buy' : '🚜 Rent'} {item.name}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}>✕</button>
        </div>
        <div style={{ background: 'var(--kashmir-light)', borderRadius: 16, padding: 20, marginBottom: 20, display: 'flex', gap: 16 }}>
          <img src={item.image || CROP_IMAGE_FALLBACK} alt={item.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12 }}/>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              {type === 'crop' ? `📍 ${item.location} · ${item.seller}` : `📍 ${item.owner}`}
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', fontWeight: 700, color: 'var(--kashmir-teal)' }}>
              ₹{type === 'crop' ? `${item.price}/${item.unit}` : isMachineBuy ? item.buyPrice.toLocaleString() : `${item.rentPerDay}/day`}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{type === 'crop' ? `Quantity (${item.unit})` : isMachineBuy ? 'Quantity' : 'Rental Days'}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', background: '#eee', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}>−</button>
            <input type="number" className="form-input" value={qty} onChange={e => setQty(Math.max(1,parseInt(e.target.value)||1))} style={{ textAlign: 'center', width: 80 }}/>
            <button onClick={() => setQty(q => q+1)} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', background: 'var(--kashmir-teal)', color: 'white', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}>+</button>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(26,122,110,0.08), rgba(201,168,76,0.08))', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Unit Price</span>
            <span style={{ fontWeight: 600 }}>₹{isMachineBuy ? item.buyPrice : type === 'crop' ? item.price : item.rentPerDay}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{type === 'crop' || isMachineBuy ? 'Quantity' : 'Days'}</span>
            <span style={{ fontWeight: 600 }}>× {qty}</span>
          </div>
          <div style={{ borderTop: '1px dashed #ddd', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, color: 'var(--kashmir-deep)' }}>Total</span>
            <span style={{ fontWeight: 800, color: 'var(--kashmir-teal)', fontSize: '1.2rem' }}>₹{total.toLocaleString()}</span>
          </div>
        </div>
        <button className="btn-teal" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} onClick={() => onBuy(qty, total)}>
          {type === 'crop' || isMachineBuy ? '🛒 Place Order' : '🚜 Confirm Rental'} — ₹{total.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CROP_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80';
const FARMER_SUPPORT = [
  {
    id: 'kisan-credit-card',
    icon: '🏦',
    title: 'Kisan Credit Card',
    desc: 'Get up to ₹3 lakh credit for farming needs through participating bank branches.',
    overview: 'Kisan Credit Card helps farmers arrange short-term credit for seeds, fertilizers, machinery rent, irrigation and other seasonal farming costs.',
    details: [
      'Visit your nearest J&K Bank or participating bank branch with land and identity documents.',
      'Credit limit depends on crop type, land holding and bank assessment.',
      'Useful for buying inputs before harvest and repaying after produce is sold.',
    ],
    contact: 'Nearest bank branch or local agriculture extension office',
  },
  {
    id: 'crop-insurance',
    icon: '💊',
    title: 'Crop Insurance (PMFBY)',
    desc: 'Pradhan Mantri Fasal Bima Yojana helps protect crops from natural calamities.',
    overview: 'Crop insurance gives financial support when notified crops are damaged due to eligible weather events, pests or natural risks.',
    details: [
      'Enrollment usually happens through banks, Common Service Centres or the official PMFBY channel.',
      'Keep land records, bank details and crop sowing information ready before applying.',
      'Claims are processed according to notified crop, area and government assessment rules.',
    ],
    contact: 'Bank branch, CSC centre or district agriculture office',
  },
  {
    id: 'soil-health-card',
    icon: '🌡',
    title: 'Soil Health Card',
    desc: 'Free soil testing to know nutrient levels and improve crop yield.',
    overview: 'A Soil Health Card reports the nutrient status of your soil and suggests fertilizer use so crops get balanced nutrition.',
    details: [
      'Collect soil samples from different parts of the field and submit them through the local agriculture office.',
      'The report can guide nitrogen, phosphorus, potassium and micronutrient use.',
      'Testing before the season helps reduce waste and improve crop planning.',
    ],
    contact: 'Block agriculture office or soil testing laboratory',
  },
  {
    id: 'drone-spraying',
    icon: '🚁',
    title: 'Drone Spraying',
    desc: 'Modern drone-based pesticide spraying available in select districts.',
    overview: 'Drone spraying can cover fields faster and more evenly, especially where manual spraying is difficult or time consuming.',
    details: [
      'Availability depends on district, crop, weather and approved service providers.',
      'Share crop area, pesticide requirement and field location when requesting service.',
      'Follow safety guidance and avoid spraying during high wind or rain.',
    ],
    contact: 'Local agriculture office or approved custom hiring centre',
  },
  {
    id: 'kvk-training',
    icon: '📚',
    title: 'KVK Training',
    desc: 'Krishi Vigyan Kendra offers training on modern farming techniques.',
    overview: 'KVK training helps farmers learn practical methods for crop management, pest control, protected cultivation and value addition.',
    details: [
      'Training topics change by season and district priority.',
      'Farmers can join demonstrations, workshops and field visits.',
      'Useful for learning improved varieties, orchard care, nursery raising and post-harvest handling.',
    ],
    contact: 'Nearest Krishi Vigyan Kendra',
  },
  {
    id: 'kisan-helpline',
    icon: '📞',
    title: 'Kisan Helpline',
    desc: 'Call 1800-180-1551 for agriculture expert advice.',
    overview: 'The helpline connects farmers with agriculture guidance for crop disease, pest control, weather-related decisions and scheme information.',
    details: [
      'Keep crop name, village, symptoms and field condition details ready before calling.',
      'You can ask about disease control, fertilizer schedule, market guidance and government schemes.',
      'For urgent field problems, also contact the local extension officer.',
    ],
    contact: '1800-180-1551',
  },
];

export default function Agriculture() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const [tab, setTab] = useState(['buy', 'sell', 'machines', 'calendar', 'info'].includes(requestedTab) ? requestedTab : 'buy');
  const [modal, setModal] = useState(null);
  const [sellModal, setSellModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [listedCrops, setListedCrops] = useState([]);
  const [machines, setMachines] = useState([]);
  const { user, addBooking } = useAuth();
  const toast = useToast();
  const allCrops = listedCrops;

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (['buy', 'sell', 'machines', 'calendar', 'info'].includes(requestedTab)) {
      setTab(requestedTab);
    }
  }, [searchParams]);

  useEffect(() => {
    getCropsAPI()
      .then(data => {
        if (Array.isArray(data)) setListedCrops(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    getMachinesAPI()
      .then(data => {
        if (Array.isArray(data)) setMachines(data);
      })
      .catch(() => {});
  }, []);

  const handleBuy = (item, type, action = 'buy') => {
    if (!user) { toast('Please login to purchase!', 'error'); return; }
    setModal({ item, type, action });
  };

  const confirmBuy = async (qty, total) => {
    const result = await addBooking({
      type: modal.type,
      action: modal.action,
      itemId: modal.item._id,
      item: modal.item.name,
      qty,
      total,
    });
    if (!result.success) {
      toast(result.message || 'Booking failed', 'error');
      return;
    }
    toast(`${modal.item.name} ${modal.action === 'rent' ? 'rented' : 'ordered'} successfully! 🌾`, 'success');
    setModal(null);
  };

  const handleSell = async (form) => {
    if (!form.cropName || !form.price || !form.quantity) { toast('Please fill all required fields!', 'error'); return; }
    if (!user) { toast('Please login first!', 'error'); return; }

    const cropPayload = {
      name: form.cropName,
      category: form.category,
      price: Number(form.price),
      unit: form.unit,
      seller: user.name,
      location: form.location || 'Kashmir',
      image: form.image,
      organic: form.organic,
      stock: Number(form.quantity),
      description: form.description,
    };

    try {
      const savedCrop = await createCropAPI(cropPayload);
      if (!savedCrop._id) {
        toast(savedCrop.message || 'Listing save nahi hui. Try again.', 'error');
        return;
      }

      setListedCrops(prev => [savedCrop, ...prev]);
      setFilter('All');
      setTab('buy');
      toast(`${form.cropName} listed successfully! Buyers can now buy it.`, 'success');
      setSellModal(false);
      return;
    } catch {
      toast('Backend connection failed. Listing save nahi hui.', 'error');
      return;
    }
    toast(`${form.cropName} listed successfully! Buyers will contact you soon. 🌸`, 'success');
    setSellModal(false);
  };

  const categories = ['All', ...new Set(allCrops.map(c => c.category))];
  const selectedSupport = FARMER_SUPPORT.find(item => item.id === searchParams.get('support'));

  const tabs = [
    { id: 'buy', label: '🛒 Buy Crops' },
    { id: 'sell', label: '🌾 Sell Produce' },
    { id: 'machines', label: '🚜 Machines' },
    { id: 'calendar', label: '📅 Season Calendar' },
    { id: 'info', label: '💡 Farmer Info' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--kashmir-light)' }}>
      {/* Banner */}
      <div className="page-hero-banner" style={{
        height: 340, position: 'relative', overflow: 'hidden',
        backgroundImage: 'url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(45,80,22,0.9), rgba(0,0,0,0.5))' }}/>
        <div className="page-hero-content" style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%', paddingTop: 80 }}>
          <div className="section-badge" style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', color: 'var(--kashmir-gold)', marginBottom: 12 }}>🌾 Agriculture Hub</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2.5rem,5vw,4rem)', color: 'white', fontWeight: 700, marginBottom: 12 }}>
            Kashmir <span style={{ color: 'var(--kashmir-gold)', fontStyle: 'italic' }}>Agriculture</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', maxWidth: 500 }}>
            Buy fresh produce, sell your harvest, rent farm machinery — connecting Kashmir's farmers with the world.
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
              color: tab === t.id ? 'var(--kashmir-forest)' : 'var(--text-secondary)',
              borderBottom: tab === t.id ? '3px solid var(--kashmir-forest)' : '3px solid transparent',
              transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="page-content-shell" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px' }}>

        {/* BUY CROPS */}
        {tab === 'buy' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setFilter(cat)} style={{
                    padding: '7px 16px', borderRadius: 50, border: 'none', cursor: 'pointer',
                    fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.8rem',
                    background: filter === cat ? 'var(--kashmir-forest)' : 'white',
                    color: filter === cat ? 'white' : 'var(--text-secondary)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="grid-4">
              {allCrops.filter(c => filter === 'All' || c.category === filter).map((crop, i) => (
                <div key={crop._id || crop.id} className="glass-card" style={{ overflow: 'hidden', animation: `slideInCard 0.5s ease ${i*0.06}s both` }}>
                  <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                    <img src={crop.image || CROP_IMAGE_FALLBACK} alt={crop.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={e => e.target.style.transform='scale(1.1)'}
                      onMouseLeave={e => e.target.style.transform='scale(1)'}
                    />
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5 }}>
                      {crop.organic && <span className="badge" style={{ background: 'rgba(45,80,22,0.85)', color: 'white', fontSize: '0.65rem', border: 'none' }}>🌿 Organic</span>}
                    </div>
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{crop.category}</span>
                    </div>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <h3 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{crop.name}</h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', marginBottom: 4 }}>📍 {crop.location}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.74rem', marginBottom: 10, lineHeight: 1.5 }}>{crop.description.slice(0,60)}...</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="price-tag" style={{ fontSize: '1.2rem' }}>₹{crop.price}<span>/{crop.unit}</span></div>
                      <button className="btn-teal" onClick={() => handleBuy(crop, 'crop')} style={{ padding: '7px 14px', fontSize: '0.78rem' }}>Buy</button>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: crop.stock < 100 ? '#e74c3c' : 'var(--kashmir-teal)', marginTop: 8, fontWeight: 600 }}>
                      📦 {crop.stock} {crop.unit} available
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SELL */}
        {tab === 'sell' && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ background: 'linear-gradient(135deg, var(--kashmir-forest), var(--kashmir-teal))', borderRadius: 24, padding: '40px', color: 'white', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}/>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 12 }}>Sell Your Produce 🌾</h2>
              <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: 28 }}>
                List your fresh crops, saffron, apples, walnuts, or any agricultural produce directly. Reach thousands of buyers across India.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                {[
                  { icon: '💰', text: 'Best Price Guarantee' },
                  { icon: '🚚', text: 'Logistics Support' },
                  { icon: '📱', text: 'SMS/WhatsApp Alerts' },
                  { icon: '🤝', text: 'No Commission' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={() => { if (!user) { toast('Please login first!', 'error'); return; } setSellModal(true); }} style={{ fontSize: '1rem', padding: '14px 36px' }}>
                + List Your Produce
              </button>
            </div>
            <div style={{ background: 'white', borderRadius: 20, padding: 28 }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', marginBottom: 20 }}>How It Works</h3>
              {[
                { step: '01', title: 'Register & Login', desc: 'Create your free farmer account on Kashmir Portal.' },
                { step: '02', title: 'List Your Produce', desc: 'Add crop name, quantity, price, and your location.' },
                { step: '03', title: 'Buyers Contact You', desc: 'Verified buyers from across India will reach out.' },
                { step: '04', title: 'Get Paid Directly', desc: 'No middlemen — full payment directly to you.' },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, flexShrink: 0, background: 'linear-gradient(135deg, var(--kashmir-teal), var(--kashmir-gold))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem' }}>{item.step}</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 3 }}>{item.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.87rem' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MACHINES */}
        {tab === 'machines' && (
          <div className="grid-3">
            {machines.map((m, i) => (
              <div key={m._id} className="glass-card" style={{ overflow: 'hidden', animation: `slideInCard 0.5s ease ${i*0.08}s both`, opacity: m.available ? 1 : 0.7 }}>
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', filter: m.available ? 'none' : 'grayscale(50%)' }}
                    onMouseEnter={e => m.available && (e.target.style.transform='scale(1.08)')}
                    onMouseLeave={e => e.target.style.transform='scale(1)'}
                  />
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span className={`badge ${m.available ? 'badge-teal' : 'badge-rose'}`} style={{ fontSize: '0.72rem' }}>
                      {m.available ? '✅ Available' : '❌ Booked'}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>{m.type}</span>
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.02rem', marginBottom: 4 }}>{m.name}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: 8 }}>🏪 {m.owner}</div>
                  {m.hp && <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: 10 }}>⚡ {m.hp} HP</div>}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div style={{ flex: 1, background: 'rgba(26,122,110,0.08)', borderRadius: 10, padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Rent/Day</div>
                      <div style={{ fontWeight: 800, color: 'var(--kashmir-teal)', fontSize: '1rem' }}>₹{m.rentPerDay.toLocaleString()}</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(201,168,76,0.08)', borderRadius: 10, padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Buy Price</div>
                      <div style={{ fontWeight: 800, color: 'var(--kashmir-gold)', fontSize: '0.9rem' }}>₹{(m.buyPrice/100000).toFixed(1)}L</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-teal" style={{ flex: 1, padding: '9px', fontSize: '0.82rem' }} onClick={() => m.available && handleBuy(m, 'machine', 'rent')} disabled={!m.available}>
                      {m.available ? '🚜 Rent' : 'Unavailable'}
                    </button>
                    <button onClick={() => m.available && handleBuy(m, 'machine', 'buy')} style={{ flex: 1, padding: '9px', fontSize: '0.82rem', background: 'none', border: '2px solid var(--kashmir-gold)', color: 'var(--kashmir-forest)', borderRadius: 50, fontFamily: 'Nunito', fontWeight: 700, cursor: m.available ? 'pointer' : 'not-allowed' }}>
                      💰 Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEASON CALENDAR */}
        {tab === 'calendar' && (
          <div>
            <div style={{ background: 'white', borderRadius: 24, padding: 32, overflowX: 'auto' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 8 }}>Kashmir Crop Season Calendar</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 30 }}>Plan your agricultural activities with month-wise sowing and harvest schedule.</p>
              <div style={{ minWidth: 900 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '160px repeat(12, 1fr)', gap: 4, marginBottom: 8 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', padding: '4px 8px' }}>Crop</div>
                  {MONTHS.map(m => (
                    <div key={m} style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--kashmir-deep)', textAlign: 'center', padding: '4px 2px', background: 'var(--kashmir-light)', borderRadius: 6 }}>{m}</div>
                  ))}
                </div>
                {CROP_CALENDAR.map(crop => {
                  const sowMonths = crop.sow.split(/[-,]/).map(m => MONTHS.indexOf(m.trim().slice(0,3)));
                  const harvestMonths = crop.harvest.split(/[-,]/).map(m => MONTHS.indexOf(m.trim().slice(0,3)));
                  const getSowRange = () => {
                    const parts = crop.sow.split('-');
                    if (parts.length === 2) {
                      const s = MONTHS.indexOf(parts[0].trim().slice(0,3));
                      const e = MONTHS.indexOf(parts[1].trim().slice(0,3));
                      return s >= 0 && e >= 0 ? { start: s, end: e } : null;
                    }
                    return null;
                  };
                  const getHarvRange = () => {
                    const parts = crop.harvest.split('-');
                    if (parts.length === 2) {
                      const s = MONTHS.indexOf(parts[0].trim().slice(0,3));
                      const e = MONTHS.indexOf(parts[1].trim().slice(0,3));
                      return s >= 0 && e >= 0 ? { start: s, end: e } : null;
                    }
                    return null;
                  };
                  const sowRange = getSowRange();
                  const harvRange = getHarvRange();
                  return (
                    <div key={crop.crop} style={{ display: 'grid', gridTemplateColumns: '160px repeat(12, 1fr)', gap: 4, marginBottom: 4, alignItems: 'center' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--kashmir-deep)', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: crop.color, flexShrink: 0 }}/>
                        {crop.crop}
                      </div>
                      {MONTHS.map((m, mi) => {
                        const inSow = sowRange && mi >= sowRange.start && mi <= sowRange.end;
                        const inHarv = harvRange && mi >= harvRange.start && mi <= harvRange.end;
                        return (
                          <div key={m} style={{
                            height: 28, borderRadius: 6,
                            background: inSow ? `${crop.color}40` : inHarv ? crop.color : 'rgba(0,0,0,0.04)',
                            border: inSow ? `1px dashed ${crop.color}` : inHarv ? `1px solid ${crop.color}` : '1px solid transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', fontWeight: 700, color: inHarv ? 'white' : inSow ? crop.color : 'transparent',
                          }}>
                            {inHarv ? '🌾' : inSow ? '🌱' : ''}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
                {[
                  { icon: '🌱', label: 'Sowing Period', style: { background: 'rgba(100,200,100,0.2)', border: '1px dashed green', borderRadius: 6, padding: '4px 8px' } },
                  { icon: '🌾', label: 'Harvest Period', style: { background: 'rgba(100,200,100,0.8)', border: '1px solid green', borderRadius: 6, padding: '4px 8px' } },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 600 }}>
                    <div style={item.style}>{item.icon}</div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 16, marginTop: 32 }}>
              {CROP_CALENDAR.map(crop => (
                <div key={crop.crop} className="glass-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: crop.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>🌿</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{crop.crop}</div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>🌱 Sow: <strong>{crop.sow}</strong></div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>🌾 Harvest: <strong>{crop.harvest}</strong></div>
                  <span className="badge" style={{ background: `${crop.color}20`, color: crop.color, border: `1px solid ${crop.color}50`, fontSize: '0.68rem' }}>{crop.season}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FARMER INFO */}
        {tab === 'info' && (
          <div style={{ maxWidth: 800 }}>
            {selectedSupport ? (
              <div>
                <button
                  onClick={() => setSearchParams({ tab: 'info' })}
                  style={{ background: 'none', border: 'none', color: 'var(--kashmir-teal)', fontWeight: 800, cursor: 'pointer', marginBottom: 18, padding: 0 }}
                >
                  ← Back to Farmer Support
                </button>
                <div className="glass-card" style={{ padding: 28, marginBottom: 32 }}>
                  <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>{selectedSupport.icon}</div>
                  <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.1rem', marginBottom: 10 }}>{selectedSupport.title}</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 22 }}>{selectedSupport.overview}</p>
                  <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
                    {selectedSupport.details.map(point => (
                      <div key={point} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        <span style={{ color: 'var(--kashmir-teal)', fontWeight: 900 }}>•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'var(--kashmir-light)', borderRadius: 14, padding: '16px 18px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Contact / Visit</div>
                    <div style={{ fontWeight: 800, color: 'var(--kashmir-forest)' }}>{selectedSupport.contact}</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 24 }}>Farmer Support & Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 32 }}>
                  {FARMER_SUPPORT.map(item => (
                    <div key={item.title} className="glass-card" style={{ padding: '22px' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 10 }}>{item.icon}</div>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: 14 }}>{item.desc}</p>
                      <button
                        className="btn-teal"
                        onClick={() => setSearchParams({ tab: 'info', support: item.id })}
                        style={{ padding: '8px 20px', fontSize: '0.8rem' }}
                      >
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {false && (
              <>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: 24 }}>Farmer Support & Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
              {[
                { icon: '🏦', title: 'Kisan Credit Card', desc: 'Get up to ₹3 lakh credit for farming needs. Apply at J&K Bank branches.', link: 'Apply Online' },
                { icon: '💊', title: 'Crop Insurance (PMFBY)', desc: 'Pradhan Mantri Fasal Bima Yojana — protect your crops from natural calamities.', link: 'Enroll Now' },
                { icon: '🌡', title: 'Soil Health Card', desc: 'Free soil testing to know nutrient levels and improve crop yield.', link: 'Book Test' },
                { icon: '🚁', title: 'Drone Spraying', desc: 'Modern drone-based pesticide spraying available in select districts.', link: 'Book Service' },
                { icon: '📚', title: 'KVK Training', desc: 'Krishi Vigyan Kendra offers free training on modern farming techniques.', link: 'Register' },
                { icon: '📞', title: 'Kisan Helpline', desc: 'Call 1800-180-1551 for free agriculture expert advice 24/7.', link: 'Call Now' },
              ].map(item => (
                <div key={item.title} className="glass-card" style={{ padding: '22px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>{item.icon}</div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: 14 }}>{item.desc}</p>
                  <button className="btn-teal" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>{item.link} →</button>
                </div>
              ))}
            </div>
              </>
            )}
            <div style={{ background: 'linear-gradient(135deg, var(--kashmir-forest), var(--kashmir-teal))', borderRadius: 20, padding: '28px', color: 'white' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.6rem', marginBottom: 8 }}>🌿 Market Price Today</h3>
              <p style={{ opacity: 0.8, marginBottom: 20, fontSize: '0.88rem' }}>Live prices from Kashmir Agricultural Produce Marketing Corporation</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: 12 }}>
                {allCrops.slice(0,6).map(crop => (
                  <div key={crop._id} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>{crop.name.slice(0,16)}</div>
                    <div style={{ fontWeight: 800, color: 'var(--kashmir-gold)', fontSize: '1rem' }}>₹{crop.price}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>per {crop.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {modal && <BuyModal item={modal.item} type={modal.type} action={modal.action} onClose={() => setModal(null)} onBuy={confirmBuy}/>}
      {sellModal && <SellModal onClose={() => setSellModal(false)} onSubmit={handleSell}/>}
    </div>
  );
}
