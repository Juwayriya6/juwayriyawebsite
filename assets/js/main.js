/* Match Chroma Botanica behavior:
   - Fullscreen slideshow fade
   - jQuery Poptrox lightbox for .gallery
   - Scrollex anchor transitions (minimal)
   - Breakpoints init (used by HTML5 UP themes)
*/

(function($){

  // Breakpoints (if loaded)
  if (window.breakpoints) breakpoints({
    xlarge: [ '1281px', '1680px' ],
    large:  [ '981px',  '1280px' ],
    medium: [ '737px',  '980px'  ],
    small:  [ '481px',  '736px'  ],
    xsmall: [ null,     '480px'  ]
  });

  // Smooth scroll for anchor links
  $('a[href^="#"]').on('click', function(e){
    var id = $(this).attr('href'), $el = $(id);
    if ($el.length) { e.preventDefault(); $('html,body').animate({scrollTop:$el.offset().top}, 600); }
  });

  // Slideshow
  var slides = ($('body').data('slides') || '').toString().split(',').map(function(s){ return s.trim(); }).filter(Boolean);
  var $intro = $('#intro'), $a = $intro.find('.bg.a'), $b = $intro.find('.bg.b'), $dots = $('#dots');
  if (slides.length){
    slides.forEach(function(_, i){
      var d = $('<button/>').on('click', function(){ goto(i, true); });
      $dots.append(d);
    });
    var views = new Array(slides.length).fill(0), cur=0, showingA=true, timer=null;
    function setBg($el, url){
      $el.css({ backgroundImage:'url("'+url+'")', opacity:1, transform:'scale(1.02)' });
      setTimeout(function(){ $el.css('transform','scale(1)'); }, 50);
    }
    function updateDots(){
      $dots.find('button').each(function(i){ $(this).toggleClass('active', i===cur); });
    }
    function nextIndex(){
      var min=Math.min.apply(Math, views);
      var cand=[]; for (var i=0;i<slides.length;i++){ if (i!==cur && views[i]===min) cand.push(i); }
      return cand[Math.floor(Math.random()*cand.length)] || ( (cur+1)%slides.length );
    }
    function goto(i, manual){
      var url=slides[i]; if (!url) return;
      if (showingA){ setBg($b, url); $a.css('opacity',0); } else { setBg($a, url); $b.css('opacity',0); }
      showingA=!showingA; cur=i; views[i]++; updateDots();
      if (timer) clearTimeout(timer);
      timer=setTimeout(function(){ goto(nextIndex(), false); }, manual?6000:4500);
    }
    // start
    setBg($a, slides[0]); $a.css('opacity',1); views[0]++; updateDots();
    timer=setTimeout(function(){ goto(nextIndex(), false); }, 4500);
  }

  // Poptrox lightbox
  if ($.fn.poptrox){
    $('.gallery').poptrox({
      usePopupCaption: true,
      overlayColor: '#000',
      overlayOpacity: 0.92,
      selector: 'a.image',
      usePopupNav: true
    });
  }

  // Scrollex reveal effect for panels
  if ($.fn.scrollex){
    $('.panel').scrollex({
      mode: 'middle',
      delay: 50,
      enter: function(){ $(this).addClass('visible'); }
    });
  }

})(jQuery);
