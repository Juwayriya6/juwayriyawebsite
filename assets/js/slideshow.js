(function () {
  const container = document.querySelector('#intro .slideshow');
  if (!container) return;

  let slides = Array.from(container.querySelectorAll('.slide'));
  if (!slides.length) return;

  // Normalize: keep only the first .active
  let firstActiveFound = false;
  slides.forEach(s => {
    if (s.classList.contains('active') && !firstActiveFound) {
      firstActiveFound = true;
    } else {
      s.classList.remove('active');
    }
  });
  if (!firstActiveFound) slides[0].classList.add('active');

  // Helper: choose best width
  function pickWidth() {
    const w = Math.max(window.innerWidth || 0, screen.width || 0);
    if (w <= 780) return 720;
    if (w <= 1100) return 960;
    return 1200;
  }

  function toOptimizedWebP(path, width) {
    // expects path like images/slideshow/foo.jpg
    // returns images/slideshow/optimized/foo-960.webp
    const parts = path.split('/');
    const file = parts.pop();
    const stem = file.replace(/\.(png|jpg|jpeg|webp)$/i, '');
    const dir  = parts.join('/');
    return `${dir}/optimized/${stem}-${width}.webp`;
  }

  // Apply background images
  function applyBackgrounds() {
    const w = pickWidth();
    slides.forEach(slide => {
      const src = slide.getAttribute('slideshowImage') || slide.getAttribute('data-image') || '';
      if (!src) return;
      // Prefer optimized webp; fall back to original
      const webp = toOptimizedWebP(src, w);
      // Set with image-set where supported; otherwise just webp
      slide.style.backgroundImage = `url("${webp}")`;
      // Optional: custom position for mobile/desktop
      const pos = slide.getAttribute('slideshowImagePosition');
      const posMobile = slide.getAttribute('slideshowImagePositionMobile');
      const isMobile = (window.innerWidth || 0) <= 780;
      if (posMobile && isMobile) slide.style.backgroundPosition = posMobile;
      else if (pos) slide.style.backgroundPosition = pos;
      else slide.style.backgroundPosition = 'center';
    });
  }

  applyBackgrounds();
  window.addEventListener('resize', () => {
    // throttle a bit
    clearTimeout(window.__slideResizeTO);
    window.__slideResizeTO = setTimeout(applyBackgrounds, 150);
  });

  // Build dots to match slides
  const nav = container.parentElement.querySelector('.slideshowNav');
  if (nav) {
    nav.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'navDot' + (i === 0 ? ' active' : '');
      b.setAttribute('aria-label', `Show image ${i+1}`);
      b.addEventListener('click', () => goTo(i));
      nav.appendChild(b);
    });
  }

  function setActive(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    if (nav) {
      const dots = Array.from(nav.querySelectorAll('.navDot'));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }
    current = index;
  }

  let current = slides.findIndex(s => s.classList.contains('active'));
  if (current < 0) current = 0;
  let timer = null;

  function goTo(i) {
    clearInterval(timer);
    setActive(i);
    start();
  }

  function next() {
    const n = (current + 1) % slides.length;
    setActive(n);
  }

  function start() {
    timer = setInterval(next, 5000);
  }
  start();
})();
