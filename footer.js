document.addEventListener('DOMContentLoaded', ()=>{
  const el = document.getElementById('footer');
  if(!el) return;
  el.innerHTML = `
  <div class="container footer-inner">
    <div>
      <div class="brand" style="color:#fff;margin-bottom:14px;">
        <span class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M8.1 7.3 10.6 15.4M15.9 7.3 13.4 15.4M8.3 6h7.4"/></svg></span>
        iConnect
      </div>
      <p style="max-width:280px; font-size:.88rem; color:rgba(255,255,255,.65);">The official technology club of our school — programming, design, robotics, and digital innovation, built by students.</p>
      <div class="social-row" id="footerSocialRow"></div>
    </div>
    <div>
      <h4>Explore</h4>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="officers.html">Officers &amp; Members</a>
      <a href="events.html">Events</a>
    </div>
    <div>
      <h4>Resources</h4>
      <a href="announcements.html">Announcements</a>
      <a href="gallery.html">Documentation</a>
      <a href="socials.html">Socials</a>
      <a href="dashboard.html">Admin Dashboard</a>
    </div>
    <div>
      <h4>Connect</h4>
      <a href="socials.html">All Social Platforms</a>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>© <span class="js-year"></span> iConnect Technology Club. All rights reserved.</span>
    <span>Built by iConnect Technical Committee</span>
  </div>`;

  document.querySelectorAll('.js-year').forEach(e=> e.textContent = new Date().getFullYear());

  const icons = {
    facebook:'<path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V9.5c0-.3.2-.5.5-.5Z"/>',
    instagram:'<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.4"/><circle cx="16.6" cy="7.4" r="1"/>',
    tiktok:'<path d="M13 4v9.6a3 3 0 1 1-2.4-2.9M13 4c.4 2 1.9 3.4 3.8 3.6V10c-1.4 0-2.7-.4-3.8-1.2"/>',
    youtube:'<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M11 10l4 2-4 2z" fill="currentColor" stroke="none"/>',
    github:'<path d="M12 3a9 9 0 0 0-2.8 17.5c.4.1.6-.2.6-.4v-1.6c-2.5.5-3-1.1-3-1.1-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6 1 .1 1.4 1 1.4 1 .8 1.4 2.2 1 2.7.7.1-.6.3-1 .6-1.2-2-.2-4.1-1-4.1-4.4 0-1 .3-1.7.9-2.4-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.5 1a8.6 8.6 0 0 1 4.5 0c1.7-1.2 2.5-1 2.5-1 .5 1.3.2 2.3.1 2.5.6.7.9 1.5.9 2.4 0 3.4-2.1 4.2-4.1 4.4.3.3.6.8.6 1.7v2.5c0 .2.2.5.6.4A9 9 0 0 0 12 3Z"/>',
    linkedin:'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.2" cy="8.2" r="1.1" fill="currentColor" stroke="none"/><path d="M8.2 11v6M12 11v6c0-2.5 1-4 3-4s2.6 1.4 2.6 3.8V17"/>'
  };
  (async ()=>{
    const socials = (typeof getSocials === 'function') ? await getSocials() : [];
    const row = document.getElementById('footerSocialRow');
    if(row && socials.length){
      row.innerHTML = socials.map(s=>{
        const key = s.platform.toLowerCase();
        const icon = icons[key] || icons.facebook;
        return `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.platform}"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6">${icon}</svg></a>`;
      }).join('');
    }
  })();
});
