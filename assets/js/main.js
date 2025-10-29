(function($){

  if (window.breakpoints) breakpoints({
    xlarge: [ '1281px', '1680px' ],
    large:  [ '981px',  '1280px' ],
    medium: [ '737px',  '980px'  ],
    small:  [ '481px',  '736px'  ],
    xsmall: [ null,     '480px'  ]
  });

  $('a[href^="#"]').on('click', function(e){
    var id = $(this).attr('href'), $el = $(id);
    if ($el.length) { e.preventDefault(); $('html,body').animate({scrollTop:$el.offset().top}, 600); }
  });

  var slides = [];
  $('[slideshowImage]').each(function(){
    slides.push({ url: $(this).attr('slideshowImage'), pos: $(this).attr('slideshowImagePosition') || 'center center' });
  });

  var $intro = $('#intro'), $a = $intro.find('.bg.a'), $b = $intro.find('.bg.b'), $dots = $('#dots');
  if (slides.length){
    slides.forEach(function(_, i){
      var d = $('<button/>')
        .on('mouseenter', function(){ if (timer) clearTimeout(timer); })
        .on('mouseleave', function(){ timer = setTimeout(function(){ goto(nextIndex(), false); }, 4500); })
        .on('click', function(){ goto(i, true); });
      $dots.append(d);
    });
    var views = new Array(slides.length).fill(0), cur=0, showingA=true, timer=null;
    function setBg($el, slide){
      $el.css({ backgroundImage:'url("'+slide.url+'")', backgroundPosition:slide.pos, opacity:1, transform:'scale(1.02)' });
      setTimeout(function(){ $el.css('transform','scale(1)'); }, 50);
    }
    function updateDots(){ $dots.find('button').each(function(i){ $(this).toggleClass('active', i===cur); }); }
    function nextIndex(){
      var min=Math.min.apply(Math, views);
      var cand=[]; for (var i=0;i<slides.length;i++){ if (i!==cur && views[i]===min) cand.push(i); }
      return cand[Math.floor(Math.random()*cand.length)] || ( (cur+1)%slides.length );
    }
    function goto(i, manual){
      var slide=slides[i]; if (!slide) return;
      if (showingA){ setBg($b, slide); $a.css('opacity',0); } else { setBg($a, slide); $b.css('opacity',0); }
      showingA=!showingA; cur=i; views[i]++; updateDots();
      if (timer) clearTimeout(timer);
      timer=setTimeout(function(){ goto(nextIndex(), false); }, manual?6000:4500);
    }
    setBg($a, slides[0]); $a.css('opacity',1); views[0]++; updateDots();
    timer=setTimeout(function(){ goto(nextIndex(), false); }, 4500);
  }

  $('.panel').each(function(){
    var bg = $(this).data('bg'), pos = $(this).data('bg-position') || 'center center';
    if (bg){
      if ($(this).hasClass('alt')){
        if (!$(this).find('.bg.photo').length){
          $('<div class="bg photo"/>').css('background-image','url("'+bg+'")').css('background-position', pos).prependTo(this);
        }
      }
    }
  });

  function renderIcons(jsonStr){
    try{
      var arr = JSON.parse(jsonStr); if (!Array.isArray(arr)) return '';
      return arr.map(function(x){
        var href = x.href || '#', icon = x.icon || 'link';
        var icn = icon === 'instagram' ? 'fa-brands fa-instagram' :
                  icon === 'envelope'  ? 'fa-solid fa-envelope'   :
                  icon === 'link'      ? 'fa-solid fa-link'       : icon;
        return '<a class="capicon" href="'+href+'" target="_blank" rel="noopener"><i class="'+icn+'"></i></a>';
      }).join('');
    }catch(e){ return ''; }
  }

  if ($.fn.poptrox){
    $('.gallery').poptrox({
      usePopupCaption: true,
      overlayColor: '#000',
      overlayOpacity: 0.92,
      selector: 'a.image',
      usePopupNav: true,
      caption: function($a){
        var t = $a.attr('title') || '';
        var icons = renderIcons($a.attr('data-caption-icons') || '[]');
        return t + (icons ? ' <span class="capicons">'+icons+'</span>' : '');
      },
      windowMargin: (window.innerWidth < 640) ? 6 : 40
    });
  }

  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (isTouch){
    var hint = $('<div class="tap-hint">Tap for full size</div>').appendTo('body');
    setTimeout(function(){ hint.addClass('show'); }, 500);
    setTimeout(function(){ hint.removeClass('show'); }, 3500);
  }

  var $src = $('#socials .icons'); var $dst = $('#footer .icons.cloned');
  if ($src.length && $dst.length){ $dst.html($src.html()); }

})(jQuery);
