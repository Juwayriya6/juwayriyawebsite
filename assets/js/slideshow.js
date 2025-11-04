/*
  Credits:
    kitbur @ GitHub
*/

$(function () {
  const $slideshow = $('#intro .slideshow');
  const $slides    = $slideshow.find('.slide');
  const $dots      = $('.slideshowNav .navDot');

  let current = 0;
  let timer   = null;

  // Set background images once
  $slides.each(function () {
    const $s = $(this);
    const img = $s.attr('slideshowImage');
    if (img) $s.css('background-image', `url(${img})`);
  });

  function applyFocal($s) {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const posDesktop = $s.attr('slideshowImagePosition') || 'center center';
    const posMobile  = $s.attr('slideshowImagePositionMobile') || posDesktop;
    const sizeMobile = $s.attr('slideshowImageSizeMobile') || 'cover'; // optional attr

    $s.css('background-position', isMobile ? posMobile : posDesktop);
    $s.css('background-attachment', isMobile ? 'scroll' : 'fixed');
    if (isMobile) $s.css('background-size', sizeMobile); // 'cover' or 'contain'
  }

  function show(i) {
    $slides.removeClass('active').eq(i).addClass('active');
    $dots.removeClass('active').eq(i).addClass('active');
    applyFocal($slides.eq(i));
    current = i;
  }

  function next() { show((current + 1) % $slides.length); }
  function prev() { show((current - 1 + $slides.length) % $slides.length); }

  function start() { stop(); timer = setInterval(next, 6000); }
  function stop()  { if (timer) clearInterval(timer); }

  // Dot navigation
  $dots.on('click', function () {
    stop();
    const i = $(this).data('index') ?? $(this).index();
    show(i);
    start();
  });

  // Swipe navigation (mobile)
  let sx = 0, sy = 0;
  $slideshow.on('touchstart', e => {
    const t = e.originalEvent.touches[0];
    sx = t.clientX; sy = t.clientY;
    stop();
  });
  $slideshow.on('touchend', e => {
    const t = e.originalEvent.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    // horizontal swipe
    if (Math.abs(dx) > 40 && Math.abs(dy) < 60) {
      dx < 0 ? next() : prev();
    }
    start();
  });

  // Keep focal point correct on rotate/resize
  $(window).on('resize orientationchange', () => applyFocal($slides.eq(current)));

  // Init
  show(current);
  start();
});