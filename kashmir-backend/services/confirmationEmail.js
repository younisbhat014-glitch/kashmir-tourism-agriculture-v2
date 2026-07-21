const nodemailer = require('nodemailer');

const tourismTypes = new Set(['hotel', 'restaurant', 'vehicle', 'travel_package', 'package']);
const agricultureTypes = new Set(['crop', 'machine', 'equipment', 'service']);

const categoryLabels = {
  hotel: 'Hotel',
  restaurant: 'Restaurant',
  vehicle: 'Vehicle',
  travel_package: 'Travel Package',
  package: 'Travel Package',
  crop: 'Crop',
  machine: 'Machine',
  equipment: 'Equipment',
  service: 'Equipment',
};

const paymentModeLabels = {
  online: 'Pay Online',
  pay_at_hotel: 'Pay at Hotel',
  pay_at_restaurant: 'Pay at Restaurant',
  pay_to_driver: 'Pay to Driver',
  cash_on_delivery: 'Cash on Delivery',
  pay_to_seller: 'Pay to Seller',
  pay_to_owner: 'Pay to Owner',
};

const paymentMethodLabels = {
  card: 'Debit / Credit Card',
  upi: 'UPI',
  netbanking: 'Net Banking',
  wallet: 'Wallet',
  cash: 'Cash',
  provider: 'Provider Collection',
};

const paymentStatusLabels = {
  pending: 'Payment Pending',
  initiated: 'Online Payment Initiated',
  paid: 'Paid',
  failed: 'Payment Failed',
  pay_at_location: 'Pay at Location',
};

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatAmount = (amount) => {
  if (amount === undefined || amount === null || amount === '') return null;
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) return `Rs ${escapeHtml(amount)}`;
  return `Rs ${numericAmount.toLocaleString('en-IN')}`;
};

const formatDateTime = (booking) => {
  const parts = [];

  if (booking.checkIn) parts.push(`Check-in: ${booking.checkIn}`);
  if (booking.checkOut) parts.push(`Check-out: ${booking.checkOut}`);
  if (booking.date) parts.push(`Date: ${booking.date}`);
  if (booking.time) parts.push(`Time: ${booking.time}`);
  if (booking.from || booking.to) parts.push(`Route: ${booking.from || 'Pickup'} to ${booking.to || 'Drop'}`);

  return parts.length > 0 ? parts.join(' | ') : new Date(booking.createdAt || Date.now()).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });
};

const getQuantityText = (booking) => {
  if (booking.qty) {
    const label = booking.type === 'machine' && booking.action === 'rent' ? 'Rental duration' : 'Quantity';
    const suffix = booking.type === 'machine' && booking.action === 'rent' ? ' day(s)' : '';
    return `${label}: ${booking.qty}${suffix}`;
  }

  if (booking.guests) return `Guests: ${booking.guests}`;
  return null;
};

const getRequestKind = (type) => {
  if (tourismTypes.has(type)) return 'tourism';
  if (agricultureTypes.has(type)) return 'agriculture';
  return 'tourism';
};

const getPaymentInstructions = (booking, kind) => {
  const mode = booking.paymentMode || '';

  if (mode === 'online') {
    if (kind === 'agriculture') {
      return 'Your online payment for the agricultural order has been successfully processed. The seller/farmer has been notified to prepare your items for pickup/delivery. Thank you for supporting local Kashmir farmers!';
    }
    return 'Your online payment has been successfully recorded. Thank you for booking with Kashmir Tourism! Please keep a copy of this booking confirmation for your records.';
  }

  if (mode === 'pay_at_hotel') {
    return 'Payment must be completed at the hotel front desk during check-in. Please carry this Booking ID along with a valid government-issued photo ID card (such as Aadhaar, Passport, or Voter ID) for all guests check-in verification.';
  }

  if (mode === 'pay_at_restaurant') {
    return 'Payment must be completed at the restaurant counter during your visit. Please carry this Booking ID to locate your table reservation.';
  }

  if (mode === 'pay_to_driver') {
    return 'Payment must be completed directly to the driver or vehicle provider at the time of pickup. Please ensure you have this Booking ID and a valid Photo ID ready.';
  }

  if (mode === 'cash_on_delivery') {
    return 'Payment must be made in cash (or the seller\'s preferred local mobile payment option) directly to the farmer or seller at the time of crop delivery or pickup. Please keep this Order ID ready.';
  }

  if (mode === 'pay_to_owner' || mode === 'pay_to_seller') {
    return 'Payment must be completed directly to the seller/owner after confirmation of item availability. Please keep this Order ID ready for verification.';
  }

  if (kind === 'agriculture') {
    return 'Your agricultural request has been recorded and is pending farmer/provider confirmation. Details on pricing, pickup/delivery times, and payment method will be coordinated directly with the provider. Please retain this Order ID.';
  }

  return 'Your booking request is confirmed. Payment will be collected at the venue/location via Cash, UPI, or Card as per the provider\'s accepted payment options. Please present this Booking ID on arrival.';
};

const getStatusLabel = (kind) => (kind === 'agriculture' ? 'Pending Provider Confirmation' : 'Confirmed');

const buildRows = (rows) => rows
  .filter(([, value]) => value !== null && value !== undefined && value !== '')
  .map(([label, value]) => `
    <tr>
      <td style="padding:12px 0;color:#5f6b63;font-size:14px;border-bottom:1px solid #e8eee9;">${escapeHtml(label)}</td>
      <td style="padding:12px 0;color:#18352b;font-size:14px;font-weight:700;text-align:right;border-bottom:1px solid #e8eee9;">${escapeHtml(value)}</td>
    </tr>
  `).join('');

const buildConfirmationEmail = ({ booking, user }) => {
  const type = booking.type || '';
  const kind = getRequestKind(type);
  const category = categoryLabels[type] || categoryLabels[String(type).toLowerCase()] || 'Booking';
  const amount = formatAmount(booking.total);
  const quantityText = getQuantityText(booking);
  const status = getStatusLabel(kind);
  const paymentMode = paymentModeLabels[booking.paymentMode] || 'Payment at Provider';
  const paymentMethod = paymentMethodLabels[booking.paymentMethod] || booking.paymentMethod;
  const paymentStatus = paymentStatusLabels[booking.paymentStatus] || booking.paymentStatus;
  const paymentInstructions = getPaymentInstructions(booking, kind);
  const supportEmail = process.env.SUPPORT_EMAIL || 'info@kashmirportal.gov.in';
  const supportPhone = process.env.SUPPORT_PHONE || '+91-194-2452690';
  const supportAddress = process.env.SUPPORT_ADDRESS || 'Tourist Reception Centre, Srinagar';
  const brandName = process.env.MAIL_BRAND_NAME || 'Kashmir Tourism & Agriculture Portal';

  const rows = buildRows([
    ['User name', user.name],
    ['Registered email', user.email],
    ['Booking/Order ID', booking._id],
    ['Category', category],
    ['Service/Product name', booking.itemName],
    ['Date and time', formatDateTime(booking)],
    ['Guests/quantity/rental duration', quantityText],
    ['Estimated amount', amount],
    ['Payment option', paymentMode],
    ['Payment method', paymentMethod],
    ['Payment status', paymentStatus],
    ['Payment reference', booking.paymentReference],
    ['Status', status],
  ]);

  const preheader = booking.paymentMode === 'online'
    ? 'Your online payment request has been recorded.'
    : kind === 'agriculture'
    ? 'Your agriculture request has been received.'
    : 'Your booking request is confirmed.';

  const subject = `${category} confirmation - ${booking._id}`;

  const text = [
    `${brandName}`,
    '',
    preheader,
    '',
    `User name: ${user.name}`,
    `Registered email: ${user.email}`,
    `Booking/Order ID: ${booking._id}`,
    `Category: ${category}`,
    `Service/Product name: ${booking.itemName}`,
    `Date and time: ${formatDateTime(booking)}`,
    quantityText,
    amount ? `Estimated amount: ${amount}` : null,
    `Payment option: ${paymentMode}`,
    paymentMethod ? `Payment method: ${paymentMethod}` : null,
    paymentStatus ? `Payment status: ${paymentStatus}` : null,
    booking.paymentReference ? `Payment reference: ${booking.paymentReference}` : null,
    `Status: ${status}`,
    '',
    `Payment instructions: ${paymentInstructions}`,
    '',
    `Support: ${supportEmail} | ${supportPhone} | ${supportAddress}`,
  ].filter(Boolean).join('\n');

  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;background:#f4f7f3;font-family:Arial,Helvetica,sans-serif;color:#18352b;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7f3;margin:0;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #dfe8e1;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="background:#0f3529;padding:28px 24px;color:#ffffff;">
                <div style="font-size:13px;letter-spacing:1.4px;text-transform:uppercase;color:#d7b75b;font-weight:700;">${escapeHtml(brandName)}</div>
                <h1 style="margin:10px 0 0;font-size:26px;line-height:1.2;color:#ffffff;">${escapeHtml(preheader)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 24px 8px;">
                <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#31463d;">Hello ${escapeHtml(user.name || 'Guest')},</p>
                <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#4f6258;">Thank you for using Kashmir Portal. Your request details are below. This email has been sent only to your registered account email.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  ${rows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 24px;">
                <div style="border-left:4px solid #d7b75b;background:#fff9e8;border-radius:12px;padding:16px 18px;">
                  <div style="font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:800;color:#80621a;margin-bottom:8px;">Payment instructions</div>
                  <p style="margin:0;font-size:15px;line-height:1.7;color:#3c3524;">${escapeHtml(paymentInstructions)}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 24px 28px;">
                <div style="background:#eef6f2;border-radius:12px;padding:16px 18px;">
                  <div style="font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:800;color:#1a6658;margin-bottom:8px;">Support</div>
                  <p style="margin:0;font-size:14px;line-height:1.7;color:#355045;">
                    Email: <a href="mailto:${escapeHtml(supportEmail)}" style="color:#116b5c;text-decoration:none;font-weight:700;">${escapeHtml(supportEmail)}</a><br>
                    Phone: ${escapeHtml(supportPhone)}<br>
                    Address: ${escapeHtml(supportAddress)}
                  </p>
                </div>
              </td>
            </tr>
          </table>
          <p style="max-width:640px;margin:14px auto 0;font-size:12px;line-height:1.5;color:#7b8b82;text-align:center;">This is an automated confirmation email. Please do not reply with payment details.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
};

const isConfiguredValue = (value) => Boolean(value && !String(value).includes('your-email') && !String(value).includes('example.com'));

const getSmtpUser = () => String(process.env.SMTP_USER || '').trim();
const getSmtpPassword = () => String(process.env.SMTP_PASS || '').replace(/\s+/g, '');
const getResendApiKey = () => String(process.env.RESEND_API_KEY || '').trim();
const hasResendConfig = () => isConfiguredValue(getResendApiKey());
const getFromAddress = () => (
  isConfiguredValue(process.env.MAIL_FROM)
    ? process.env.MAIL_FROM
    : `Kashmir Portal <${getSmtpUser()}>`
);
const getResendFromAddress = () => process.env.RESEND_FROM || 'Kashmir Portal <noreply@kashmirportal.railway.app>';

const hasMailConfig = () => Boolean(
  process.env.SMTP_HOST
  && process.env.SMTP_PORT
  && isConfiguredValue(getSmtpUser())
  && isConfiguredValue(getSmtpPassword())
);

let transporter;

const getTransporter = () => {
  if (!hasMailConfig()) return null;
  if (transporter) return transporter;

  const auth = getSmtpUser() && getSmtpPassword()
    ? { user: getSmtpUser(), pass: getSmtpPassword() }
    : undefined;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
    auth,
    requireTLS: process.env.SMTP_REQUIRE_TLS !== 'false',
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 15000),
  });

  return transporter;
};

const verifyEmailTransport = async () => {
  if (hasResendConfig()) {
    console.info('[email] Resend API configured');
    return { provider: 'resend', configured: true, verified: true };
  }

  const mailTransporter = getTransporter();
  if (!mailTransporter) {
    console.warn('[email] Email delivery verification skipped: Resend and SMTP configuration missing');
    return { configured: false, verified: false };
  }

  try {
    await mailTransporter.verify();
    console.info('[email] SMTP connection verified');
    return { configured: true, verified: true };
  } catch (err) {
    const details = [err.code, err.command, err.responseCode].filter(Boolean).join('/');
    console.error(`[email] SMTP verification failed${details ? ` (${details})` : ''}: ${err.message}`);
    return { configured: true, verified: false, error: err.message };
  }
};

const sendWithResend = async ({ email, user }) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getResendApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: getResendFromAddress(),
      to: [user.email],
      reply_to: process.env.MAIL_REPLY_TO || process.env.SUPPORT_EMAIL,
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = result.message || result.name || `Resend request failed with status ${response.status}`;
    throw new Error(message);
  }

  return { sent: true, provider: 'resend', messageId: result.id };
};

const sendBookingConfirmationEmail = async ({ booking, user }) => {
  if (!user?.email) {
    console.warn(`[email] Confirmation skipped for booking ${booking?._id}: registered user email missing`);
    return { skipped: true, reason: 'missing_user_email' };
  }

  const email = buildConfirmationEmail({ booking, user });
  if (hasResendConfig()) {
    const info = await sendWithResend({ email, user });
    console.info(`[email] Confirmation sent via Resend for booking ${booking._id} to ${user.email}: ${info.messageId || 'sent'}`);
    return info;
  }

  const mailTransporter = getTransporter();
  if (!mailTransporter) {
    console.warn(`[email] Confirmation skipped for booking ${booking?._id}: Resend and SMTP configuration missing`);
    return { skipped: true, reason: 'missing_email_config' };
  }

  const info = await mailTransporter.sendMail({
    from: getFromAddress(),
    to: user.email,
    replyTo: process.env.MAIL_REPLY_TO || process.env.SUPPORT_EMAIL,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  console.info(`[email] Confirmation sent via SMTP for booking ${booking._id} to ${user.email}: ${info.messageId || 'sent'}`);
  return { sent: true, provider: 'smtp', messageId: info.messageId };
};

module.exports = {
  buildConfirmationEmail,
  sendBookingConfirmationEmail,
  verifyEmailTransport,
};
