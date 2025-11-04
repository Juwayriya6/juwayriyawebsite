/*
    Credits:
        kitbur @ GitHub
*/

// Slideshow functionality for intro section
$(function () {
    const $gallery = $('#intro .slideshow');
    const $slides = $('.slide');
    const $dots = $('.navDot');
    const viewCounts = Array($slides.length).fill(0);
    let currentIndex = Math.floor(Math.random() * $slides.length);
    let interval;

    // Assign background images and positions in HTML
    $slides.each(function () {
        const $thisSlide = $(this);

        // Assign background images in HTML
        const bg = $thisSlide.attr('slideshowImage');
        if (bg) {
            $thisSlide.css('background-image', `url(${bg})`);
        }

        // Handle background-position from HTML attribute 'slideshowImagePosition'
        const bgPosAttr = $thisSlide.attr('slideshowImagePosition');
        if (bgPosAttr) {
            $thisSlide.css('background-position', bgPosAttr);
        }
    });

    function goToSlide(index) {
        $slides.removeClass('active').eq(index).addClass('active');
        $dots.removeClass('active').eq(index).addClass('active');
        currentIndex = index;
        viewCounts[index]++;
    }

    // "Fake" random swapping between each gallery image
    function getNextLeastViewedIndex() {
        const minViews = Math.min(...viewCounts);
        const candidates = viewCounts
            .map((count, index) => (count === minViews && index !== currentIndex ? index : -1))
            .filter(index => index !== -1);
        return candidates.length > 0
            ? candidates[Math.floor(Math.random() * candidates.length)]
            // Fallback if images are the same
            : currentIndex;
    }

    function nextSlide() {
        const nextIndex = getNextLeastViewedIndex();
        goToSlide(nextIndex);
    }

    function startSlider() {
        interval = setInterval(nextSlide, 5000);
    }

    // Initialize
    goToSlide(currentIndex);
    startSlider();

    $dots.on('click', function () {
        clearInterval(interval);
        const index = $(this).index();
        goToSlide(index);
        startSlider();
    });

    // Pause on hover
    $gallery.hover(
        () => clearInterval(interval),
        startSlider
    );
});
// Assume you already have: const $slide = $(...); const url = $slide.attr('slideshowImage');

// 1) Tag slide orientation so CSS can choose cover/contain
(function markOrientation(el, src) {
  const img = new Image();
  img.onload = function () {
    const portrait = img.naturalHeight >= img.naturalWidth;
    $(el).toggleClass('is-portrait', portrait)
         .toggleClass('is-landscape', !portrait);
  };
  img.src = src;
})($slide, url);

// 2) Respect per-slide focal points (desktop vs mobile)
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const posDesktop = $slide.attr('slideshowImagePosition');        // e.g., "center 55%"
const posMobile  = $slide.attr('slideshowImagePositionMobile');  // e.g., "center 25%"
const finalPos   = (isMobile && posMobile) ? posMobile : (posDesktop || 'center center');
$slide.css('background-position', finalPos);