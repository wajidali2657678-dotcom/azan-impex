# Production architecture

Customer:
Browser -> Supabase public product catalog -> Product detail -> size-wise cart -> order submission

Admin:
Your email -> Supabase Auth -> admin dashboard -> products/stock/media/orders

Media:
Supabase Storage -> product images/videos

Notifications:
Order -> Netlify Function -> Email provider + WhatsApp Cloud API/Twilio

Security:
- No service-role key in browser
- RLS enabled
- Admin authorization based on authenticated account
- Customer can read active products only
- Order creation handled by server-side function
