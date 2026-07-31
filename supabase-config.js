/* =========================================================
   iConnect — Supabase configuration
   Fill these in with your project's values:
   Supabase Dashboard → Project Settings → API
   ========================================================= */
const SUPABASE_URL = "https://xeyqlbmvyhwdzqxcrhjv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleXFsYm12eWh3ZHpxeGNyaGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTk0NDYsImV4cCI6MjEwMDg5NTQ0Nn0.Cl6GkI0T14CsFXYcCF-bl1XdzRw-R_BA8oZIsmHcp1U";

// Loaded globally via CDN script tag in each page (see <script src=".../supabase-js@2"> in <head>)
const supabase = (SUPABASE_URL.startsWith("http") && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// When supabase isn't configured yet, the site falls back to the DEMO_DATA
// defined in js/data.js so every page still renders and is easy to preview.
const IS_SUPABASE_CONFIGURED = !!supabase;
