/* Tiny helper utilities */
const qs = (s, el=document)=>el.querySelector(s);
const qsa = (s, el=document)=>[...el.querySelectorAll(s)];

/* Year stamp */
qs('#year') && (qs('#year').textContent = new Date().getFullYear());

/* Hero slideshow */
(function(){
  const hero = qs('#hero');
  if(!hero) return;

  const slides = JSON.parse(hero.getAttribute('data-slides') || '[]');
  if(!slides.length) return;

  let i = 0;
  const dots = qs('.navdots');
  const cap = qs('#hero-caption');

  slides.forEach((_, idx)=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${idx+1}`);
    b.addEventListener('click', ()=>{ i=idx; set(true); });
    dots.appendChild(b);
  });
  if (slides.length === 1) dots?.classList.add('hidden');

  function set(jump){
    const s = slides[i];
    hero.style.setProperty('--bg-pos', s.pos || 'center center');
    hero.style.setProperty('--bg', `url('${s.src}')`);
    if (cap) cap.textContent = s.title || '';
    qsa('.navdots button').forEach((b,idx)=> b.setAttribute('aria-current', idx===i ? 'true':'false'));
    if(!jump) i = (i+1) % slides.length;
    // optional Ken Burns origin variation
    hero.style.setProperty('--kb-origin', i % 2 ? '40% 60%' : '60% 40%');
  }

  const style = document.createElement('style');
  style.textContent = `#hero::before{ background-image: var(--bg); background-position: var(--bg-pos); animation: hero-kenburns 18s ease-in-out infinite; transform-origin: var(--kb-origin, 50% 50%);} @keyframes hero-kenburns{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}`;
  document.head.appendChild(style);

  set(true);
  setInterval(()=>set(false), 6000);
})();

/* Lightbox using Poptrox (if available) */
(function(){
  const galleries = [qs('.gallery .grid'), qs('#collections-grid')].filter(Boolean);
  if(!galleries.length || !window.jQuery || !jQuery.fn.poptrox) return;
  galleries.forEach(gallery=>{
    jQuery(gallery).poptrox({
      overlayColor: '#000',
      overlayOpacity: 0.85,
      usePopupCaption: true,
      caption: function($a){
        try {
          const meta = JSON.parse($a.attr('data-caption') || '{}');
          const title = meta.title ? `<strong>${meta.title}</strong>` : '';
          const text  = meta.text  ? `<div>${meta.text}</div>` : '';
          return `${title}${text}`;
        } catch(e){ return ''; }
      }
    });
  });
})();

/* Smooth anchors */
qsa('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href').slice(1);
    const el = qs(`#${id}`);
    if(!el) return;
    e.preventDefault();
    el.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* Collections filtering (chips) */
(function(){
  const grid = document.getElementById('collections-grid');
  if(!grid) return;

  const chips = [...document.querySelectorAll('.filters .chip')];
  const items = [...grid.querySelectorAll('li')];

  function apply(filter){
    items.forEach(li=>{
      const match = filter==='all' || li.dataset.collection===filter;
      li.classList.toggle('hidden', !match);
    });
    chips.forEach(c=>c.classList.toggle('is-active', c.dataset.filter===filter));
  }

  chips.forEach(c=>{
    c.addEventListener('click', ()=>{
      const f = c.dataset.filter || 'all';
      history.replaceState(null, '', f==='all' ? location.pathname : `#${f}`);
      apply(f);
    });
  });

  const start = location.hash.replace('#','') || 'all';
  apply(start);
})();