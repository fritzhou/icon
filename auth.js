/* =========================================================
   iConnect — authentication helpers (Supabase Auth)
   Roles are stored in the "officers" table (linked to auth.users.id
   via the "user_id" column) — see sql/schema.sql.
   ========================================================= */

const ROLE_PERMISSIONS = {
  president: ['officers','members','announcements','events','gallery','settings','accounts'],
  secretary: ['announcements','events'],
  documentation_officer: ['gallery'],
  public_information_officer: ['announcements','homepage'],
  adviser: ['view_all','approve']
};

async function loginWithEmail(email, password){
  if(!IS_SUPABASE_CONFIGURED){
    throw new Error('Supabase is not configured yet. Add your project URL and anon key in js/supabase-config.js.');
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if(error) throw error;
  return data;
}

async function logout(){
  if(IS_SUPABASE_CONFIGURED){
    await supabase.auth.signOut();
  }
  location.href = 'login.html';
}

async function getCurrentSession(){
  if(!IS_SUPABASE_CONFIGURED) return null;
  const { data } = await supabase.auth.getSession();
  return data.session || null;
}

/** Fetch the officer profile (with role) for the logged-in user */
async function getCurrentOfficerProfile(){
  if(!IS_SUPABASE_CONFIGURED) return null;
  const session = await getCurrentSession();
  if(!session) return null;
  const { data, error } = await supabase
    .from('officers')
    .select('*')
    .eq('user_id', session.user.id)
    .single();
  if(error){ console.warn('[iConnect] Could not load officer profile', error.message); return null; }
  return data;
}

/** Guard for dashboard.html — redirects to login if not authenticated */
async function requireAuth(){
  // Open access: this project no longer requires officers to log in.
  // Anyone opening dashboard.html gets full president-level access.
  return { role: 'president', full_name: 'Admin', position: 'Administrator', demo: false };
}

function canAccess(role, section){
  return (ROLE_PERMISSIONS[role] || []).includes(section);
}
