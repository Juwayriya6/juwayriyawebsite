/* Vanilla JS slideshow with nav dots and data-attributes */
(function(){
  const intro = document.getElementById('intro');
  if(!intro) return;
  const slides = Array.from(intro.querySelectorAll('.slideshow .slide'));
  const dots   = Array.from(intro.querySelectorAll('.slideshowNav .navDot'));
  if(slides.length === 0) return;

  // Initialize slide backgrounds and positions
  function applyBackground(slide){
    const src = slide.getAttribute('slideshowImage');
    if(src) slide.style.backgroundImage = `url("${src}")`;

    // Position selection (desktop vs mobile)
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const posAttr = mobile
      ? slide.getAttribute('slideshowImagePositionMobile')
      : slide.getAttribute('slideshowImagePosition');
    if(posAttr) slide.style.backgroundPosition = posAttr;
  }

  slides.forEach(applyBackground);
  window.addEventListener('resize', () => slides.forEach(applyBackground));

  let index = 0;
  // Remove any pre-existing 'active' classes and set first
  slides.forEach(s => s.classList.remove('active'));
  if (slides[0]) slides[0].classList.add('active');
  if (dots[0]) dots[0].classList.add('active');

  let timerId = null;
  const INTERVAL = 6000;

  function showSlide(i){
    index = (i + slides.length) % slides.length;
    slides.forEach((s, si) => s.style.opacity = (si === index ? '1' : '0'));
    slides.forEach((s, si) => s.classList.toggle('active', si === index));
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }

  function next(){ showSlide(index + 1); }

  // Start autoplay
  function start(){
    stop();
    timerId = setInterval(next, INTERVAL);
  }
  function stop(){
    if(timerId) { clearInterval(timerId); timerId = null; }
  }

  // Wire dots
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.getAttribute('data-index'), 10) || 0;
      showSlide(i);
      start();
    });
  });

  // First paint
  showSlide(0);
  start();

  // Pause on visibility change (tab hidden)
  document.addEventListener('visibilitychange', () => {
    if(document.hidden) stop(); else start();
  });
})();
