# AZAN IMPEX — Supabase + Vercel

Setup:
1. Supabase > SQL Editor: run `supabase_schema.sql`.
2. Supabase > Authentication > Users > Add user: wajidali2657678@gmail.com + password (auto-confirm). Turn OFF public sign-ups (Auth > Providers > Email).
3. Put Project URL + anon key in `config.js`.
4. Vercel > Settings > Environment Variables: SUPABASE_URL, SUPABASE_SERVICE_KEY (server only), ADMIN_EMAIL, RESEND_API_KEY. Optional WhatsApp Cloud API: WA_TOKEN, WA_PHONE_ID, WA_TO.
5. Push to GitHub; Vercel redeploys. Admin: /admin
