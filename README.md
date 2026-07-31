# iConnect Website

A static, responsive website for the iConnect school technology club, with a
Supabase-powered role-based admin dashboard. No build step required — plain
HTML/CSS/JS, deployable to any static host (GitHub Pages, Netlify, Vercel,
or a normal web server).

## What's included

- **Public site**: Home, About, Officers & Members, Announcements, Events,
  Documentation/Gallery, Socials
- **Officer login** (`login.html`) using Supabase Authentication
- **Admin dashboard** (`dashboard.html`) with role-based sections and full
  CRUD for officers, members, announcements, events, gallery, social links,
  and homepage statistics
- **Demo mode**: until you connect Supabase, every page renders with sample
  data (see `js/data.js` → `DEMO_DATA`) and the dashboard works against an
  in-memory copy of it, so you can preview the whole site immediately.

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the contents of `sql/schema.sql`. This creates
   every table, enables Row Level Security, and sets up role-based policies.
3. Open **Project Settings → API** and copy your **Project URL** and
   **anon public key**.
4. Paste them into `js/supabase-config.js`:
   ```js
   const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJ...";
   ```

## 2. Create officer accounts

Supabase Auth users are created from the Supabase Dashboard (client-side
sign-up is intentionally not exposed — only the President should grant
access):

1. **Authentication → Users → Add User**, create the officer's email/password
   (or send a magic-link invite).
2. Copy the new user's UUID.
3. In the **officers** table, add a row for that person with `user_id` set to
   the UUID from step 2, and `role` set to one of: `president`,
   `vice_president`, `secretary`, `treasurer`, `auditor`,
   `public_information_officer`, `documentation_officer`, `technical_officer`,
   or `adviser`. That role controls exactly what they can see and edit in the
   dashboard (see `ROLE_PERMISSIONS` in `js/auth.js`).

## 3. Add storage buckets (for photo/file uploads)

The schema file has commented-out `insert` statements for three public
buckets — uncomment and run them, or create manually under **Storage**:
`gallery`, `avatars`, `covers`. Then paste uploaded file URLs into the
relevant "Image URL" fields in the dashboard (direct in-browser upload
widgets can be added later using `supabase.storage.from(bucket).upload()`).

## 4. Replace placeholder content

- Homepage hero copy, About page copy, and `DEMO_DATA` in `js/data.js` are
  placeholders — once Supabase has real rows, the site automatically prefers
  that data over the demo content.
- Update the six social links in the `social_links` table (or via
  **Dashboard → Website Settings**) with your club's real pages.
- Replace the inline logo mark (the connected-nodes icon in every page's
  `<header>`) if you design an official iConnect logo.

## File structure

```
index.html            Home
about.html             About
officers.html          Officers & Members
announcements.html     Announcements
events.html             Events
gallery.html            Documentation / Gallery
socials.html            Socials
login.html               Officer login
dashboard.html         Admin dashboard shell
css/style.css            Design system + all page styles
js/supabase-config.js  Your Supabase URL + anon key
js/data.js                Data access layer + demo data fallback
js/auth.js                Login / session / role helpers
js/main.js               Nav, mobile menu, scroll reveal, network canvas, toasts
js/footer.js              Shared footer markup + social icons
js/dashboard.js         Role-based nav + generic CRUD engine
sql/schema.sql            Tables, RLS policies, storage bucket setup
```

## Notes on the admin dashboard

Every managed content type (officers, members, announcements, events,
gallery, social links) is driven by one config object and one generic
CRUD engine in `js/dashboard.js` (`TABLE_CONFIGS`). To add a new field to
any table: add it to `sql/schema.sql`, add it to the matching config's
`fields` array, and the add/edit form updates automatically.
