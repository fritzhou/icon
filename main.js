/* =========================================================
   iConnect — shared UI behavior
   ========================================================= */

/* ---- Navbar scroll state ---- */
const navbar = document.querySelector('.navbar');
function onScroll(){
  if(!navbar) return;
  if(window.scrollY > 12) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  toggleBackToTop();
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

/* ---- Mark active nav link ---- */
(function markActive(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-panel a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });
})();

/* ---- Mobile menu ---- */
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if(navToggle && mobileMenu){
  navToggle.addEventListener('click', ()=>{
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.addEventListener('click', (e)=>{
    if(e.target === mobileMenu){
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  mobileMenu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window && revealEls.length){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el,i)=>{ el.style.setProperty('--i', i % 8); io.observe(el); });
} else {
  revealEls.forEach(el=> el.classList.add('in'));
}

/* ---- Back to top ---- */
const toTopBtn = document.querySelector('.to-top');
function toggleBackToTop(){
  if(!toTopBtn) return;
  if(window.scrollY > 480) toTopBtn.classList.add('show');
  else toTopBtn.classList.remove('show');
}
if(toTopBtn){
  toTopBtn.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));
}

/* ---- Toasts ---- */
function showToast(message, type = 'success', duration = 3800){
  let wrap = document.querySelector('.toast-wrap');
  if(!wrap){
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  wrap.appendChild(el);
  setTimeout(()=>{
    el.style.opacity = '0';
    el.style.transform = 'translateX(24px)';
    el.style.transition = 'all .3s ease';
    setTimeout(()=> el.remove(), 300);
  }, duration);
}

/* ---- Footer year ---- */
document.querySelectorAll('.js-year').forEach(el=> el.textContent = new Date().getFullYear());

/* =========================================================
   Signature element: node-network canvas
   Nodes drift and connect with lines when close — a literal,
   living rendering of "iConnect" rather than decorative circuitry.
   ========================================================= */
function initNetworkCanvas(canvasId, opts = {}){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, nodes = [];
  const density = opts.density || 0.00012;
  const linkDist = opts.linkDist || 150;
  const speed = prefersReduced ? 0 : (opts.speed || 0.25);
  const color = opts.color || '30, 79, 168';

  function resize(){
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = rect.width * devicePixelRatio;
    H = canvas.height = rect.height * devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    const count = Math.max(18, Math.min(70, Math.floor(rect.width * rect.height * density)));
    nodes = Array.from({length: count}, ()=> ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-0.5)*speed*devicePixelRatio,
      vy: (Math.random()-0.5)*speed*devicePixelRatio,
      r: (Math.random()*1.6 + 1.2) * devicePixelRatio
    }));
  }

  function tick(){
    ctx.clearRect(0,0,W,H);
    for(const n of nodes){
      n.x += n.vx; n.y += n.vy;
      if(n.x < 0 || n.x > W) n.vx *= -1;
      if(n.y < 0 || n.y > H) n.vy *= -1;
    }
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        const maxDist = linkDist * devicePixelRatio;
        if(dist < maxDist){
          ctx.strokeStyle = `rgba(${color}, ${(1 - dist/maxDist) * 0.35})`;
          ctx.lineWidth = devicePixelRatio;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    for(const n of nodes){
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${color}, 0.65)`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', resize);
  tick();
}
document.addEventListener('DOMContentLoaded', ()=>{
  initNetworkCanvas('heroCanvas');
});

/* ---- Simple client-side search/filter helper ---- */
function filterCards(inputEl, cardSelector, matchFn){
  if(!inputEl) return;
  inputEl.addEventListener('input', ()=>{
    const q = inputEl.value.trim().toLowerCase();
    document.querySelectorAll(cardSelector).forEach(card=>{
      const visible = matchFn(card, q);
      card.style.display = visible ? '' : 'none';
    });
  });
}

/* ---- Lazy-load images ---- */
document.querySelectorAll('img[data-src]').forEach(img=>{
  if('loading' in HTMLImageElement.prototype){
    img.src = img.dataset.src; img.loading = 'lazy';
  } else {
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.src = e.target.dataset.src; io.unobserve(e.target); } });
    });
    io.observe(img);
  }
});
