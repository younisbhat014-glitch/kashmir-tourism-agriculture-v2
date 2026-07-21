import React, { useState, useEffect } from 'react';

export default function PaymentCheckoutModal({ item, total, method, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState(method || 'card');
  const [processing, setProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [transactionId] = useState(() => `KPAY-${Math.floor(10000000 + Math.random() * 90000000)}`);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  // UPI Form State
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('');

  const loadingMessages = [
    'Initializing secure handshakes...',
    'Encrypting credentials (AES-256)...',
    'Contacting card issuer / payment gateway...',
    'Authorizing transaction of ₹' + Number(total || 0).toLocaleString('en-IN') + '...',
    'Capturing payment settlement...'
  ];

  useEffect(() => {
    if (processing) {
      const interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev >= loadingMessages.length - 1) {
            clearInterval(interval);
            setProcessing(false);
            setSuccess(true);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
      return () => clearInterval(interval);
    }
  }, [processing]);

  const handlePay = (e) => {
    e.preventDefault();
    if (activeTab === 'card') {
      if (!cardNumber || !expiry || !cvv || !cardName) return;
    } else if (activeTab === 'upi') {
      if (!upiId) return;
    } else if (activeTab === 'netbanking') {
      if (!selectedBank) return;
    }
    setProcessing(true);
    setLoadingStep(0);
  };

  const handleComplete = () => {
    let paymentNote = '';
    if (activeTab === 'card') {
      paymentNote = `Paid via Card (ending in ${cardNumber.slice(-4)}) - Name: ${cardName}`;
    } else if (activeTab === 'upi') {
      paymentNote = `Paid via UPI - VPA: ${upiId}`;
    } else if (activeTab === 'netbanking') {
      paymentNote = `Paid via Net Banking - Bank: ${selectedBank}`;
    } else {
      paymentNote = `Paid via Online Wallet`;
    }

    onSuccess({
      paymentStatus: 'paid',
      paymentProvider: 'Kashmir Portal Secure Gateway',
      paymentReference: transactionId,
      paymentNote,
    });
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 53, 41, 0.45)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Nunito, sans-serif',
      padding: '16px',
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '540px',
        maxHeight: 'calc(100vh - 32px)',
        borderRadius: '24px',
        boxShadow: '0 24px 64px rgba(15, 53, 41, 0.18)',
        border: '1px solid #dfe8e1',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f3529, #1a6658)',
          padding: '24px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#c9a84c', fontWeight: 800 }}>Kashmir Gateway</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Cormorant Garamond, serif' }}>Secure Checkout Portal</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>Amount to Pay</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#e8c96c' }}>₹{Number(total || 0).toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>

        {/* PROCESSING SCREEN */}
        {processing && (
          <div style={{ padding: '60px 24px', textAlign: 'center', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              width: '54px',
              height: '54px',
              border: '4px solid rgba(26,122,110,0.12)',
              borderTop: '4px solid #1a7a6e',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '24px'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <div style={{ fontWeight: 800, color: '#0f3529', fontSize: '1.1rem', marginBottom: '8px' }}>Processing Payment</div>
            <div style={{ fontSize: '0.86rem', color: '#666', minHeight: '20px' }}>{loadingMessages[loadingStep]}</div>
          </div>
        )}

        {/* SUCCESS SCREEN */}
        {success && (
          <div style={{ padding: '40px 24px', textAlign: 'center', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: '#eef6f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              color: '#1a7a6e',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              border: '2px solid #1a7a6e'
            }}>✓</div>
            <div style={{ fontWeight: 800, color: '#0f3529', fontSize: '1.4rem', marginBottom: '8px', fontFamily: 'Cormorant Garamond, serif' }}>Payment Successful!</div>
            <div style={{ fontSize: '0.82rem', color: '#777', marginBottom: '24px' }}>Transaction ID: <strong>{transactionId}</strong></div>
            
            <div style={{ background: '#f4f7f3', border: '1px solid #dfe8e1', borderRadius: '16px', padding: '16px', width: '100%', marginBottom: '28px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: '#666' }}>Beneficiary</span>
                <span style={{ fontWeight: 700, color: '#0f3529' }}>Kashmir Portal Services</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: '#666' }}>Service Name</span>
                <span style={{ fontWeight: 700, color: '#0f3529' }}>{item || 'Portal Booking'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#666' }}>Amount Paid</span>
                <span style={{ fontWeight: 800, color: '#1a7a6e' }}>₹{Number(total || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button onClick={handleComplete} style={{
              background: 'linear-gradient(135deg, #1a7a6e, #0f3529)',
              color: '#fff',
              border: 'none',
              padding: '12px 36px',
              borderRadius: '50px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(26,122,110,0.25)'
            }}>
              Confirm Booking & Close
            </button>
          </div>
        )}

        {/* GATEWAY FORMS */}
        {!processing && !success && (
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #dfe8e1', background: '#f8faf8' }}>
              {[
                { id: 'card', label: '💳 Card' },
                { id: 'upi', label: '📱 UPI' },
                { id: 'netbanking', label: '🏦 Net Banking' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    flex: 1,
                    padding: '14px 10px',
                    border: 'none',
                    background: activeTab === t.id ? '#ffffff' : 'none',
                    fontWeight: activeTab === t.id ? 800 : 600,
                    color: activeTab === t.id ? '#1a7a6e' : '#666',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    borderBottom: activeTab === t.id ? '3px solid #1a7a6e' : '3px solid transparent',
                    transition: 'all 0.15s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content area */}
            <div style={{ padding: '24px', minHeight: '280px' }}>
              <form onSubmit={handlePay}>
                
                {/* 1. CARD FORM */}
                {activeTab === 'card' && (
                  <div>
                    {/* Simulated Credit Card Preview */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1a6658, #0f3529)',
                      borderRadius: '16px',
                      padding: '20px',
                      color: '#ffffff',
                      marginBottom: '20px',
                      boxShadow: '0 8px 24px rgba(15,53,41,0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '145px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', letterSpacing: '1px', opacity: 0.8 }}>PREMIUM PAYEE CARD</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', fontStyle: 'italic', color: '#c9a84c' }}>
                          {cardNumber.startsWith('4') ? 'Visa' : cardNumber.startsWith('5') ? 'Mastercard' : 'Rupay'}
                        </span>
                      </div>
                      <div style={{ fontSize: '1.25rem', letterSpacing: '2.5px', fontWeight: 700, margin: '14px 0' }}>
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.55rem', opacity: 0.6, textTransform: 'uppercase' }}>Cardholder</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px' }}>{cardName.toUpperCase() || 'YOUR NAME HERE'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.55rem', opacity: 0.6, textTransform: 'uppercase' }}>Expires</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{expiry || 'MM/YY'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333', display: 'block', marginBottom: '4px' }}>Cardholder Name</label>
                        <input
                          required
                          type="text"
                          placeholder="As printed on card"
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #dfe8e1', borderRadius: '10px', outline: 'none', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333', display: 'block', marginBottom: '4px' }}>Card Number</label>
                        <input
                          required
                          maxLength="19"
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #dfe8e1', borderRadius: '10px', outline: 'none', fontSize: '0.88rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333', display: 'block', marginBottom: '4px' }}>Expiry Date</label>
                        <input
                          required
                          maxLength="5"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={e => {
                            let val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                            setExpiry(val);
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #dfe8e1', borderRadius: '10px', outline: 'none', fontSize: '0.88rem', textAlign: 'center' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333', display: 'block', marginBottom: '4px' }}>CVV</label>
                        <input
                          required
                          maxLength="3"
                          type="password"
                          placeholder="•••"
                          value={cvv}
                          onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #dfe8e1', borderRadius: '10px', outline: 'none', fontSize: '0.88rem', textAlign: 'center' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. UPI FORM */}
                {activeTab === 'upi' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-block',
                      border: '1px solid #e7e0c8',
                      borderRadius: '16px',
                      padding: '16px',
                      marginBottom: '20px',
                      background: 'rgba(201, 168, 76, 0.04)'
                    }}>
                      {/* Styled Simulated QR Code */}
                      <svg width="120" height="120" viewBox="0 0 100 100" style={{ display: 'block', margin: '0 auto' }}>
                        <path d="M5,5 h30 v30 h-30 z M15,15 h10 v10 h-10 z" fill="#0f3529" />
                        <path d="M65,5 h30 v30 h-30 z M75,15 h10 v10 h-10 z" fill="#0f3529" />
                        <path d="M5,65 h30 v30 h-30 z M15,75 h10 v10 h-10 z" fill="#0f3529" />
                        <path d="M45,15 h10 v10 h-10 z M45,45 h10 v10 h-10 z M15,45 h10 v10 h-10 z M75,45 h10 v10 h-10 z" fill="#0f3529" />
                        <path d="M65,65 h10 v10 h-10 z M85,75 h10 v10 h-10 z M65,85 h30 v10 h-30 z" fill="#1a7a6e" />
                        <rect x="42" y="5" width="6" height="6" fill="#c9a84c" />
                        <rect x="5" y="42" width="6" height="6" fill="#c9a84c" />
                        <rect x="89" y="42" width="6" height="6" fill="#c9a84c" />
                      </svg>
                      <div style={{ fontSize: '0.72rem', color: '#88621a', fontWeight: 800, marginTop: '8px', letterSpacing: '0.5px' }}>SCAN WITH ANY UPI APP</div>
                    </div>

                    <div style={{ maxWidth: '320px', margin: '0 auto', textAlign: 'left' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333', display: 'block', marginBottom: '4px' }}>Or Enter UPI VPA Address</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          required
                          type="text"
                          placeholder="username@upi"
                          value={upiId}
                          onChange={e => {
                            setUpiId(e.target.value);
                            setUpiVerified(false);
                          }}
                          style={{ flex: 1, padding: '10px 12px', border: '1px solid #dfe8e1', borderRadius: '10px', outline: 'none', fontSize: '0.88rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => { if (upiId.includes('@')) setUpiVerified(true); }}
                          style={{
                            background: upiVerified ? '#eef6f2' : '#f0f0f0',
                            border: upiVerified ? '1px solid #1a7a6e' : '1px solid #ddd',
                            color: upiVerified ? '#1a7a6e' : '#666',
                            padding: '0 16px',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {upiVerified ? 'Verified ✓' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. NET BANKING */}
                {activeTab === 'netbanking' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333', display: 'block', marginBottom: '12px' }}>Select from Popular Indian Banks</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '18px' }}>
                      {[
                        { name: 'J&K Bank', color: '#1B5E20', text: '#fff' },
                        { name: 'SBI', color: '#0084B4', text: '#fff' },
                        { name: 'HDFC', color: '#004C8F', text: '#fff' },
                        { name: 'ICICI', color: '#F37021', text: '#fff' },
                        { name: 'Axis Bank', color: '#97144D', text: '#fff' }
                      ].map(bank => (
                        <button
                          key={bank.name}
                          type="button"
                          onClick={() => setSelectedBank(bank.name)}
                          style={{
                            padding: '12px 6px',
                            border: selectedBank === bank.name ? '2px solid #c9a84c' : '1px solid #dfe8e1',
                            background: selectedBank === bank.name ? 'rgba(201,168,76,0.08)' : '#ffffff',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.1s'
                          }}
                        >
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: bank.color,
                            color: bank.text,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: 900
                          }}>
                            {bank.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f3529' }}>{bank.name}</span>
                        </button>
                      ))}
                    </div>

                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333', display: 'block', marginBottom: '4px' }}>Or select other Bank</label>
                    <select
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #dfe8e1', borderRadius: '10px', fontSize: '0.88rem', outline: 'none', background: '#fff' }}
                    >
                      <option value="">-- Choose Bank --</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Canara Bank">Canara Bank</option>
                      <option value="Yes Bank">Yes Bank</option>
                      <option value="Union Bank of India">Union Bank of India</option>
                    </select>
                  </div>
                )}

                {/* Bottom buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '30px', borderTop: '1px solid #dfe8e1', paddingTop: '18px' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#fafafa',
                      border: '1px solid #dfe8e1',
                      borderRadius: '50px',
                      fontWeight: 700,
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '0.88rem'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 2,
                      padding: '12px',
                      background: 'linear-gradient(135deg, #1a7a6e, #0f3529)',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '50px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      boxShadow: '0 8px 18px rgba(26,122,110,0.15)'
                    }}
                  >
                    Pay ₹{Number(total || 0).toLocaleString('en-IN')} Secured ✓
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        </div>
        {/* end scrollable body */}

      </div>
    </div>
  );
}
