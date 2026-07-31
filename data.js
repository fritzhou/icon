/* =========================================================
   iConnect — data access layer
   Every function tries Supabase first; if the project isn't
   configured yet (see js/supabase-config.js) or the query
   fails, it falls back to DEMO_DATA so the site is always
   previewable.
   ========================================================= */

const DEMO_DATA = {
  stats: { members: 128, officers: 12, events: 24, projects: 37 },

  adviser: {
    full_name: "Ma. Teresa D. Villanueva",
    position: "Club Adviser",
    bio: "A computer science educator with over a decade in the classroom, Ma'am Villanueva guides iConnect's officers on programming curriculum, competition prep, and club governance — while making sure every member has room to experiment and lead.",
    photo_url: ""
  },

  officers: [
    { full_name:"Rafael M. Santos", position:"President", grade_section:"Grade 12 - Newton", bio:"Coordinates iConnect's direction across every committee and represents the club to school administration.", skills:["Leadership","Web Dev","Public Speaking"] },
    { full_name:"Ysabel C. Reyes", position:"Vice President", grade_section:"Grade 12 - Curie", bio:"Oversees committee operations and steps in for the President when needed.", skills:["Project Mgmt","UI/UX"] },
    { full_name:"Miguel A. Torres", position:"Secretary", grade_section:"Grade 11 - Turing", bio:"Keeps meeting minutes, member records, and internal communications organized.", skills:["Documentation","Organization"] },
    { full_name:"Bea Q. Mendoza", position:"Treasurer", grade_section:"Grade 11 - Lovelace", bio:"Manages club funds, budgets for events, and financial reporting.", skills:["Budgeting","Excel"] },
    { full_name:"Jhon Carlo P. Dizon", position:"Auditor", grade_section:"Grade 12 - Newton", bio:"Reviews club records and attendance to keep operations transparent.", skills:["Auditing","Detail-oriented"] },
    { full_name:"Nicole B. Fernandez", position:"Public Information Officer", grade_section:"Grade 11 - Curie", bio:"Runs iConnect's announcements and social media presence.", skills:["Social Media","Graphic Design"] },
    { full_name:"Aaron Lee T. Ramos", position:"Documentation Officer", grade_section:"Grade 10 - Hopper", bio:"Captures and archives every event through photos and video.", skills:["Photography","Video Editing"] },
    { full_name:"Samantha J. Cruz", position:"Technical Officer", grade_section:"Grade 12 - Turing", bio:"Handles the club's website, equipment, and technical workshops.", skills:["JavaScript","Robotics","Supabase"] }
  ],

  members: [
    { full_name:"Ella Marie Gonzales", grade_section:"Grade 10 - Babbage", committee:"Web Development", bio:"Building her first full-stack projects with React." },
    { full_name:"Josh Andrei Villar", grade_section:"Grade 9 - Franklin", committee:"Robotics", bio:"Competing in the regional robotics meet this year." },
    { full_name:"Kyla Dominique Pascual", grade_section:"Grade 11 - Hopper", committee:"UI/UX Design", bio:"Designs interfaces for club and school projects." },
    { full_name:"Marc Anthony Lim", grade_section:"Grade 10 - Newton", committee:"Video Editing", bio:"Edits highlight reels for every major event." },
    { full_name:"Trisha Mae Aquino", grade_section:"Grade 12 - Curie", committee:"Mobile Development", bio:"Prototyping the club's own member app in Flutter." },
    { full_name:"Diego Rafael Santos", grade_section:"Grade 9 - Turing", committee:"Graphic Design", bio:"Handles poster and social media graphics." }
  ],

  announcements: [
    { id:1, title:"iConnect General Assembly — August 15", description:"All members are required to attend the first general assembly of the school year to receive committee assignments and the yearly roadmap.", date_posted:"2026-07-28", posted_by:"Nicole Fernandez", cover_image:"" },
    { id:2, title:"Web Development Workshop Slots Open", description:"Sign-ups are open for the introductory HTML, CSS, and JavaScript workshop series running every Friday afternoon this quarter.", date_posted:"2026-07-20", posted_by:"Samantha Cruz", cover_image:"" },
    { id:3, title:"Robotics Team Advances to Regionals", description:"Congratulations to the iConnect robotics team for placing 2nd in the provincial meet and qualifying for regionals next month.", date_posted:"2026-07-10", posted_by:"Rafael Santos", cover_image:"" }
  ],

  events: [
    { id:1, title:"iConnect General Assembly", date:"2026-08-15", time:"1:00 PM", venue:"School Auditorium", description:"Kickoff assembly covering the yearly roadmap and committee assignments.", status:"upcoming" },
    { id:2, title:"Intro to Web Development Workshop", date:"2026-08-22", time:"3:00 PM", venue:"Computer Lab 2", description:"Hands-on session covering HTML, CSS, and JavaScript basics.", status:"upcoming" },
    { id:3, title:"UI/UX Design Sprint", date:"2026-07-25", time:"2:00 PM", venue:"Computer Lab 1", description:"A one-day design sprint where teams prototype an app in Figma.", status:"ongoing" },
    { id:4, title:"Founding Anniversary Hackathon", date:"2026-06-14", time:"8:00 AM", venue:"School Gymnasium", description:"24-hour hackathon celebrating iConnect's founding anniversary.", status:"completed" }
  ],

  gallery: [
    { id:1, title:"Hackathon Team Huddle", event:"Founding Anniversary Hackathon", uploaded_by:"Aaron Ramos", upload_date:"2026-06-15", image_url:"" },
    { id:2, title:"Design Sprint Whiteboarding", event:"UI/UX Design Sprint", uploaded_by:"Aaron Ramos", upload_date:"2026-07-25", image_url:"" },
    { id:3, title:"Robotics Bracket Assembly", event:"Robotics Training", uploaded_by:"Josh Villar", upload_date:"2026-07-05", image_url:"" },
    { id:4, title:"Workshop Sign-ups", event:"Web Dev Workshop", uploaded_by:"Nicole Fernandez", upload_date:"2026-07-20", image_url:"" },
    { id:5, title:"Officer Planning Session", event:"General Assembly Prep", uploaded_by:"Miguel Torres", upload_date:"2026-07-18", image_url:"" },
    { id:6, title:"Hackathon Awarding", event:"Founding Anniversary Hackathon", uploaded_by:"Aaron Ramos", upload_date:"2026-06-15", image_url:"" }
  ],

  socials: [
    { platform:"Facebook", handle:"@iConnectClub", description:"Announcements, event recaps, and community updates.", url:"https://facebook.com" },
    { platform:"Instagram", handle:"@iconnect.club", description:"Behind-the-scenes photos and member spotlights.", url:"https://instagram.com" },
    { platform:"TikTok", handle:"@iconnectclub", description:"Quick tips, workshop highlights, and event reels.", url:"https://tiktok.com" },
    { platform:"YouTube", handle:"iConnect Club", description:"Full event coverage, tutorials, and project demos.", url:"https://youtube.com" },
    { platform:"GitHub", handle:"iconnect-club", description:"Open-source projects built by our members.", url:"https://github.com" },
    { platform:"LinkedIn", handle:"iConnect Club", description:"Alumni network and partnership updates.", url:"https://linkedin.com" }
  ]
};

/* ---------- Generic helper ---------- */
async function fetchTable(table, { order, ascending = false, limit } = {}){
  if(!IS_SUPABASE_CONFIGURED) return null; // signal caller to use demo data
  try{
    let q = supabase.from(table).select('*');
    if(order) q = q.order(order, { ascending });
    if(limit) q = q.limit(limit);
    const { data, error } = await q;
    if(error) throw error;
    return data;
  }catch(err){
    console.warn(`[iConnect] Supabase fetch failed for "${table}", using demo data.`, err.message);
    return null;
  }
}

async function getStats(){
  const data = await fetchTable('site_stats');
  return (data && data[0]) || DEMO_DATA.stats;
}
async function getAdviser(){
  const data = await fetchTable('adviser');
  return (data && data[0]) || DEMO_DATA.adviser;
}
async function getOfficers(){
  const data = await fetchTable('officers', { order:'sort_order', ascending:true });
  return data || DEMO_DATA.officers;
}
async function getMembers(){
  const data = await fetchTable('members', { order:'full_name', ascending:true });
  return data || DEMO_DATA.members;
}
async function getAnnouncements(limit){
  const data = await fetchTable('announcements', { order:'date_posted', ascending:false, limit });
  return data || (limit ? DEMO_DATA.announcements.slice(0, limit) : DEMO_DATA.announcements);
}
async function getEvents(){
  const data = await fetchTable('events', { order:'date', ascending:false });
  return data || DEMO_DATA.events;
}
async function getGallery(){
  const data = await fetchTable('gallery', { order:'upload_date', ascending:false });
  return data || DEMO_DATA.gallery;
}
async function getSocials(){
  const data = await fetchTable('social_links');
  return data || DEMO_DATA.socials;
}

/* ---------- Formatting helpers ---------- */
function fmtDate(iso){
  try{
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  }catch{ return iso; }
}
function initials(name){
  return (name || '').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
}
function escapeHtml(str=''){
  return str.replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}
