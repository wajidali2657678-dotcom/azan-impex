AZAN IMPEX - WEBSITE ORDER SYSTEM

Included:
- index.html: existing Azan Impex structure with website-only order submission UI.
- netlify/functions/submit-order.js: secure serverless notification function.
- netlify.toml: Netlify function/route configuration.

IMPORTANT FOR LIVE AUTOMATIC NOTIFICATIONS
The website frontend is complete, but WhatsApp/Email providers require private API credentials. Do NOT put these credentials in index.html.

Set these Netlify environment variables:
1. WHATSAPP_ACCESS_TOKEN = your Meta WhatsApp Cloud API access token
2. WHATSAPP_PHONE_NUMBER_ID = your Meta WhatsApp Business sender phone number ID
3. RESEND_API_KEY = your Resend API key
4. RESEND_FROM_EMAIL = a verified sender email/domain in Resend, e.g. orders@yourdomain.com

The notification destination already in this website is:
WhatsApp: +92 325 0043448
Email: wajidali2657678@gmail.com

After setting variables, redeploy the site. Customers submit orders only on the website; the function sends notifications automatically.
