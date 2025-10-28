/* Tiny helper utilities */
const qs = (s, el=document)=>el.querySelector(s);
const qsa = (s, el=document)=>[...el.querySelectorAll(s)];

/* Year stamp */
qs('#year') && (qs('#year').textContent = new Date().getFullYear());

/* Hero slideshow (data-driven like Chroma Botanica’s approach) */
(function(){
  const hero = qs('#hero');
  if(!hero) return;

  const slides = JSON.parse(hero.getAttribute('data-slides') || '[]');
  if(!slides.length) return;

  const bg = hero; // using :before via CSS
  let i = 0;
  const dots = qs('.navdots');
  slides.forEach((_, idx)=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${idx+1}`);
    b.addEventListener('click', ()=>{ i=idx; set(true); });
    dots.appendChild(b);
  });

  function set(jump){
    const s = slides[i];
    hero.style.setProperty('--bg-pos', s.pos || 'center center');
    // swap background image by toggling CSS var through inline style
    hero.style.setProperty('--bg-url', `url('${s.src}')`);
    hero.style.setProperty('--bg-idx', i);
    // update pseudo-element background:
    hero.style.setProperty('--bg', `url('${s.src}')`);
    // reflect active dot
    qsa('.navdots button').forEach((b,idx)=> b.setAttribute('aria-current', idx===i ? 'true':'false'));
    if(!jump) i = (i+1) % slides.length;
  }

  // hook CSS ::before to our --bg var
  const style = document.createElement('style');
  style.textContent = `
    #hero::before{ background-image: var(--bg) }
  `;
  document.head.appendChild(style);

  set(true);
  setInterval(()=>set(false), 6000);
})();

/* Lightbox using Poptrox (same plugin used by HTML5 UP) */
(function(){
  const gallery = qs('.gallery .grid');
  if(!gallery || !window.jQuery || !jQuery.fn.poptrox) return;
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
});/* Collections filtering (chips) + lightbox on collections page */
(function(){
  const grid = document.getElementById('collections-grid');
  if(!grid) return;

  // Lightbox
  if(window.jQuery && jQuery.fn.poptrox){
    jQuery(grid).poptrox({
      overlayColor:'#000', overlayOpacity:0.85, usePopupCaption:true,
      caption: function($a){
        try{
          const meta = JSON.parse($a.attr('data-caption') || '{}');
          const title = meta.title ? `<strong>${meta.title}</strong>` : '';
          const text  = meta.text  ? `<div>${meta.text}</div>` : '';
          return `${title}${text}`;
        }catch(e){ return ''; }
      }
    });
  }

  // Filters
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

  // Deep link via hash (e.g., collections.html#astronomy)
  const start = location.hash.replace('#','') || 'all';
  apply(start);
})();
