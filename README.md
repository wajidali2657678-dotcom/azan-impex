# AZAN IMPEX — Supabase + Vercel (Subliminator Style)

**A Subliminator-inspired apparel & fabric catalog with real-time inventory, manufacturing videos, and direct ordering.**

## ✨ Subliminator-like Features Added
- **4+ Images Per Product**: Every product now has minimum 4 images with "Coming Soon" placeholders
- **Manufacturing Videos**: Real UHD production videos added to each product
- **Comprehensive Filtering**: Advanced filters like Subliminator (Categories, Types, Stock, Video, Custom)
- **Video Preview**: Hover/click to preview manufacturing videos in grid
- **Enhanced Gallery**: 4-image carousel in product modal with video showcase
- **Real Stock Management**: Size-wise inventory with atomic updates
- **Admin Media Management**: Easy image/video upload with preview

## Setup:
1. **Supabase > SQL Editor**: Run `supabase_schema.sql` (already includes video/images support)
2. **Supabase > Auth**: Add admin user: `wajidali2657678@gmail.com` + password (confirm email)
3. **Update config.js**: Put your Supabase URL + anon key
4. **Vercel Env Vars**: Set `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (server), `ADMIN_EMAIL`, `RESEND_API_KEY`
5. **Push to GitHub**: Vercel auto-deploys on push
6. **Admin Access**: Visit `/admin` to manage products

## 🎯 Key Improvements vs Original:
| Feature | Before | After (Subliminator Style) |
|---------|--------|----------------------------|
| Images/Product | 1 main image | **4+ images** with gallery |
| Videos | None | **Manufacturing UHD videos** per product |
| Filtering | Basic (cat, type, stock) | **Advanced filters** + video toggle |
| Product View | Simple modal | **Image carousel + video showcase** |
| Missing Images | Broken | **"Coming Soon" placeholders** |
| Admin Media | Basic upload | **Preview + validation** (min 4 images) |
| Stock Display | Total only | **Size-wise breakdown** |

## 📱 Mobile Optimized:
- Collapsible filters sidebar
- Swipe-friendly image gallery
- Touch-optimized video controls
- Fast loading with lazy images

## 🛒 Order Flow:
1. Browse/filter products (4+ images each)
2. Click product → See gallery + manufacturing videos
3. Add to cart with size-wise quantities
4. Checkout → Order placed via secure Supabase function
5. Email/WhatsApp notifications sent automatically

## 💡 For Developers:
- Uses Supabase Storage for media (images/videos)
- RLS policies secure data access
- Netlify function (`/api/notify`) handles notifications
- All client-side logic in `index.html`
- Admin panel at `/admin` for product management

**Live Demo**: Push to GitHub → Vercel provides HTTPS URL
**Stock**: Real-time, size-wise deducted on order
**Media**: Upload via admin panel → auto-optimized for web