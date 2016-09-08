// If JavaScript is enabled remove 'no-js' class and give 'js' class
jQuery('html').removeClass('no-js').addClass('js');


// When DOM is fully loaded
jQuery(document).ready(function($) {


	/* Main Settings
	 ---------------------------------------------------------------------- */
	var settings = {
		// Navigation height
		nav_height: $('.nav-container').css('height').replace('px', ''),

		// Animations on mobile devices
		animations : false,

		// Text intro
		text_pasue_time : 3000, // Pause between next text
		one_loop : true, // Play only one

		// Navigation
		auto_response : true, // Auto create responsive menu based on main navigation
		deeplinking : true,  // Use project deeplinking
		project_path : '/',  // Ajax hash path

	};

	// Configure preloader
	NProgress.configure({ showSpinner: false });

	// Add special class for IE10
	if (Function('/*@cc_on return document.documentMode===10@*/')()){
    	document.documentElement.className+=' ie10';
	}

	// Small resize helper function
	function onWindowResize( callback ) {
	    var width = $(window).width(),
	        height = $(window).height();

	    $(window).resize(function() {
	        var newWidth = $(window).width(),
	            newHeight = $(window).height();

	        if (newWidth !== width || newHeight !== height) {
	            width = newWidth;
	            height = newHeight;
	            callback();
	        }
	    });
	}


	/* Detect Touch Device and set animations
	 ---------------------------------------------------------------------- */
	(function() {

		if (Modernizr == 'undefined') return;

		if (Modernizr.touch) {

			$('body').addClass('touch-device');

		}

		// Set animations on mobile devices
		var current_width = $(window).width();

	    if (Modernizr.touch && current_width <= 568 && !settings.animations) {
	      	settings.animations = false;
	    } else {
	    	settings.animations = true;
	    }

    	// console.log(settings.animations, current_width)

	})();


	/* Fullwidth player
	 ---------------------------------------------------------------------- */
	(function() {
		// Small fix for rel attribute
		$('a[data-cover]').each(function(){
			var
				$cover = $(this).data('cover');

			$(this).attr('rel', $cover);
		});

		$(window).load(function() {
			if ($.fn.fullwidthAudioPlayer) {
				//put your own soundcloud key here
	    		$('#fap').fullwidthAudioPlayer({
	    			autoPlay: false,
	    			hideOnMobile: false,
	    			opened: false
	    		});
	    	}
    	});

	})();


	/* Intro section
	 ---------------------------------------------------------------------- */
	(function() {

		var intro = function(){
			var
			 	intro = $('.intro-resize'),
				win_width = $(window).width(),
				win_height = $(window).height(),
				intro_height = win_height;

			intro.css({
				height: intro_height+'px'
			});

			// Center content
			var container = $('.container', intro),
				container_height = container.height(),
				intro_h = intro.height(),
				margin = (intro_h - container_height) / 2;

			container.css({
				'margin-top' : margin+'px'
			});
		}
		// Init intro
		intro();

		$(window).on('resize', intro);

		// Ticker
		function tick(){
			$('#ticker li:first').slideUp({
				duration: 600,
    			easing: 'easeOutSine',
    			complete: function(){
					$(this).appendTo($('#ticker')).slideDown();
				}
			});
		}
		if (settings.animations) {
			setInterval(function(){tick()}, 4000);
		}

		// Scroll arrow
		function scroll_arrows() {
			$('#scroll-arrows').find('img').stop()
			.animate({
				marginTop: '15px'
			}, 1000, 'easeOutSine', function(){
			    $('#scroll-arrows').find('img').stop().animate({
			        marginTop: '-5px'
			    }, 1000, 'easeInOutSine', function(){
		        	scroll_arrows();
		    	});
		    });
		}
		if (settings.animations) {
			scroll_arrows();
		}

	})();


	/* Dynamic scripts
	 Scripts to be loaded also by ajax.
	 ---------------------------------------------------------------------- */
	function scripts(container) {


		/* Tweets
	 	 ------------------------- */
		$('.tweets', container).each(function(){

			var
				$this = $(this),
				$count = $this.data('tweets-count'),
				$php_url = 'plugins/tweets.php';

			if($count == undefined || $count == '') $count = 1;

			$this.html('Please wait...');

			$.ajax({
				url: $php_url,
				dataType: 'html',
				timeout: 10000,
				type: 'GET',
				error:
					function(xhr, status, error) {
						$this.html('An error occured: ' + error );
					},
				success:
					function(data, status, xhr) {
						$this.html(data).hide();
						$('li:nth-child('+$count+') ~ li', $this).remove();
						$('li:first-child', $this).addClass('first-item');
						$this.show();
					}
			});

		});


		/* Resonsive videos
	 	 ------------------------- */
		if ($.fn.ResVid) {
			$(container).ResVid();
		}


		/* Masonry boxes and events
		 ------------------------- */

		// Boxes
		$('.masonry', container).isotope({
			itemSelector : '.brick',
			masonry: {
    			columnWidth: $('.masonry', container).width()/4
  			},
  			resizable : false,
			containerStyle: { position: 'relative', overflow: 'visible' }
		});

		// Events
		$('.masonry-events', container).isotope({
			containerStyle: { position: 'relative', overflow: 'visible' }
		});

		onWindowResize(function() {

			$('.masonry', container).isotope({
				masonry: {
    				columnWidth: $('.masonry', container).width()/4
  				}
			});
			$('.masonry, .masonry-events', container).isotope('layout');
		});


		/* Toggle content
	 	 ------------------------- */
		$('.toggle').each(function() {

			/* Init */
			$('.active-toggle', this).next().show();

			/* List variables */
			var toggle = $(this);

			/* Click on Toggle Heading */
			$('h4.toggle-title', this).click(function () {
				if ($(this).is('.active-toggle')) {
					$(this).removeClass('active-toggle');
					$('.toggle-content', toggle).slideUp(400);
				} else {
					$(this).addClass('active-toggle');
					$('.toggle-content', toggle).slideDown(400);
				}
				return false;
			});

		});


		/* Tabs
	 	 ------------------------- */
		$('.tabs-wrap').each(function() {

			/* List variables */
			var tabs = $(this);

			/* Init */
			$('.tab-content', this).hide();
			$('.tab-content:first', this).css('display', 'block');
			$('ul.tabs li:first a', this).addClass('active-tab');

			/* Click on Tab */
			$('ul.tabs li', this).click(function () {
				if (!$(this).is('tab-active')) {
					var current = $(this).index();
					$('ul.tabs li a', tabs).removeClass('active-tab');
					$('a', this).addClass('active-tab');
					$('.tab-content:not(:eq(' + current + '))', tabs).css('display', 'none');
					$('.tab-content:eq(' + current + ')', tabs).css('display', 'block');
				}
				return false;
			});

		});


		/* Flexslider
	 	 ------------------------- */
		$('.flexslider', container).flexslider({
			animation: 'slide',
			prevText: '',           //String: Set the text for the "previous" directionNav item
			nextText: ''
		});


		/* Add special function for music player to loaded content
	 	 ------------------------- */
		if ($.fn.fullwidthAudioPlayer && container != 'html') {

			// Single track
			$('.fap-single-track', container).click(function(e){
				// Get attributes
				var
					trackUrl = $(this).attr('href'),
					title = $(this).attr('title'),
					meta = $(this).data('meta'),
					cover = $(this).attr('rel'),
					linkUrl = $(this).attr('target'),
					playIt = $(this).data('enqueue');

					if (title == undefined) title = '';
					if (meta == undefined) meta = '';
					if (cover == undefined) cover = '';
					if (linkUrl == undefined) linkUrl = '';
					if (playIt == undefined || playIt == 'no')
						playIt = false;
					else
						playIt = true;

				// Add track to player
				$.fullwidthAudioPlayer.addTrack(trackUrl, title, meta, cover, linkUrl, playIt);
				$.fullwidthAudioPlayer.toggle();
				e.preventDefault();
			});

			// Playlist
			$('.fap-add-playlist', container).click(function(e){

				// Get playlist ID
				playlist = $(this).data('playlist');

				if (playlist == undefined || !$('ul[data-playlist="'+playlist+'"]', container).length) return;
				playlist = $('ul[data-playlist="'+playlist+'"]', container);

				// Add tracks to the player
				$('li > a', playlist).each(function(i){
					// Get attributes
					var
						trackUrl = $(this).attr('href'),
						title = $(this).attr('title'),
						meta = $(this).data('meta'),
						cover = $(this).attr('rel'),
						linkUrl = $(this).attr('target');

						if (title == undefined) title = '';
						if (meta == undefined) meta = '';
						if (cover == undefined) cover = '';
						if (linkUrl == undefined) linkUrl = '';

					playIt = true;

					// Add track to player
					$.fullwidthAudioPlayer.addTrack(trackUrl, title, meta, cover, linkUrl, playIt);
				});

				$.fullwidthAudioPlayer.toggle();
				e.preventDefault();
			});

		}

		/* Fancybox (lightbox)
	 	 ------------------------- */
	 	function formatTitle(title, currentArray, currentIndex, currentOpts) {
    		return '<div id="fancybox-title">' + (title && title.length ? title : '' ) + '<span>(' + (currentIndex + 1) + ' / ' + currentArray.length + ')</span></div>';
		}

	 	// Add Fancybox only for images
		$('.imagebox', container).fancybox({
			overlayOpacity : .9,
			overlayColor: '#000',
			padding: 0,
			titleFormat: formatTitle
		});

		// Add Fancybox only for media
		$('.mediabox', container).fancybox({
			type: 'iframe',
			centerOnScroll : true,
			autoScale : true,
			overlayOpacity : .9,
			padding: 0,
			overlayColor: '#000',
			titleFormat: formatTitle,

			onStart : function(e) {
				var
					$el = $(e);

				if ($el.data('width') != 'auto')
					this.width = $el.data('width');
				if ($el.data('height') != 'auto')
					this.height = $el.data('height');
        	}
		});


		/* TopTip - Tooltip
	 	 ------------------------- */

		// Disable Thumb slide effect on touch devices
		if (!Modernizr.touch) {

			// Init thumb slider
			$('.tip', container).topTip();
		}


		/* Smooth Scroll
	 	 ------------------------- */
		$('.smooth-scroll', container).on('click', function(e){
			var
				$id = $(this).attr('href');

			// If element exists
			if ($($id).length) {
				$.scrollTo($id, 750, {
					easing: 'swing',
					offset: {top:-settings.nav_height, left:0}
				});
			}
			e.preventDefault();
		});


		/* Countdown
	 	 ------------------------- */
		if ($.fn.countdown) {

			$('.countdown').each(function(e) {
				var date = $(this).data('event-date');

		        $(this).countdown(date, function(event) {
		            var $this = $(this);

		            switch(event.type) {
		                case "seconds":
		                case "minutes":
		                case "hours":
		                case "days":
		                case "weeks":
		                case "daysLeft":
		                    $this.find('.' + event.type).html(event.value);
		                    break;

		                case "finished":

		                    break;
		            }
		        });
		    });
	    }


		/* Google maps
	 	 ------------------------- */
		if ($.fn.gMap) {

			$('.gmap', container).each(function(){
				var
					$gmap = $(this),
					$address = $gmap.data('address'), // Google map address e.g 'Level 13, 2 Elizabeth St, Melbourne Victoria 3000 Australia'
					$zoom = $gmap.data('zoom'),// Map zoom value. Default: 16
					$zoom_control = $gmap.data('zoom_control'), // Use map zoom. Default: true
					$scrollwheel = $gmap.data('scrollwheel'); // Enable mouse scroll whell for map zooming: Default: false

				$gmap.gMap({
					address: $address,
					zoom: $zoom,
					zoomControl: $zoom_control,
					scrollwheel: $scrollwheel,
					markers: [
						{ 'address' : $address }
					],
					icon: {
				    	image: 'img/map-marker.png',
				    	iconsize: [48,56],
				    	iconanchor: [20,56]
				    }
				});

			});
		}

	}

	// Init scripts
	scripts('html');


	/* Stats
	 ---------------------------------------------------------------------- */
	(function() {

		$('ul.stats').each(function(){

			// Variables
			var
				$max_el       = 6,
				$stats        = $(this),
				$stats_values = [],
				$stats_names  = [],
				$timer        = $stats.data('timer'),
				$stats_length;

			// Get all stats and convert to array
			// Set length variable
			$('li', $stats).each(function(i){
				$stats_values[i] = $('.stat-value', this).text();
				$stats_names[i] = $('.stat-name', this).text();
			});
			$stats_length = $stats_names.length;

			// Clear list
			$stats.html('');

			// Init
			display_stats();

			// Set $timer
			var init = setInterval(function(){
				display_stats();
			},$timer);

			// Generate new random array
			function randsort(c,l,m) {
    			var o = new Array();
		    	for (var i = 0; i < m; i++) {
		        	var n = Math.floor(Math.random()*l);
		        	var index = jQuery.inArray(n, o);
		        	if (index >= 0) i--;
		       		else o.push(n);
		    	}
		    	return o;
			}

			// Display stats
			function display_stats(){
				var random_list = randsort($stats_names, $stats_length, $max_el);
				var i = 0;

				// First run
				if ($('li', $stats).size() == 0) {
					for (var e = 0; e < random_list.length; e++) {
						$($stats).append('<li class="col-1-3"><span class="stat-value"></span><span class="stat-name"></span></li>');
					}
				}
				// small CSS fix for IE8
				if ($('html').hasClass('lt-ie9')) {
					$('li:nth-child(3n+3)', $stats).addClass('last');
					$('li:nth-child(odd)', $stats).addClass('odd');
				}

				var _display = setInterval(function(){

					var num = random_list[i];
						stat_name = $('li', $stats).eq(i).find('.stat-name');
						stat_name.animate({bottom : '-40px', opacity : 0}, 400, 'easeOutQuart', function(){
							$(this).text($stats_names[num]);
							$(this).css({bottom : '-40px', opacity : 1});
							$(this).animate({ bottom : 0}, 400, 'easeOutQuart');
						});

						stat_value = $('li', $stats).eq(i).find('.stat-value');
						display_val(stat_value, num);
					i++;
					if (i == random_list.length)
						clearInterval(_display);
				},600);
			}

			// Display value
			function display_val(val, num) {
				var
					val_length = $stats_values[num].length,
					val_int = parseInt($stats_values[num]),
					counter = 10,
					delta = 10,
					new_val;

				// Delta
				if (val_int <= 50) delta = 1;
				else if (val_int > 50 && val_int <= 100) delta = 3;
				else if (val_int > 100 && val_int <= 1000) delta = 50;
				else if (val_int > 1000 && val_int <= 2000) delta = 100
				else if (val_int > 2000 && val_int <= 3000) delta = 150;
				else if (val_int > 3000 && val_int <= 4000) delta = 200;
				else delta = 250;

				var _display = setInterval(function(){

					counter = counter+delta;
					new_val = counter;
					val.text(new_val);
					if (new_val >= val_int) {
						clearInterval(_display);
						val.text($stats_values[num]);
					}

				},40);

			}

		});

	})();


	/* Small Functions
	 ---------------------------------------------------------------------- */
	(function() {


		/* Parallax settings
	 	 ------------------------- */
		/* .parallax(xPosition, speedFactor, outerHeight) options:
		   xPosition - Horizontal position of the element
		   inertia - speed to move relative to vertical scroll. Example: 0.1 is one tenth the speed of scrolling, 2 is twice the speed of scrolling
		   outerHeight (true/false) - Whether or not jQuery should use it's outerHeight option to determine when a section is in the viewport
		*/
		if ($.fn.parallax != 'undefined') {
			$('.parallax').each(function(){
				$(this).parallax('50%', $(this).data('interia'), false);
			});

		}


		/* Masonry event hover effect
	 	 ------------------------- */
		$('.event-brick').on('hover', function(e){

			if(e.type == 'mouseenter') {
    			$(this).addClass('active');
  			}
  			else if (e.type == 'mouseleave') {
    			$(this).removeClass('active');
  			}
		});


		/* Search
	 	 ------------------------- */
		$('#nav-search').on('click', function(e){
			$('#search-wrap').slideToggle(400);
			e.preventDefault();
		});


		/* Fancy dropdown list
	 	 ------------------------- */
	 	$(document).on('mouseenter', '.fancy-dd', function() {
    		$(this).find('ul').stop(true, true).slideDown(600,'easeOutExpo');
		});
		$(document).on('mouseleave', '.fancy-dd', function() {
			$(this).find('ul').stop(true, true).slideUp(600,'easeOutExpo');
		});

		// Touch devices fix
		if (Modernizr.touch) {
			$('.fancy-dd').unbind('mouseenter mouseleave');
			$('.fancy-dd > a').click(function(e){
				$(this).parent().find('ul').stop(true,true).slideToggle(600,'easeOutExpo');
				e.preventDefault();
			});
		}

	})();


	/* Navigation
	 ---------------------------------------------------------------------- */
	(function() {

		/* Main navigation
	 	 ------------------------- */
		var
			$nav = $('#nav').children('ul');

		// Create main navigation
		$('li', $nav).on('mouseenter', function() {
			var
				$this = $(this),
				$sub  = $this.children('ul');
			if ($sub.length) $this.addClass('active');
			$sub.hide().stop(true, true).fadeIn(200);
		}).on('mouseleave', function() {
			$(this).removeClass('active').children('ul').stop(true, true).fadeOut(50);
		});


		/* Sticky navigation
	 	 ------------------------- */

	 	// grab the initial top offset of the navigation
		var
			sticky_nav = $('#main-nav'),
			sticky_navigation_offset_top = sticky_nav.offset().top-settings.nav_height-2;
			hiddenNav = false;

		// our function that decides weather the navigation bar should have "fixed" css position or not.
		var sticky_navigation = function(){
			var scroll_top = $(window).scrollTop(); // our current vertical position from the top

			// if we've scrolled more than the navigation, change its position to fixed to stick to top, otherwise change it back to relative
			if (scroll_top > sticky_navigation_offset_top) {
				sticky_nav.addClass('sticky');
				if (sticky_nav.hasClass('hide')) {
					hiddenNav = true;
					sticky_nav.removeClass('hide')
					.css({
						'top' : '-65px'
					})
					.stop()
					.animate({
						'top' : 0
					},400, 'easeOutSine');
				}
			} else {
				if (hiddenNav) {
					sticky_nav
					.stop()
					.animate({
						'top' : '-65px'
					},200, 'easeOutSine', function(){
						sticky_nav.removeClass('sticky').addClass('hide');
					});
				} else {
					sticky_nav.removeClass('sticky').addClass('hide');
				}

			}
		};

		// and run it again every time you scroll
		$(window).scroll(function() {
			 sticky_navigation();
		});


		/* Responsive navigation
	 	 ------------------------- */

		// Auto create responsive menu based on main navigation
		if (settings.auto_response) {

			var
				$responsive = $('#nav').clone();

			// Add class
			$('ul:not(:first-child)', $responsive).addClass('dl-submenu');
			$('> ul', $responsive).addClass('dl-menu');

			// Remove main nav container
			$responsive = $responsive.children('ul');

			// Put menu in nav container
			$('#dl-menu').append($responsive);

		}

		// Init dlmenu() plugin
		if ($.fn.dlmenu) $('#dl-menu').dlmenu();

		// if ($.fn.dlmenu) $('#dl-menu').dlmenu({
		// 	onLinkClick : function( el, ev ) {
		// 		$('#dl-menu').dlmenu('closeMenu');
		// 		return false;
		// 	}
		// });

		// Overflow fix on mobile devices
		$('#dl-menu ul').css('max-height', ($(window).height()-settings.nav_height)+"px");
		$(window).resize(function(){
			//var $height = $(window).height()-$("#main-nav").height();
			$('#dl-menu ul').css('max-height', ($(window).height()-settings.nav_height)+"px");
		});


		/* One page plugin nav settings
	 	 ------------------------- */
		$nav_settings = {
			currentClass: 'current',
			changeHash: false,
			scrollSpeed: 750,
			scrollOffset: settings.nav_height,
			scrollThreshold: 0.01,
			filter: ':not(.external,.page-by-ajax)',
			easing: 'swing'
		};

		if ($.fn.onePageNav) {
			// Init one page navigation
			if ($('#nav').hasClass('one-page-nav'))
				$('#nav').onePageNav($nav_settings);

			// Init one page navigation
			if ($('#dl-menu').hasClass('one-page-nav'))
				$('#dl-menu').onePageNav($nav_settings);
		}

	})();


	/* Portfolio
	 ---------------------------------------------------------------------- */
	(function() {

		if (!$.fn.isotope) return;


		var $container = $('.items'),
		 	$win = $(window),
		 	$imgs = $('img.lazy');

		if ($container.length) {


			/* Isotope
	 	 	 ------------------------- */
			onWindowResize(function() {
				$container.isotope('layout');
			});
			$(window).load(function() {
				$container.isotope({
					itemSelector : '.item',
				    onLayout: function() {
				        $win.trigger('scroll');
				    }
				});
			});

			// Load images
			$imgs.jail({effect : 'fadeIn'});

			// Add filter event
			function _items_filter($el, $data) {

				// Add all filter class
				$el.addClass('item-filter');

				// Add categories to item classes
				$('.item', $container).each(function(i) {
					var
						$this = $(this);
						$this.addClass($this.attr($data));
				});

				$el.on('click', 'a', function(e){
					var
						$this   = $(this),
						$option = $this.attr($data);

					// Add active filter class
					$('.item-filter').removeClass('active-filter');
					$el.addClass('active-filter');
					$('.item-filter:not(.active-filter) li a').removeClass('active');
					$('.item-filter:not(.active-filter) li:first-child a').addClass('active');

					// Add/remove active class for this filter
					$el.find('a').removeClass('active');
					$this.addClass('active');

					if ($option) {
						if ($option !== '*') $option = $option.replace($option, '.' + $option)
						$container.isotope({ filter : $option });
					}

					e.preventDefault();

				});

				$el.find('a').first().addClass('active');
			}

			// Init filters
			if ($('.dd-filter-list').length) _items_filter($('.dd-filter-list'), 'data-categories');
			if ($('.filter-list').length) _items_filter($('.filter-list'), 'data-categories');

		}


	})();


	/* Contact Form
	 ---------------------------------------------------------------------- */
	(function() {

		var $form = $('.contact-form');

		$form.append('<div id="ajax-message" style="display:none"></div>');
		var $ajax_message = $('#ajax-message');

		// Submit click event
		$form.on('click', 'input[type=submit]', function(e){

			$ajax_message.hide();

			// Show loader
			NProgress.start();

			// Ajax request
			$.post('plugins/contact-form.php', $form.serialize(), function(data) {

				// Show ajax-message
				$ajax_message.html(data).show();

				// Hide preloader
				NProgress.done();

				// If the message was sent, clear form fields
				if (data.indexOf("success") != -1) {
					clear_form_elements($form);
				}
			});

			e.preventDefault();
		});

		function clear_form_elements(el) {

		    $(el).find(':input').each(function() {
		        switch(this.type) {
		            case 'password':
		            case 'select-multiple':
		            case 'select-one':
		            case 'text':
		            case 'email':
		            case 'textarea':
		                $(this).val('');
		                break;
		            case 'checkbox':
		            case 'radio':
		                this.checked = false;
		        }
		    });

		}

	})();


	/* Ajax Pages
	 ---------------------------------------------------------------------- */
	(function() {

		// Portfolio
		// create a new instance of the plugin
    	var project_page = new $.PageLoader($('.project-by-ajax'), {
			container_class : 'custom-container',
			top_offset : -settings.nav_height,
			deeplinking : true,
			debug : false,
			load_from_hash : true,
			load_start : function(){
				// I get fired when the ajax is starting load content

				// Show preloader
				NProgress.start();
			},
			load_end : function(e){
				// I get fired when the ajax is ending load content
				// Init scripts
				scripts(e);

				// Hide preloader
				NProgress.done();

				// Bind click event to project navigation in loaded content
				$('.page-nav a:not(".disabled")', e).on('click', project_page.open)
				.on('click', function(e){

					var link = $(this).attr('href');
					// Add .active class
					$('#portfolio-items a[href="'+link+'"]').addClass('active');

					 e.preventDefault();
				});
			},
			close : function(){

				// Scroll to portfolio filter
				$.scrollTo('#portfolio-main-filter', 400,{offset: {top:-settings.nav_height-20, left:0}});
			}
		});


		// Events
		// create a new instance of the plugin
    	var event_page = new $.PageLoader($('.event-by-ajax'), {
			container_class : 'custom-container',
			top_offset : -settings.nav_height,
			deeplinking : true,
			debug : false,
			load_from_hash : true,
			load_start : function(){
				// I get fired when the ajax is starting load content

				// Show preloader
				NProgress.start();
			},
			load_end : function(e){
				// I get fired when the ajax is ending load content
				// Init scripts
				scripts(e);

				// Hide preloader
				NProgress.done();

				// Bind click to event navigation in loaded content
				$('.page-nav a:not(".disabled")', e).on('click', event_page.open)
				.on('click', function(e){

					var link = $(this).attr('href');
					// Add .active class
					$('#events-list a[href="'+link+'"]').addClass('active');

					 e.preventDefault();
				});
			},
			close : function(){

				// Scroll to portfolio filter
				$.scrollTo('#events-list', 400,{offset: {top:-settings.nav_height, left:0}});
			}
		});


		// Custom pages
		// create a new instance of the plugin
    	var custom_page = new $.PageLoader($('.page-by-ajax'), {
			container_class : 'custom-container',
			top_offset : -settings.nav_height,
			deeplinking : true,
			debug : false,
			load_from_hash : true,
			load_start : function(){
				// I get fired when the ajax is starting load content

				// Show preloader
				NProgress.start();
			},
			load_end : function(e){
				// I get fired when the ajax is ending load content
				// Init scripts
				scripts(e);

				// Hide preloader
				NProgress.done();

			},
			close : function(){

				// Scroll to portfolio filter
				$.scrollTo('#custom-page', 400,{offset: {top:-settings.nav_height, left:0}});
			}
		});


	})();

});

// Classes

/*
 * PageLoader ver. 1.0.0
 * jQuery Ajax Page Loader Plugin
 *
 * Copyright (c) 2013 Mariusz Rek
 * Rascals Labs 2013
 *
 */

(function($) {

    $.PageLoader = function(el, options) {

        var defaults = {
            container_class : 'custom-container',
			top_offset : 0,
			deeplinking : false,
			debug : false,
			autoload : false,
			load_from_hash : false,
			path : '/',
			load_start : function(){},
			load_end	: function(e, content){},
			close	: function(e){}
        }
        var plugin = this;
        	plugin.el = el;
        	plugin.$el = $(el);

		var pluginObj = plugin.$el.data('PageLoader', plugin.el);
			pluginObj.loading = false;

        plugin.settings = {};

        var init = function() {
            plugin.settings = $.extend({}, defaults, options);

            if (plugin.settings.load_from_hash) {
            	$(window).bind('hashchange', _load_from_hash);
            	_load_from_hash();
            }

            // code goes here
            plugin.$el.each(function(){
				// Add click event
				$(this).on('click', plugin.open);

            });

        }

        // Private Methods
        var _load_from_hash = function(e) {
        	// body...

        	// Compare hash link
					var hash = window.location.hash,
						hash_ok = hash.indexOf(plugin.settings.path);

					if (hash.length > 3 && hash_ok != -1) {
						var
							plugin_hash = hash.replace('#/','');

							plugin.$el.each(function(e){
								this_link = $(this).attr('href');
								if (this_link == plugin_hash) {
									plugin.load_page(this);
									return false;
								}
							});

					}

        }

        var _close = function(e) {

            // code goes here
            if (plugin.settings.debug) console.log('Close content.');

            // Get Ajax container
    		var ajax_container = $('.ajax-container', pluginObj.target);

			ajax_container
			.animate({
				top: -20,
				opacity: 0
			}, {
				queue: false,
				duration: 500,
				complete: function(){

				// Hide button
				$('.close-button' , pluginObj.target).hide();

				/* Remove link */
				if (plugin.settings.deeplinking) window.location.hash = '#/';
				$(pluginObj.target).empty();

				// Callback event after close action
				plugin.settings.close.call(undefined);
				}
			});

			$(pluginObj.target).removeClass('open');

			// Remove active thumbnail
			$('a[href="'+pluginObj.link+'"]').removeClass('active');

			pluginObj.element = null;
			pluginObj.link = null;

            e.preventDefault();
        }

        var _build_content = function() {

        	// If target container does not have content
        	if (plugin.settings.debug) console.log('_build_content');

     		if (!$(pluginObj.target).hasClass('open')) {
     			if (plugin.settings.debug) console.log("Add html elements to target container.");

				$(pluginObj.target).append('<div class="ajax-container '+plugin.settings.container_class+'"></div>');
				$(pluginObj.target).addClass('open');

				if (plugin.settings.debug) console.log('Content is available.');
				return;
     		} else {
     			if (plugin.settings.debug) console.log('Target container already has content.');
     			return;
     		}

        }

        var _load_content = function() {
        	if (plugin.settings.debug) console.log('_load_content');

  			/* Start loading */
			pluginObj.loading = true;

			// Set callback function
			plugin.settings.load_start.call(undefined);

			/* Change loaction link */
			if (plugin.settings.deeplinking) window.location.hash = '#/' + pluginObj.link;

			// Scroll to project container
			if ($.fn.scrollTo != undefined) {
				$.scrollTo(pluginObj.target, 400, {offset: {top:plugin.settings.top_offset, left:0}, onAfter: function(){
					_after_scroll();
				}});
			} else {
				$(document.body).scrollTop($(pluginObj.target).offset().top+plugin.settings.top_offset);
				_after_scroll();
			}

			pluginObj.loading = false;
        }

        var _after_scroll = function() {
        	var ajax_container = $('.ajax-container', pluginObj.target);
        	var window_height =  $(window).height();

			// Check if container exists
			if (ajax_container.contents().length == 0) {
				_ajax_action();
			} else {
				ajax_container
				.animate({
					top: -20,
					opacity: 0
				}, {
					queue: false,
					duration: 500,
					complete: function(){
						// Add min height to target container
						var target_height = $(pluginObj.target).height();
						$(pluginObj.target).css('min-height', window_height+'px');
						$(pluginObj.target).empty();
						$(pluginObj.target).removeClass('open');
						_build_content();
						_ajax_action();
					}
				});

			}

		};

		var _ajax_action = function() {
			var ajax_container = $('.ajax-container', pluginObj.target);

			$(pluginObj.target).addClass('open');

			// Set active link
			$('a[href="'+pluginObj.link+'"]').addClass('active');

			if (plugin.settings.debug) console.log("Add active class to element");

			ajax_container.load(pluginObj.link+' #ajax-content', function(response, status, xhr){

				// Bind close event
				$('.close-button', ajax_container).on('click', _close);

				// Error
				if (status == 'error') {

					if (plugin.settings.debug) console.log("Ajax transport error (" + pluginObj.link + "): " + xhr.status + " " + xhr.statusText);

					// Load 404 page
					ajax_container.load('404.html'+' #ajax-content', function(response, status, xhr){

						// Bind close event
						$('.close-button', ajax_container).on('click', _close);

						// Fire show content function
						_show_content();
						return false;
					});
				}

				/* Success */

				/* Check images are loaded */
				var
					image_count = $('img', ajax_container).length,
					images_loaded = 0;

				if (plugin.settings.debug) console.log("Images count: "+image_count);

				if (image_count == 0) {
					_show_content();
					return false;
				}
				$('img', ajax_container).load(function() {
					images_loaded++;

					if (images_loaded >= image_count) {
						if (plugin.settings.debug) console.log("Loaded images: " + image_count);
						_show_content();
						return false;
					}
				})
				.error(function() {
					image_count--;
					if (images_loaded >= image_count) {
						if (plugin.settings.debug) console.log("Loaded images: " + image_count);
						_show_content();
						return false;
					}
				});

			});
		};

        var _show_content = function() {
        	if (plugin.settings.debug) console.log("Show Content.");

        	$(pluginObj.target).css('min-height', '0px');

        	// Get Ajax container
    		var ajax_container = $('.ajax-container', pluginObj.target);

    		// Set Callback function
			plugin.settings.load_end.call(undefined, ajax_container);

			// Show content
			$('.close-button' , pluginObj.target).show();

			ajax_container.css({
				visibility: 'visible',
				top: -20
			})
			.animate({
				top: 0,
				opacity: 1
			}, {
				queue: false,
				duration: 500
			});

			// ajax_container.slideDown(600);

			// End loading
			pluginObj.loading = false;
			return false;
        };

        // Public Methods
        plugin.open = function(e) {
            // code goes here
            plugin.load_page(this);
            e.preventDefault();
        }
        plugin.load_page = function(el) {

            // Get metadata from link
        	var metadata = $(el).data('ajax-options');
        	if (metadata == undefined) return;

        	// If loading is enabled
     		if (pluginObj.loading) return false;

     		// Get old object if exists
     		if (pluginObj.element != undefined)
     			pluginObj.old_element = pluginObj.element;
     		else
     			pluginObj.old_element = null;
     		if (pluginObj.link != undefined)
     			pluginObj.old_link = pluginObj.link;
     		else
     			pluginObj.old_link = null;

     		// Add new object data to target
			pluginObj.element = $(el);
			pluginObj.link = $(el).attr('href');
			pluginObj.target = metadata.target;

     			// Compare current element with open element
     			if (pluginObj.old_link != pluginObj.link) {
     				// Remove old active class
					$('a[href="'+pluginObj.old_link+'"]').removeClass('active');

	     			// Build content
	     			_build_content();

	     			// Load content
	     			_load_content();

     			} else {
     				if ($.fn.scrollTo != undefined)
     					$.scrollTo(pluginObj.target, 400, { offset: {top:plugin.settings.top_offset, left:0}});
     				else
     					$(document.body).scrollTop($(pluginObj.target).offset().top+plugin.settings.top_offset);
     			}
     		return false;
        }

        init();

    }

})(jQuery);


/*
 * TextTyper ver. 1.0.0
 * jQuery Responsive Video Plugin
 *
 * Copyright (c) 2013 Mariusz Rek
 * Rascals Labs 2013
 *
 */

(function($){

 	$.fn.extend({

		//pass the options variable to the function
 		TextTyper: function(options) {


			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				syntax : ''
			}

			var options =  $.extend(defaults, options);

    		return $(this).each(function(index, element) {
				var
					$o = options,
					$txt_box = $(element),
					$my_txt = $txt_box.text(),
					$my_max = $my_txt.length,
					$rnd_str = "!#$%&/?abcdefghijklmnopqrstuvwxyz;ABCDEFGHIJKLMNOPQRSTUVWXYZ:0123456789",
					$set_max = $rnd_str.length,
					$interval = 2,
					$i = 0,
					$counter = 0,
					$flag = true,
					$intervalID = setInterval(enterframe, 10);

				$txt_box.text('');
				$txt_box.show();

				function enterframe() {
					if ($i < $my_max) {
						if ($counter < $interval) {
							$txt_box.text($my_txt.substr(0, $i));
							for ($j = $i; $j <$my_max; $j++) {
								$random = Math.floor(Math.random()*$set_max);
								$txt_box.append($rnd_str.charAt($random));
							}
							$counter++;
						} else {
							$counter = 0;
							$i++;
						}
					} else if ($flag) {
						$txt_box.text($my_txt);
						$flag = false;
					}
				}

    		});
    	}
	});

})(jQuery);


/*
 * TopTip ver. 1.1.0
 * jQuery Tooltip effect
 *
 * Copyright (c) 2013 Mariusz Rek
 * Rascals Labs 2013
 *
 */


(function($){

   $.fn.topTip = function(options) {

	   	//Set the default values, use comma to separate the settings, example:
		var defaults = {
			syntax : ''
		}

		var options =  $.extend(defaults, options);

	    $(this).on('mouseenter', function(e) {
			// Add tip object
			var
				tip = {},
				title = '',
				min_width = 200;
				mouse_move = false,
				tip = {
				'desc' : $(this).data('tip-desc'),
				'top' : $(this).offset().top,
				'content' :  $(this).find('.tip-content').html()
			};

			// Check if title is exists
			if (tip.content == undefined) return;

			// Append datatip prior to closing body tag
			$('body').append('<div id="tip"><div class="tip-content"><div class="tip-inner">'+tip.content+'</div></div></div>');

			// Set max width
			if ($(this).outerWidth() > min_width) {
				$('#tip .tip-inner').width($(this).outerWidth()-40);
			}

			// Store datatip's height and width for later use
			tip['h'] = $('#tip div:first').outerHeight()+100;
			tip['w'] = $('#tip div:first').outerWidth();

			// Set datatip's mask properties - position, height, width etc
			$('#tip').css({position:'absolute', overflow:'hidden', width:'100%', top:tip['top']-tip['h'], height:tip['h'], left:0 });

			// Animated effect
			if ($('.tip-content.animate', this).length) {

				// If function TextTyper not exists
	 			if (!$.fn.TextTyper) return;

	 			var tip_el = $('#tip');

	 			$('.tip-content', tip_el).addClass('animate');
	 			$('.tip-content span', tip_el).TextTyper();

	 		}

			// Mouse Move
			if (mouse_move) {
				// Set tip position
				$('#tip div').css({ left:e.pageX-(tip['w']/2), top:tip['h']+5 }).animate({ top:100 }, 500, 'easeOutBack');

				// Move datatip according to mouse position, whilst over instigator element
				$(this).mousemove(function(e){ $('#tip div').css({left: e.pageX-(tip['w']/2)}); });
			} else {
				// Set tip position
				var pos =  $(this).offset();
				$('#tip div').css({ left: pos.left+'px', top:tip['h']+5 }).animate({ top:100 }, 500, 'easeOutBack');
			}


	    }).on('mouseleave click', function(e) {

	      	// Remove datatip instances
	    	$('#tip').remove();

	    });

	}

})(jQuery);


/*
 * ResVid ver. 1.0.0
 * jQuery Responsive Video Plugin
 *
 * Copyright (c) 2013 Mariusz Rek
 * Rascals Labs 2013
 *
 */

(function($){

 	$.fn.extend({

		//pass the options variable to the function
 		ResVid: function(options) {


			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				syntax : ''
			}

			var options =  $.extend(defaults, options);

    		return $('iframe', this).each(function(i) {
				var
					$o = options,
					$iframe = $(this);
					$players = /www.youtube.com|player.vimeo.com/;

				if ($iframe.attr('src').search($players) > 0) {

					// Ratio
					var $ratio = ($iframe.height() / $iframe.width()) * 100;

					// Add some CSS to iframe
					$iframe.css({
						position : 'absolute',
						top : '0',
						left : '0',
						width : '100%',
						height : '100%'
					});

					// Add wrapper element
					$iframe.wrap('<div class="video-wrap" style="width:100%;position:relative;padding-top:'+$ratio+'%" />');
				}



    		});
    	}
	});

})(jQuery);


// HTML5 Placeholder support for non compliant browsers using jQuery.
(function($) {
  // @todo Document this.
  $.extend($,{ placeholder: {
      browser_supported: function() {
        return this._supported !== undefined ?
          this._supported :
          ( this._supported = !!('placeholder' in $('<input type="text">')[0]) );
      },
      shim: function(opts) {
        var config = {
          color: '#888',
          cls: 'placeholder',
          selector: 'input[placeholder], textarea[placeholder]'
        };
        $.extend(config,opts);
        return !this.browser_supported() && $(config.selector)._placeholder_shim(config);
      }
  }});

  $.extend($.fn,{
    _placeholder_shim: function(config) {
      function calcPositionCss(target)
      {
        var op = $(target).offsetParent().offset();
        var ot = $(target).offset();

        return {
          top: ot.top - op.top,
          left: ot.left - op.left,
          width: $(target).width()
        };
      }
      function adjustToResizing(label) {
      	var $target = label.data('target');
      	if(typeof $target !== "undefined") {
          label.css(calcPositionCss($target));
          $(window).one("resize", function () { adjustToResizing(label); });
        }
      }
      return this.each(function() {
        var $this = $(this);

        if( $this.is(':visible') ) {

          if( $this.data('placeholder') ) {
            var $ol = $this.data('placeholder');
            $ol.css(calcPositionCss($this));
            return true;
          }

          var possible_line_height = {};
          if( !$this.is('textarea') && $this.css('height') != 'auto') {
            possible_line_height = { lineHeight: $this.css('height'), whiteSpace: 'nowrap' };
          }

          var ol = $('<label />')
            .text($this.attr('placeholder'))
            .addClass(config.cls)
            .css($.extend({
              position:'absolute',
              display: 'inline',
              'float':'none',
              overflow:'hidden',
              textAlign: 'left',
              color: config.color,
              cursor: 'text',
              paddingTop: $this.css('padding-top'),
              paddingRight: $this.css('padding-right'),
              paddingBottom: $this.css('padding-bottom'),
              paddingLeft: $this.css('padding-left'),
              fontSize: $this.css('font-size'),
              fontFamily: $this.css('font-family'),
              fontStyle: $this.css('font-style'),
              fontWeight: $this.css('font-weight'),
              textTransform: $this.css('text-transform'),
              backgroundColor: 'transparent',
              zIndex: 99
            }, possible_line_height))
            .css(calcPositionCss(this))
            .attr('for', this.id)
            .data('target',$this)
            .click(function(){
              $(this).data('target').focus();
            })
            .insertBefore(this);
          $this
            .data('placeholder',ol)
            .focus(function(){
              ol.hide();
            }).blur(function() {
              ol[$this.val().length ? 'hide' : 'show']();
            }).triggerHandler('blur');
          $(window).one("resize", function () { adjustToResizing(ol); });
        }
      });
    }
  });
})(jQuery);

jQuery(document).add(window).bind('ready load', function() {
  if (jQuery.placeholder) {
    jQuery.placeholder.shim();
  }
});
