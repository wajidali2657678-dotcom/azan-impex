const ADMIN_EMAIL = 'wajidali2657678@gmail.com';
const ADMIN_WHATSAPP = '923250043448';

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body)
  };
}

function formatOrder(order, orderId) {
  const items = (order.items || []).map((item, i) => {
    const selected = (item.selectedAddons || []).join(', ') || 'None';
    return `${i + 1}. ${item.name} | SKU: ${item.sku} | Qty: ${item.quantity} pcs | Options: ${selected}`;
  }).join('\n');
  return `NEW AZAN IMPEX WEBSITE ORDER\nOrder ID: ${orderId}\n\nCustomer: ${order.customer?.name || ''}\nCompany: ${order.customer?.company || ''}\nPhone: ${order.customer?.phone || ''}\nEmail: ${order.customer?.email || ''}\n\nITEMS\n${items}\n\nAdditional requirements:\n${order.notes || 'None'}\n\nSubmitted: ${order.submittedAt || new Date().toISOString()}`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { success: false, message: 'Method not allowed.' });
  let order;
  try { order = JSON.parse(event.body || '{}'); } catch { return json(400, { success: false, message: 'Invalid order data.' }); }
  if (!order.customer?.name || !order.customer?.phone || !order.customer?.email || !Array.isArray(order.items) || !order.items.length) {
    return json(400, { success: false, message: 'Please complete the required customer and order information.' });
  }

  const orderId = `AZ-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  const message = formatOrder(order, orderId);
  const results = { whatsapp: false, email: false };

  // WhatsApp Cloud API: set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in Netlify env vars.
  if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    const waResponse = await fetch(`https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: ADMIN_WHATSAPP,
        type: 'text',
        text: { body: message }
      })
    });
    results.whatsapp = waResponse.ok;
  }

  // Resend: set RESEND_API_KEY and RESEND_FROM_EMAIL in Netlify env vars.
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `New Website Order ${orderId}`,
        text: message
      })
    });
    results.email = emailResponse.ok;
  }

  if (!results.whatsapp && !results.email) {
    return json(503, { success: false, message: 'Order service is not configured yet. Add the WhatsApp and email API keys in Netlify environment variables.', orderId });
  }
  return json(200, { success: true, orderId, notifications: results });
};
