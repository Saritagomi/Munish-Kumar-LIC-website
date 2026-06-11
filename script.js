/* ============================================================
   Munish Kumar — LIC Agent  |  script.js
   Reads everything from data.js (SITE) and builds the page.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- helpers ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const get = (path) => path.split('.').reduce((o, k) => (o ? o[k] : ''), SITE);

  /* ---------- ICONS (stroke svg paths) ---------- */
  const ICONS = {
    shield:'<path d="M12 3 5 6v5c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z"/>',
    savings:'<path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z"/><path d="M4 9 7 5h10l3 4"/><circle cx="12" cy="14" r="2.2"/>',
    child:'<circle cx="12" cy="6" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/>',
    pension:'<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/><path d="M9 8h6"/>',
    health:'<path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6C19 16.5 12 21 12 21Z"/>',
    group:'<circle cx="8" cy="9" r="2.5"/><circle cx="16" cy="9" r="2.5"/><path d="M3 20a5 5 0 0 1 10 0M11 20a5 5 0 0 1 10 0"/>',
    money:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    tax:'<path d="M7 3h10l2 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7Z"/><path d="M9 11h6M9 15h4"/>',
    document:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  };

  /* ---------- derived bits ---------- */
  const initials = get('agent.name').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  const waBase = `https://wa.me/${get('agent.whatsapp')}`;

  /* ---------- simple {{bind}} for data-bind attrs ---------- */
  $$('[data-bind]').forEach(el => {
    const key = el.dataset.bind;
    el.textContent = key === 'initials' ? initials : get(key);
  });

  /* ---------- HERO heading emphasis (italic gold on last 2 words) ---------- */
  const heroTitle = $('.hero__title');
  if (heroTitle) {
    const words = get('hero.heading').split(' ');
    const tail = words.splice(-1);
    heroTitle.innerHTML = `${words.join(' ')} <span class="em">${tail.join(' ')}</span>`;
  }

  /* ---------- STATS ---------- */
  $('#statsGrid').innerHTML = SITE.stats.map(s => `
    <div class="stat reveal">
      <div class="stat__num" data-to="${s.value}" data-suffix="${s.suffix}">0</div>
      <div class="stat__label">${s.label}</div>
    </div>`).join('');

  /* ---------- ABOUT body + highlights ---------- */
  $('#aboutBody').innerHTML = SITE.about.body.map(p => `<p>${p}</p>`).join('');
  $('#aboutHighlights').innerHTML = SITE.about.highlights.map(h => `<li>${h}</li>`).join('');

  /* ---------- SERVICES ---------- */
  $('#servicesGrid').innerHTML = SITE.services.map(s => `
    <article class="service reveal">
      <div class="service__icon"><svg viewBox="0 0 24 24">${ICONS[s.icon] || ICONS.shield}</svg></div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </article>`).join('');

  /* cursor-follow glow on service cards */
  $$('.service').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- PROCESS ---------- */
  $('#processGrid').innerHTML = SITE.process.map(p => `
    <div class="pstep reveal">
      <div class="pstep__num">${p.step}</div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
    </div>`).join('');

  /* ---------- TESTIMONIALS ---------- */
  $('#voicesGrid').innerHTML = SITE.testimonials.map(t => `
    <article class="voice reveal">
      <p class="voice__quote">"${t.quote}"</p>
      <div class="voice__stars">★★★★★</div>
      <div class="voice__who">
        <span class="voice__av">${t.name[0]}</span>
        <div>
          <div class="voice__name">${t.name}</div>
          <div class="voice__place">${t.place}</div>
        </div>
      </div>
    </article>`).join('');

  /* ---------- FAQ ---------- */
  $('#faqList').innerHTML = SITE.faqs.map(f => `
    <div class="faqitem reveal">
      <div class="faqitem__q">${f.q}<span class="ic"></span></div>
      <div class="faqitem__a"><p>${f.a}</p></div>
    </div>`).join('');

  $$('.faqitem__q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const ans = q.nextElementSibling;
      const open = item.classList.contains('open');
      $$('.faqitem').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faqitem__a').style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ---------- CONTACT links ---------- */
  const phoneDisplay = get('agent.mobile').replace(/(\d{5})(\d{5})/, '$1 $2');
  $('#contactLinks').innerHTML = `
    <a class="clink" href="tel:${get('agent.mobile')}">
      <span class="clink__ic"><svg viewBox="0 0 24 24"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .6 3.5 1 1 0 0 1-.25 1Z"/></svg></span>
      <div><div class="clink__t">Call</div><div class="clink__v">${phoneDisplay}</div></div>
    </a>
    <a class="clink" href="${waBase}" target="_blank" rel="noopener">
      <span class="clink__ic"><svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24z"/></svg></span>
      <div><div class="clink__t">WhatsApp</div><div class="clink__v">${phoneDisplay}</div></div>
    </a>
    <a class="clink" href="mailto:${get('agent.email')}">
      <span class="clink__ic"><svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm.5 2 8.5 6 8.5-6"/></svg></span>
      <div><div class="clink__t">Email</div><div class="clink__v">${get('agent.email')}</div></div>
    </a>
    <div class="clink" style="cursor:default">
      <span class="clink__ic"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"/></svg></span>
      <div><div class="clink__t">Location</div><div class="clink__v">${get('agent.city')}</div></div>
    </div>`;

  /* ---------- FOOTER contact ---------- */
  $('#footerContact').innerHTML = `
    <a href="tel:${get('agent.mobile')}">${phoneDisplay}</a>
    <a href="${waBase}" target="_blank" rel="noopener">WhatsApp</a>
    <a href="mailto:${get('agent.email')}">${get('agent.email')}</a>`;
  $('#year').textContent = new Date().getFullYear();
  $('#waFab').href = waBase;

  /* ---------- contact form service options ---------- */
  const sel = $('#fService');
  sel.innerHTML = `<option value="">Choose a service</option>` +
    SITE.services.map(s => `<option>${s.title}</option>`).join('') +
    `<option>Something else</option>`;

  /* ---------- form submit → WhatsApp ---------- */
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#fName'), phone = $('#fPhone');
    let ok = true;
    [name, phone].forEach(f => {
      const bad = !f.value.trim() || (f === phone && !/^\d{10}$/.test(f.value.trim()));
      f.classList.toggle('err', bad);
      if (bad) ok = false;
    });
    if (!ok) { toast('Please enter your name and a valid 10-digit number'); return; }

    const msg =
      `Namaste Munish ji,%0A%0AMy name is ${encodeURIComponent(name.value.trim())}.%0A` +
      `Mobile: ${phone.value.trim()}%0A` +
      `Interested in: ${encodeURIComponent($('#fService').value || 'General enquiry')}%0A` +
      (($('#fMsg').value.trim()) ? `Message: ${encodeURIComponent($('#fMsg').value.trim())}%0A` : '') +
      `%0APlease guide me. Thank you.`;
    window.open(`${waBase}?text=${msg}`, '_blank');
    toast('Opening WhatsApp…');
  });

  /* ---------- TOAST ---------- */
  let toastTimer;
  function toast(text){
    const t = $('#toast'); t.textContent = text; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* ---------- NAV (scroll bg + mobile) ---------- */
  const nav = $('#nav'), burger = $('#burger'), links = $('#navLinks');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  onScroll(); window.addEventListener('scroll', onScroll, { passive:true });
  burger.addEventListener('click', () => {
    burger.classList.toggle('open'); links.classList.toggle('open');
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open'); links.classList.remove('open');
  }));

  /* ---------- SCROLL REVEAL ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
  }, { threshold:.15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- COUNTERS ---------- */
  const counted = new WeakSet();
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting && !counted.has(en.target)) {
        counted.add(en.target); animateCount(en.target);
      }
    });
  }, { threshold:.6 });
  $$('.stat__num').forEach(el => cio.observe(el));

  function animateCount(el){
    const to = +el.dataset.to, suffix = el.dataset.suffix || '', dur = 1400, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- ABOUT card 3D tilt ---------- */
  const card = $('#aboutCard');
  if (card && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const wrap = card.parentElement;
    wrap.addEventListener('pointermove', e => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `rotateY(${x*12}deg) rotateX(${-y*12}deg)`;
    });
    wrap.addEventListener('pointerleave', () => card.style.transform = '');
  }

  /* ---------- HERO 3D ORB (particle sphere, canvas) ---------- */
  initOrb();
});

/* ============================================================
   3D rotating particle sphere — gives the "3D" hero feel.
   Pure canvas, no libraries.
   ============================================================ */
function initOrb(){
  const canvas = document.getElementById('orbCanvas');
  if (!canvas) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let W, H, DPR, pts = [], R, mouseX = 0, target = 0;

  function resize(){
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
    R = Math.min(W, H) * 0.34;
  }
  resize(); addEventListener('resize', resize);

  // fibonacci sphere points
  const N = 460;
  for (let i = 0; i < N; i++){
    const phi = Math.acos(1 - 2*(i+.5)/N);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    pts.push({
      x: Math.sin(phi)*Math.cos(theta),
      y: Math.sin(phi)*Math.sin(theta),
      z: Math.cos(phi),
    });
  }

  addEventListener('pointermove', e => { target = (e.clientX / innerWidth - .5) * 1.2; });

  let ay = 0, ax = .35;
  function frame(){
    ctx.clearRect(0,0,W,H);
    mouseX += (target - mouseX) * .05;
    if (!reduce) ay += .0028;
    const cx = W/2, cy = H*0.42;
    const cosY = Math.cos(ay + mouseX), sinY = Math.sin(ay + mouseX);
    const cosX = Math.cos(ax), sinX = Math.sin(ax);

    const proj = pts.map(p => {
      let x = p.x*cosY - p.z*sinY;
      let z = p.x*sinY + p.z*cosY;
      let y = p.y*cosX - z*sinX;
      z = p.y*sinX + z*cosX;
      const persp = 1 / (2 - z*0.6);
      return { sx: cx + x*R*persp, sy: cy + y*R*persp, z, s: persp };
    }).sort((a,b) => a.z - b.z);

    proj.forEach(p => {
      const depth = (p.z + 1) / 2;            // 0..1
      const r = 1.1 + depth * 2.2;
      const alpha = 0.18 + depth * 0.7;
      // gold front, cool back
      const c = depth > .55
        ? `rgba(212,162,78,${alpha})`
        : `rgba(120,150,180,${alpha*0.55})`;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, 6.283);
      ctx.fillStyle = c;
      ctx.fill();
    });

    requestAnimationFrame(frame);
  }
  frame();
}
