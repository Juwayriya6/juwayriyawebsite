// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
  });
});

// Filters
(function(){
  const chips = Array.from(document.querySelectorAll('.chip'));
  const grid  = document.getElementById('gallery-grid');
  if (!chips.length || !grid) return;
  const items = Array.from(grid.querySelectorAll('.item'));
  function apply(filter){
    items.forEach(li => {
      const g = li.getAttribute('data-group');
      li.style.display = (filter==='all' || g===filter) ? '' : 'none';
    });
    chips.forEach(c => c.classList.toggle('is-active', c.dataset.filter === filter));
  }
  chips.forEach(c => c.addEventListener('click', () => apply(c.dataset.filter || 'all')));
  apply('all');
})();

// Lightbox
(function(){
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;
  const img = overlay.querySelector('#lightbox-img');
  const cap = overlay.querySelector('#lightbox-cap');
  const close = overlay.querySelector('.close');
  function open(src, caption){ img.src = src; cap.textContent = caption || ''; overlay.classList.add('open'); document.body.style.overflow='hidden'; }
  function shut(){ overlay.classList.remove('open'); img.src=''; cap.textContent=''; document.body.style.overflow=''; }
  close.addEventListener('click', shut);
  overlay.addEventListener('click', e => { if (e.target === overlay) shut(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
  document.querySelectorAll('#gallery-grid a').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); open(a.getAttribute('data-full')||a.href, a.getAttribute('data-caption')||''); });
  });
})();