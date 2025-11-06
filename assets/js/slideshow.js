// Simple, crash-proof slideshow
document.addEventListener('DOMContentLoaded', () => {
  try {
    const slides = Array.from(document.querySelectorAll('#intro .slide'));
    const dots = Array.from(document.querySelectorAll('#intro .slideshowNav .navDot'));
    if (slides.length === 0) return;

    // Apply background images and focal points from attributes
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    slides.forEach(s => {
      const src = s.getAttribute('slideshowImage');
      if (src) s.style.backgroundImage = `url("${src}")`;

      const mobilePos = s.getAttribute('slideshowImagePositionMobile');
      const deskPos = s.getAttribute('slideshowImagePosition');
      if (isMobile && mobilePos) s.style.backgroundPosition = mobilePos;
      else if (deskPos) s.style.backgroundPosition = deskPos;
    });

    // State
    let i = Math.max(0, slides.findIndex(s => s.classList.contains('active')));
    if (i >= slides.length) i = 0;
    function show(n) {
      slides[i].classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('active');
      if (dots[i]) dots[i].classList.add('active');
    }

    // Dots
    dots.forEach(btn => {
      btn.addEventListener('click', () => show(parseInt(btn.dataset.index || '0', 10)));
    });

    // Auto-rotate
    setInterval(() => show(i + 1), 4500);
  } catch (e) {
    console.error('slideshow error:', e);
  } finally {
    // Ensure preloader is gone even if something breaks
    document.body.classList.remove('is-preload');
  }
});