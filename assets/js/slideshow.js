/*
    Credits:
        kitbur @ GitHub
*/

/* Slideshow for #intro
   Attributes per .slide:
     slideshowImage="path.jpg"
     slideshowImagePosition="center 55%"          // desktop focal point
     slideshowImagePositionMobile="center 25%"    // mobile focal point (optional)
   Desktop: cover (full-bleed)
   Mobile (<=768px): contain (no crop) + mobile focal point
*/

$(function () {
  const $gallery = $('#intro .slideshow');
  const $slides  = $gallery.find('.slide');
  const $dots    = $('.slideshowNav .navDot');
  if (!$slides.length) return;

  const viewCounts = Array($slides.length).fill(0);
  let currentIndex = Math.floor(Math.random() * $slides.length);
  let interval = null;

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  function markOrientation($el, src) {
    const img = new Image();
    img.onload = function () {
      const portrait = img.naturalHeight >= img.naturalWidth;
      $el.toggleClass('is-portrait', portrait)
         .toggleClass('is-landscape', !portrait);
    };
    img.src = src;
  }

  function applyStyles($s) {
    const url = $s.attr('slideshowImage');
    if (!url) return;

    const img = new Image(); img.src = url; // preload
    $s.css('background-image', 'url("' + url + '")');
    $s.css('background-attachment', 'scroll'); // stop parallax zoom

    const posDesktop = $s.attr('slideshowImagePosition');
    const posMobile  = $s.attr('slideshowImagePositionMobile');
    const finalPos   = (isMobile() && posMobile) ? posMobile : (posDesktop || 'center center');
    $s.css('background-position', finalPos);

    if (isMobile()) {
      $s.css({
        'background-size': 'contain',
        'background-repeat': 'no-repeat',
        'background-color': '#1c1d26'
      });
    } else {
      $s.css({
        'background-size': 'cover',
        'background-repeat': 'no-repeat'
      });
    }

    markOrientation($s, url);
  }

  // Init
  $slides.each(function () { applyStyles($(this)); });

  // Re-apply on viewport change
  $(window).on('resize orientationchange', function () {
    $slides.each(function () { applyStyles($(this)); });
  });

  function goToSlide(index) {
    if (index < 0) index = $slides.length - 1;
    if (index >= $slides.length) index = 0;

    $slides.removeClass('active').eq(index).addClass('active');
    $dots.removeClass('active').eq(index).addClass('active');
    viewCounts[index]++;
  }

  function getNextLeastViewedIndex() {
    const minViews = Math.min(...viewCounts);
    const candidates = viewCounts
      .map((count, i) => (count === minViews && i !== currentIndex ? i : -1))
      .filter(i => i !== -1);
    return candidates.length
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : (currentIndex + 1) % $slides.length;
  }

  function nextSlide() { currentIndex = getNextLeastViewedIndex(); goToSlide(currentIndex); }

  function startSlider() {
    if (interval) clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
  }

  // Dots
  $dots.on('click', function () {
    const i = parseInt($(this).attr('data-index'), 10) || $(this).index();
    if (interval) clearInterval(interval);
    currentIndex = i;
    goToSlide(i);
    startSlider();
  });

  // Pause on hover (desktop)
  $gallery.hover(() => { if (interval) clearInterval(interval); }, startSlider);

  // Kickoff
  goToSlide(currentIndex);
  startSlider();
});