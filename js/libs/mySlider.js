/* mySlider
Requirement: jQuery
Usage: wrap <ul> element inside a <div> and call mySlider function upon parent <div> element
Full list of settings
settings = {
	autoUpdate: true,				// Allow dynamic changes of <ul> element (optional, default false)
	autoUpdateInterval: 1000,		// Time interval to perform auto update (optional, default 1000ms)
	width: '80%',					// Width (in %) of slider compared to window width
	height: '120px',				// Height (in px) of slider
	arrows: true,					// Toggle left & right arrows (optional, default false)
	arrowsWidth: '8%',				// Width (in %) of left & right arrows compared to slider (optional, default 8%)
	mainWidth: '80%',				// Width (in %) of main view compared to slider (optional, default 80% if arrows enabled and 100% otherwise)
	mainMargin: '0 2%',				// Margin (in %) of main view compared to slider (optional, default 0 2% if arrows enabled and 0 otherwise)
	navbar: true,					// Toggle navbar at the bottom of slider (optional, default false)
	navbarWidth: '80%',				// Width (in %) of bottom navbar compared to slider (optional, default 80%)
	mainHeight: '80%',				// Height (in %) of main view compared to slider (optional, default 80% if navbar enabled and 100% otherwise)
	imgPath: 'img',					// Path to img folder (where arrow_left.png & arrow_right.png present, optional, only needed if arrows enabled)
	itemWidth: '30%'//'100px'		// Width (in %) of each item compared to main view or absolute (in px)
	}
*/
(function($) {
	$.fn.mySlider = function(args){
		
		/* Internal variables */

		var settings = args;			// Store all custom settings
		var info = {};					// Store all extra necessary information
		var $target = $(this[0]);		// Caller of this function
		var id;							// Unique Element ID for this mySlider entity
		var $list,$navbar;				// <ul> element of this entity, navbar element (optional) of this entity
		var dragging = false;			// State of user-interaction

		/* Check for presence of compulsory settings */

		var checkInput = function(){
			if (!settings.width || !settings.height || !settings.itemWidth){
				$.error('mySlider requires width, height and itemWidth to be provided');
			}
		};

		/* Init structure for mySlider add necessary elements, classes and ids */

		var initStructure = function(){
			
			id = 'mySlider_'+$('div.mySlider_main').length;							// Unique ID for each mySlider entity

			$target.addClass('mySlider_container');									// Add container class
			$target.find('ul').wrap('<div class="mySlider_main" id="'+id+'"/>');	// Add main element

			/* Add navigation arrows (optional) */
			
			if (settings.arrows){
				var arrow = "<div class=\"mySlider_arrow\"><span class=\"dummy\"></span><img class=\"enabled\"/><img class=\"disabled\"/></div>";

				/* Left arrow */

				$target.prepend(arrow);
				$target.find('.mySlider_arrow:first-child img.enabled').attr('src',settings.imgPath+'/arrow_left.png');
				$target.find('.mySlider_arrow:first-child img.disabled').attr('src',settings.imgPath+'/arrow_left_disabled.png');
				
				/* Right arrow */

				$target.append(arrow);
				$target.find('.mySlider_arrow:last-child img.enabled').attr('src',settings.imgPath+'/arrow_right.png');
				$target.find('.mySlider_arrow:last-child img.disabled').attr('src',settings.imgPath+'/arrow_right_disabled.png');
			}
				
			/* Add bottom navigation bar (optional) */
			
			if (settings.navbar){
				var navbar = "<div class=\"mySlider_navbar\"><ul></ul></div>";
				$target.append(navbar);
			}
		};

		/* Set initial dimensions & Calculate necessary information */

		var initDimension = function(){

			$target.css({					// Set width (%) and height (px) for mySlider_container
				width: settings.width,
				height: settings.height
			});

			$list = $target.find('#'+id+' ul');					// <ul> element of this entity
			info.listLength = $list.find('li').length;			// Number of <li> elements
			info.autoUpdateInterval = settings.autoUpdateInterval || 1000;	// Auto Update interval (default 1000ms)
			
			if (settings.arrows){	// If arrows are enabled, if not use only CSS
				info.arrowsWidth = settings.arrowsWidth || '8%';	// Width (%) of arrows in mySlider_container
				info.mainWidth = settings.mainWidth || '80%';		// Width (%) of main view in mySlider_container
				info.mainMargin = settings.mainMargin || '0 2%';	// Margin of main view

				/* Adjust width & margin of mySlider_main incase arrows are enabled */

				$target.find('.mySlider_main').css({
					width: info.mainWidth,
					margin: info.mainMargin
				});
			}

			if (settings.navbar){	// If navbar is enabled, if not use only CSS
				info.navbarWidth = settings.navbarWidth || '80%';	// Width (%) of navbar in mySlider_container
				info.navbarMargin = (100 - parseFloat(info.navbarWidth))/2;		// Margin (%) of navbar
				info.mainHeight = settings.mainHeight || '80%';		// Height (%) of main view in mySlider_container
				$target.find('.mySlider_main').css('height',info.mainHeight);
			}
			
			/* Convert to width & height in pixels */

			setTimeout(function(){

				info.mainHeightPx = parseFloat($list.parent().css('height'));	// Height (px) of main view
				info.mainWidthPx = parseFloat($list.parent().css('width'));		// Width (px) of main view
				info.navbarHeight = parseFloat(settings.height) - info.mainHeightPx;	// Height (px) of navbar
				
				if (settings.itemWidth.indexOf("px") == -1){			// Width (%) of each <li> element in main view
					info.itemWidth = parseFloat(settings.itemWidth) * info.mainWidthPx / 100;
				}
				else {													// Width (px) of each <li> element
					info.itemWidth = parseFloat(settings.itemWidth);
				}

				info.margin = parseFloat($list.find('li:last-child').css('margin-left'));	// Margin-left (px) of each <li> element
				info.listWidth = (info.itemWidth + info.margin) * (info.listLength-1) + info.itemWidth;	// Width (px) of <ul> element
				info.viewCount = Math.ceil(info.listWidth / info.mainWidthPx);	// Total number of views needed
				info.viewIdx = 0;												// Current view, initial = 0
				
				$target.find('.mySlider_main').css({	// Set line-height (px) for main view
					'line-height': info.mainHeightPx+'px'
				});

				$list.css({						// Set width (px) for <ul> element
					width: info.listWidth
				});

				$list.find('li').css({			// Set width (px or %) for each <li> element
					width: info.itemWidth
				});

				if (settings.arrows){			// Set dimensions for arrows
					
					/* Adjust width of mySlider_arrow */
					$target.find('.mySlider_arrow').css({
						width:info.arrowsWidth,
						'line-height': info.mainHeightPx+'px'
					});
				}

				if (settings.navbar){			// Set dimensions for navbar
					$target.find('.mySlider_navbar').css({	// Set width and margin (%) for navbar
						width: info.navbarWidth,
						margin: '0 '+info.navbarMargin+'%'
					});

					/* Adjust height of arrows incase navbar is enabled */
					if (settings.arrows){
						$target.find('.mySlider_arrow').css('height',info.mainHeight);
					}
					$target.find('.mySlider_navbar ul').css({	// Set line-height (px) for <ul> element in navbar
						'line-height': info.navbarHeight +'px'
					});
					setNavBar($list);	// Create actual navbar and bind actions to navbar <li> elements
				}
			},50);
		};

		/* Auto update <ul> element for dynamical changes */

		var autoUpdate = function(){

			if ($list.find('li').length != info.listLength){
				info.listLength = $list.find('li').length;
				info.listWidth = (info.itemWidth + info.margin) * (info.listLength-1) + info.itemWidth;
				info.viewCount = Math.ceil(info.listWidth / info.mainWidthPx);
				
				$list.css({					// Reset width (px) of <ul> element
					width: info.listWidth
				});
				
				$list.find('li').css({		// Reset width (px) for all <li> elements
					width: info.itemWidth
				});
				
				adjustPosition($list,false);		// Adjust current view
				setNavBar($list);			// Update navbar
			}

			/* Register click/touch event for <li> elements */

			$list.find('li').off('mouseup touchend');
			$list.find('li').on('mouseup touchend',function(ev){
				ev.preventDefault();
				if (!dragging){
					$(this).trigger('mySlider_click_event');
				}
			});

			/* Run autoupdate every autoUpdateInterval */
			setTimeout(function(){
				autoUpdate();
			},info.autoUpdateInterval);
		};

		/* Create and bind actions to navbar <li> elements */

		var setNavBar = function($list){
			var temp = [];
			for (var i = 0; i < info.viewCount; i++){
				temp.push('<li/>');
			}
			$target.find('.mySlider_navbar ul').empty().append(temp.join(''));
			$navbar = $target.find('.mySlider_navbar ul li');
			
			/* Set current active view */

			$navbar.removeClass('active');
			$navbar.eq(info.viewIdx).addClass('active');

			/* Binding navbar to click/touch events */
			
			$navbar.off('mouseup touchend');
			$navbar.on('mouseup touchend', function(ev){
				ev.preventDefault();
				info.viewIdx = $navbar.index(this);
				$navbar.removeClass('active');
				$navbar.eq(info.viewIdx).addClass('active');

				if ((info.viewIdx == (info.viewCount - 1))&&(info.viewIdx > 0)){
					endLeft = info.mainWidthPx - info.listWidth;
				}
				else {
					endLeft = - info.viewIdx * info.mainWidthPx;
				}

				$list.animate({
					left: endLeft + 'px'
				},200,function(){
					adjustPosition($list,false);
				});
			});
		};
		
		/* Adjust current view */

		var adjustPosition = function($list,quick){
			var dis,items;

			var $leftArrowEn = $target.find('.mySlider_arrow').eq(0).find('img.enabled');
			var $leftArrowDis = $target.find('.mySlider_arrow').eq(0).find('img.disabled');
			var $rightArrowEn = $target.find('.mySlider_arrow').eq(1).find('img.enabled');
			var $rightArrowDis = $target.find('.mySlider_arrow').eq(1).find('img.disabled');

			info.currentLeft = parseFloat($list.css('left'));
			
			if (info.currentLeft >= 0){
				if (quick){
					$list.css('left',0);
				}
				else{
					$list.animate({
						left: 0
					},100);
				}
				info.viewIdx = 0;
				$leftArrowEn.css('display','none');
				$leftArrowDis.css('display','inline-block');
				$rightArrowDis.css('display','none');
				$rightArrowEn.css('display','inline-block');
			}
			else if (info.currentLeft <= (info.mainWidthPx - info.listWidth)){
				if (info.mainWidthPx < info.listWidth){
					if (quick){
						$list.css('left',(info.mainWidthPx - info.listWidth)+'px');
					}
					else {
						$list.animate({
							left: (info.mainWidthPx - info.listWidth)+'px'
						},100);
					}
					info.viewIdx = info.viewCount - 1;
					$leftArrowDis.css('display','none');
					$leftArrowEn.css('display','inline-block');
					$rightArrowEn.css('display','none');
					$rightArrowDis.css('display','inline-block');
				}
				else {
					if (quick){
						$list.css('left',0);
					}
					else {
						$list.animate({
							left: 0
						},100);
					}
					info.viewIdx = 0;
					$leftArrowEn.css('display','none');
					$leftArrowDis.css('display','inline-block');
					$rightArrowDis.css('display','none');
					$rightArrowEn.css('display','inline-block');
				}
			}
			else {
				dis = info.margin - info.currentLeft;
				items = dis / (info.itemWidth+info.margin);
				
				if ((items - Math.floor(items)) < 0.5){
					items = Math.floor(items);
				}
				else {
					items = Math.floor(items)+1;
				}

				dis = items * (info.itemWidth+info.margin);
				
				if (quick){
					$list.css('left',-dis+'px');
				}
				else {
					$list.animate({
						left: -dis+'px'
					},100);
				}
				
				dis /= info.mainWidthPx;
				if ((dis - Math.floor(dis)) < 0.5){
					dis = Math.floor(dis);
				}
				else {
					dis = Math.floor(dis) + 1;
				}
				info.viewIdx = dis;
				$leftArrowDis.css('display','none');
				$leftArrowEn.css('display','inline-block');
				$rightArrowDis.css('display','none');
				$rightArrowEn.css('display','inline-block');
			}

			/* Set current active view in navbar if applicable */

			if (settings.navbar){
				$navbar.removeClass('active');
				$navbar.eq(info.viewIdx).addClass('active');
			}
		};

		/* Reset dimensions when window size changes */

		var resetSize = function($list){
			
			info.mainWidthPx = parseFloat($list.parent().css('width'));
			
			if (settings.itemWidth.indexOf("px") == -1){	// If <li> elements' width are set in %
				
				/* Reset width (px) for each <li> element and <ul> element */

				info.itemWidth = parseFloat(settings.itemWidth) * info.mainWidthPx / 100;
				info.listWidth = (info.itemWidth + info.margin) * ($list.find('li').length-1) + info.itemWidth;
				
				$list.css({
					width: info.listWidth
				});
				$list.find('li').css({
					width: info.itemWidth
				});
			}
			info.viewCount = Math.ceil(info.listWidth / info.mainWidthPx);	// Total number of views needed
			adjustPosition($list,true);	// Adjust current view
			setNavBar($list);		// Update navbar
		};

		/* Bind actions and register events */

		var setBindings = function($list){
			
			var slider = document.getElementById(id);
			var touch,startTouch,endLeft, startY;
			var init = false;

			/* Listen to drag events */
			
			if (!slider.addEventListener){ // if IE < 9
				var $slider = $list.parent();
				$slider.on('mousedown',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					startTouch = ev.screenX;
					info.currentLeft = parseFloat($list.css('left'));
				});
				$slider.on('mousemove',function(ev){
					ev.preventDefault();
					if (init){
						dragging = true;
						endLeft = info.currentLeft + ev.screenX - startTouch;
						$list.css('left',endLeft+'px');
					}
				});
				$slider.on('mouseup mouseleave',function(ev){
					ev.preventDefault();
					if (dragging){
						if (settings.kinetic){
							$list.animate({
								left: '+='+(endLeft - info.currentLeft)/5+'px'
							},400,function(){
								adjustPosition($list,false);
							});
						}
						else{
							adjustPosition($list,false);
						}
					}
					init = false;
					dragging = false;
				});
			}
			else{	// if IE9 or above
				// Listen to touch events

				slider.addEventListener('touchstart',function(ev){
					// ev.preventDefault();
					init = true;
					dragging = false;
					info.currentLeft = parseFloat($list.css('left'));
				});

				slider.addEventListener('touchmove',function(ev){
					
					touch = ev.touches[0];
					if (init){
						dragging = true;
						startTouch = touch.pageX;
						startY = touch.pageY;
						init = false;
					}

					if (Math.abs(touch.pageX - startTouch) > 2*Math.abs(touch.pageY - startY)){
						ev.preventDefault();
					}

					endLeft = info.currentLeft + touch.pageX - startTouch;
					$list.css('left',endLeft+'px');
				});
				
				slider.addEventListener('touchend',function(ev){
					// ev.preventDefault();
					if (dragging){
						if (settings.kinetic){
							$list.animate({
								left: '+='+(endLeft - info.currentLeft)/5+'px'
							},400,function(){
								adjustPosition($list,false);
							});
						}
						else{
							adjustPosition($list,false);
						}
					}
				});

				// Listen to mouse events

				slider.addEventListener('mousedown',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					startTouch = ev.pageX;
					info.currentLeft = parseFloat($list.css('left'));
				});
				slider.addEventListener('mousemove',function(ev){
					ev.preventDefault();
					if (init){
						dragging = true;
						endLeft = info.currentLeft + ev.pageX - startTouch;
						$list.css('left',endLeft+'px');
					}
				});
				slider.addEventListener('mouseup',function(ev){
					ev.preventDefault();
					if (dragging){
						if (settings.kinetic){
							$list.animate({
								left: '+='+(ev.pageX - startTouch)/5+'px'
							},400,function(){
								adjustPosition($list,false);
							});
						}
						else{
							adjustPosition($list,false);
						}
					}
					init = false;
				});
				$list.parent().on('mouseleave', function(ev){
					ev.preventDefault();
					if (dragging){
						if (settings.kinetic){
							$list.animate({
								left: '+='+(ev.pageX - startTouch)/5+'px'
							},400,function(){
								adjustPosition($list,false);
							});
						}
						else{
							adjustPosition($list,false);
						}
					}
					init = false;
					dragging = false;
				});
			}

			/* Binding arrows to click/touch events */

			var adjust = false;
			var $leftArrowEn = $target.find('.mySlider_arrow').eq(0).find('img.enabled');
			var $leftArrowDis = $target.find('.mySlider_arrow').eq(0).find('img.disabled');
			var $rightArrowEn = $target.find('.mySlider_arrow').eq(1).find('img.enabled');
			var $rightArrowDis = $target.find('.mySlider_arrow').eq(1).find('img.disabled');

			// Left arrow
			$target.find('.mySlider_arrow').eq(0).on('mousedown touchstart',function(ev){
				ev.preventDefault();
				if ($leftArrowDis.css('display')=='none'){

					$leftArrowEn.css('display','none');
					$leftArrowDis.css('display','inline-block');
					$rightArrowEn.css('display','inline-block');
					$rightArrowDis.css('display','none');

					if (info.viewIdx > 0){
						info.viewIdx -= 1;
					}
					endLeft = - info.viewIdx * info.mainWidthPx;
					
					$list.animate({
						left: endLeft + 'px'
					},200,function(){
						if (adjust){
							adjustPosition($list,false);
						}
					});

					if (settings.navbar){	// Reset current active view in navbar
						$navbar.removeClass('active');
						$navbar.eq(info.viewIdx).addClass('active');
					}
				}
				
			});

			// Right arrow
			$target.find('.mySlider_arrow').eq(1).on('mousedown touchstart',function(ev){
				ev.preventDefault();
				if ($rightArrowDis.css('display')=='none'){

					$leftArrowEn.css('display','inline-block');
					$leftArrowDis.css('display','none');
					$rightArrowEn.css('display','none');
					$rightArrowDis.css('display','inline-block');

					if (info.viewIdx < (info.viewCount - 1)){
						info.viewIdx += 1;
					}
					if ((info.viewIdx == (info.viewCount - 1))&&(info.viewIdx > 0)){
						endLeft = info.mainWidthPx - info.listWidth;
					}
					else {
						endLeft = - info.viewIdx * info.mainWidthPx;
					}
					
					$list.animate({
						left: endLeft + 'px'
					},200,function(){
						if (adjust){
							adjustPosition($list,false);
						}
					});

					if (settings.navbar){	// Reset current active view in navbar
						$navbar.removeClass('active');
						$navbar.eq(info.viewIdx).addClass('active');
					}
				}
			});

			/* Listen for window resize event */

			$(window).on('resize',function(){
				resetSize($list);
			});

			/* Register click/touch event for li elements */

			$list.find('li').on('mouseup touchend',function(ev){
				ev.preventDefault();
				if (!dragging){
					$(this).trigger('mySlider_click_event');
				}
			});
		};

		checkInput();
		initStructure();
		initDimension();
		setTimeout(function(){
			setBindings($list);
			if (settings.autoUpdate){
				autoUpdate();
			}
		},100);
	};
})(jQuery);