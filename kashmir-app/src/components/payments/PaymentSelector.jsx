import React from 'react';

const ONLINE_METHODS = [
  { value: 'card', label: 'Debit / Credit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Net Banking' },
  { value: 'wallet', label: 'Wallet' },
];

const getPayLaterCopy = (type, action) => {
  if (type === 'hotel') return { mode: 'pay_at_hotel', label: 'Pay at Hotel', note: 'Customer will pay at hotel check-in or front desk.' };
  if (type === 'restaurant') return { mode: 'pay_at_restaurant', label: 'Pay at Restaurant', note: 'Customer will pay at the restaurant counter.' };
  if (type === 'vehicle') return { mode: 'pay_to_driver', label: 'Pay to Driver', note: 'Customer will pay driver or vehicle provider directly.' };
  if (type === 'crop') return { mode: 'cash_on_delivery', label: 'Cash on Delivery', note: 'Customer will pay farmer or seller at delivery/pickup.' };
  if (type === 'machine' && action === 'rent') return { mode: 'pay_to_owner', label: 'Pay to Owner', note: 'Customer will pay machine owner after availability confirmation.' };
  return { mode: 'pay_to_seller', label: 'Pay to Seller', note: 'Customer will pay seller after order confirmation.' };
};

export const buildPaymentPayload = ({ paymentChoice, paymentMethod, type, action, total }) => {
  const payLater = getPayLaterCopy(type, action);
  const isOnline = paymentChoice === 'online';
  const amount = Number(total || 0);

  return {
    paymentMode: isOnline ? 'online' : payLater.mode,
    paymentMethod: isOnline ? paymentMethod : 'cash',
    paymentStatus: isOnline ? 'initiated' : 'pay_at_location',
    paymentProvider: isOnline ? 'Kashmir Portal Online Payment' : payLater.label,
    paymentReference: isOnline ? `KPAY-${Date.now()}` : '',
    paymentNote: isOnline
      ? 'Online payment option selected. Gateway integration can capture real payment after provider keys are configured.'
      : payLater.note,
    total: amount || total,
  };
};

export default function PaymentSelector({ type, action = 'book', total, value, method, onModeChange, onMethodChange }) {
  const payLater = getPayLaterCopy(type, action);
  const isOnline = value === 'online';

  return (
    <div style={{ border: '1px solid #dfe8e1', borderRadius: 14, padding: 16, marginBottom: 20, background: '#fff' }}>
      <div style={{ fontWeight: 800, color: 'var(--kashmir-deep)', marginBottom: 10 }}>Payment Option</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: isOnline ? 14 : 0 }}>
        {[
          { value: 'online', label: 'Pay Online', desc: total ? `Pay estimated amount Rs ${Number(total || 0).toLocaleString('en-IN')}` : 'Choose card, UPI, or net banking' },
          { value: 'later', label: payLater.label, desc: payLater.note },
        ].map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => onModeChange(option.value)}
            style={{
              textAlign: 'left',
              border: value === option.value ? '2px solid var(--kashmir-teal)' : '1px solid #dfe8e1',
              background: value === option.value ? 'rgba(26,122,110,0.08)' : '#fff',
              borderRadius: 12,
              padding: '12px 14px',
              cursor: 'pointer',
              fontFamily: 'Nunito',
            }}
          >
            <div style={{ fontWeight: 800, color: 'var(--kashmir-deep)', marginBottom: 4 }}>{option.label}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{option.desc}</div>
          </button>
        ))}
      </div>

      {isOnline && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
          {ONLINE_METHODS.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => onMethodChange(option.value)}
              style={{
                border: method === option.value ? '2px solid var(--kashmir-gold)' : '1px solid #e7e0c8',
                background: method === option.value ? 'rgba(201,168,76,0.12)' : '#fff',
                color: 'var(--kashmir-deep)',
                borderRadius: 10,
                padding: '10px',
                cursor: 'pointer',
                fontFamily: 'Nunito',
                fontWeight: 800,
                fontSize: '0.8rem',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
