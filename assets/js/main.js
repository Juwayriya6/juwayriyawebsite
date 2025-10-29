/*
	Credits:
		ajlkn @ GitHub
		kitbur @ GitHub
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$all = $body.add($header);

	// Breakpoints.
		breakpoints({
			xxlarge: [ '1681px',  '1920px' ],
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '1001px',  '1280px' ],
			medium:  [ '737px',   '1000px' ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);

		// Auto-update copyright year.
			$('.currentYear').text(new Date().getFullYear());
		});

	// Touch mode.
		if (browser.mobile)
			$body.addClass('is-touch');
		else {

			breakpoints.on('<=small', function() {
				$body.addClass('is-touch');
			});

			breakpoints.on('>small', function() {
				$body.removeClass('is-touch');
			});

		}

	// Fix: IE flexbox fix.
		if (browser.name == 'ie') {

			var $main = $('.main.fullscreen'),
				IEResizeTimeout;

			$window
				.on('resize.ie-flexbox-fix', function() {

					clearTimeout(IEResizeTimeout);

					IEResizeTimeout = setTimeout(function() {

						var wh = $window.height();

						$main.each(function() {

							var $this = $(this);

							$this.css('height', '');

							if ($this.height() <= wh)
								$this.css('height', (wh - 50) + 'px');

						});

					});

				})
				.triggerHandler('resize.ie-flexbox-fix');

		}

	// Gallery.
	$window.on('load', function () {
		var $gallery = $('.gallery');

		$gallery.poptrox({
			baseZIndex: 10001,
			useBodyOverflow: !breakpoints.active('<small'),
			usePopupEasyClose: !(browser.mobile || $body.hasClass('is-touch')),
			overlayColor: '#1f2328',
			overlayOpacity: 0.85,
			usePopupDefaultStyling: false,
			usePopupCaption: true,
			popupLoaderText: '',
			windowMargin: 50,
			usePopupNav: !browser.mobile,

			caption: function ($item) {
				var captionText = $item.find('img').attr('title') || $item.attr('title') || '';
				var iconsData = $item.data('caption-icons');
				var iconsArray = null;
				var allIconsHtml = '';

				if (typeof iconsData === 'string') {
					try { iconsArray = JSON.parse(iconsData); } catch (e) { iconsArray = null; }
				} else if (Array.isArray(iconsData)) {
					iconsArray = iconsData;
				}

				if (Array.isArray(iconsArray)) {
					iconsArray.forEach(function (iconData) {
						if (iconData && typeof iconData === 'object' && iconData.type && iconData.link) {
							var styleClass = '';
							var iconClass = '';
							var srLabel = String(iconData.type).charAt(0).toUpperCase() + String(iconData.type).slice(1);

							switch (String(iconData.type).toLowerCase()) {
								// Brand Icons
								case 'bluesky': styleClass = 'brands'; iconClass = 'fa-brands fa-bluesky'; srLabel = 'Bluesky'; break;
								case 'instagram': styleClass = 'brands'; iconClass = 'fa-brands fa-instagram'; srLabel = 'Instagram'; break;
								case 'youtube': styleClass = 'brands'; iconClass = 'fa-brands fa-youtube'; srLabel = 'YouTube'; break;
								case 'facebook': styleClass = 'brands'; iconClass = 'fa-brands fa-facebook-f'; srLabel = 'Facebook'; break;
								case 'twitter': styleClass = 'brands'; iconClass = 'fa-brands fa-twitter'; srLabel = 'Twitter'; break;
								case 'pinterest': styleClass = 'brands'; iconClass = 'fa-brands fa-pinterest'; srLabel = 'Pinterest'; break;
								case 'vimeo': styleClass = 'brands'; iconClass = 'fa-brands fa-vimeo-v'; srLabel = 'Vimeo'; break;
								case 'tumblr': styleClass = 'brands'; iconClass = 'fa-brands fa-tumblr'; srLabel = 'Tumblr'; break;
								case 'linkedin': styleClass = 'brands'; iconClass = 'fa-brands fa-linkedin-in'; srLabel = 'LinkedIn'; break;
								case 'patreon': styleClass = 'brands'; iconClass = 'fa-brands fa-patreon'; srLabel = 'Patreon'; break;

								// Solid Icons
								case 'ko-fi': styleClass = 'solid'; iconClass = 'fa-solid fa-coffee'; srLabel = 'Ko-fi'; break;
								case 'link': styleClass = 'solid'; iconClass = 'fa-solid fa-link'; srLabel = 'Link'; break;
								case 'info': styleClass = 'solid'; iconClass = 'fa-solid fa-info-circle'; srLabel = 'Information'; break;
							}

							if (iconClass) {
								allIconsHtml += '<a href="' + String(iconData.link) + '" target="_blank" rel="noopener noreferrer" class="poptrox-custom-icon-link icon ' + styleClass + '">' +
									'<i class="' + iconClass + '"></i>' +
									'<span class="sr-only">' + srLabel + '</span>' +
									'</a>';
							}
						}
					});
				}

				var safeCaptionText = $('<span></span>').text(captionText).html();
				return '<span class="poptrox-caption-text">' + safeCaptionText + '</span>' + allIconsHtml;
			},

			onPopupOpen: function () {
				var $currentPopup = $('.poptrox-popup');

				if (browser.mobile || $body.hasClass('is-touch')) {

					var $caption = $currentPopup.find('.caption');
					if ($caption.length > 0) {
						$caption.off('click.poptroxCaptionBg').on('click.poptroxCaptionBg', function (e) {
							if (e.target === this) {
								e.stopPropagation();
							}
						});
					}

					var checkImage, attempts = 0;
					checkImage = setInterval(function () {
						var $imageInPopup = $currentPopup.find('.pic img');

						if ($imageInPopup.length > 0 && $imageInPopup.attr('src')) {
							clearInterval(checkImage);

							$imageInPopup.parent().find('.poptrox-mobile-image-overlay').remove();
							var $overlayText = $('<div class="poptrox-mobile-image-overlay"><span>Tap for full size</span></div>');
							$imageInPopup.after($overlayText);

							$overlayText.off('click.poptroxOpenFile').on('click.poptroxOpenFile', function (e) {
								e.stopPropagation();
								e.preventDefault();
								const src = $(this).siblings('img').attr('src');
								if (src) {
									window.open(src, '_blank');
								}
							});
						}
						else {
							attempts++;
							if (attempts > 30) {
								clearInterval(checkImage);
							}
						}
					}, 100);
				}
			}
	    });

	    breakpoints.on('>small', function() {
	        $gallery.each(function() {
	            $(this)[0]._poptrox.windowMargin = 50;
	        });
	    });

	    breakpoints.on('<=small', function() {
	        $gallery.each(function() {
	            $(this)[0]._poptrox.windowMargin = 5;
	        });
	    });
	});

	// Data attributes: Get background images and positions
	$window.on('load', function () {
		$('[data-bg]').each(function () {
			var $this = $(this),
				bgUrl = $this.attr('data-bg');

			// Set background image
			if (bgUrl && bgUrl.trim() !== '') {
				$this.css('background-image', 'url(' + bgUrl + ')');

				// Preload the image
				$('<img/>').attr('src', bgUrl);
			}

			// Set background position
			var bgPosition = $this.attr('data-bg-position'); 
			if (bgPosition && bgPosition.trim() !== '') { 
				$this.css('background-position', bgPosition);
			}
		});
	});

	// Auto-sync social icons
	$(document).ready(function () {
		const $socialIcons = $('#social .icons').clone();
		$('#footer .icons').replaceWith($socialIcons);

		// Optional: Add footer-specific class for styling
		$('#footer .icons').addClass('footer-social');
	});

	// Section transitions.
		if (browser.canUse('transition')) {

			var on = function() {

				// Galleries.
					$('.gallery')
						.scrollex({
							top:		'30vh',
							bottom:		'30vh',
							delay:		50,
							initialize:	function() { $(this).addClass('inactive'); },
							terminate:	function() { $(this).removeClass('inactive'); },
							enter:		function() { $(this).removeClass('inactive'); },
							leave:		function() { $(this).addClass('inactive'); }
						});

				// Generic sections.
					$('.main.style1')
						.scrollex({
							mode:		'middle',
							delay:		100,
							initialize:	function() { $(this).addClass('inactive'); },
							terminate:	function() { $(this).removeClass('inactive'); },
							enter:		function() { $(this).removeClass('inactive'); },
							leave:		function() { $(this).addClass('inactive'); }
						});

					$('.main.style2')
						.scrollex({
							mode:		'middle',
							delay:		100,
							initialize:	function() { $(this).addClass('inactive'); },
							terminate:	function() { $(this).removeClass('inactive'); },
							enter:		function() { $(this).removeClass('inactive'); },
							leave:		function() { $(this).addClass('inactive'); }
						});

				// Contact.
					$('#contact')
						.scrollex({
							top:		'50%',
							delay:		50,
							initialize:	function() { $(this).addClass('inactive'); },
							terminate:	function() { $(this).removeClass('inactive'); },
							enter:		function() { $(this).removeClass('inactive'); },
							leave:		function() { $(this).addClass('inactive'); }
						});

			};

			var off = function() {

				// Galleries.
					$('.gallery')
						.unscrollex();

				// Generic sections.
					$('.main.style1')
						.unscrollex();

					$('.main.style2')
						.unscrollex();

				// Contact.
					$('#contact')
						.unscrollex();

			};

			breakpoints.on('<=small', off);
			breakpoints.on('>small', on);

		}

	// Events.
		var resizeTimeout, resizeScrollTimeout;

		$window
			.on('resize', function() {

				// Disable animations/transitions.
					$body.addClass('is-resizing');

				clearTimeout(resizeTimeout);

				resizeTimeout = setTimeout(function() {

					// Update scrolly links.
						$('a[href^="#"]').scrolly({
							speed: 1500,
							// offset: $header.outerHeight() - 1
						});

					// Re-enable animations/transitions.
						setTimeout(function() {
							$body.removeClass('is-resizing');
							$window.trigger('scroll');
						}, 0);

				}, 100);

			})
			.on('load', function() {
				$window.trigger('resize');
			});

})(jQuery);