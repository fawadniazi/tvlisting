define(['helper/app','libs/text!template/desktop.tpl'],function(App,templ){

	App.DesktopView = Em.View.extend({
		template: Em.Handlebars.compile(templ),
		didInsertElement: function(){
			this.get('controller').addAdsTag();
			this.get('controller').initAll();
			this.get('controller').startBindings();
		}
	});

	App.DesktopController = Em.Controller.extend({
		updateTime: true,				// Boolean flag to detect when to update view according to time
		viewTime: 'now',
		currentPosition: 0,				// Current left position of program details & timeline
		currentViewWidth: 0,			// Current width of program details view
		promoData: [],					// Store data of promo (main, left, right, msg)
		currentPromo: 0,				// Current showing promo
		resetPromo: false,				// Trigger when user click on promo or play video
		videoPaused: false,				// Trigger when user pause video
		regionData: {},					// Store channel list of each region
		currentRegion: 'China',			// Current selected region
		currentDate: null,				// Current date (today)
		currentDateIdx: 0,				// Current date (index in date list)
		programsData: {},				// Store programs data from JSON
		logosData: {},					// Store logos data from JSON
		resetSize: false,				// Trigger when screen size changes
		espntv_env: 'prod',				// Environment flag (dev or prod)

		/* Add double click ads tag */

		addAdsTag: function(){
			$('#espntv_dbclick_ads object, #espntv_dbclick_ads noscript:eq(1)').appendTo('.espntv_bottom');
		},

		/* Init date selection list */

		initAll: function(){
			var self = this;

			self.initDateTime();		// Create 2 week time span starting from today & 24-hour time line span

			var settings = {
				width: '100%',					// Width (in %) of slider compared to window width
				height: '80px',					// Height (in px) of slider
				arrows: true,					// Toggle left & right arrows (optional, default false)
				arrowsWidth: '6%',				// Width (in %) of left & right arrows compared to slider (optional, default 8%)
				mainWidth: '88%',				// Width (in %) of main view compared to slider (optional, default 80% if arrows enabled and 100% otherwise)
				mainMargin: '0',				// Margin (in %) of main view compared to slider (optional, default 0 2% if arrows enabled and 0 otherwise)
				imgPath: 'img',					// Path to img folder (where arrow_left.png & arrow_right.png present)
				itemWidth: '13%',				// Width (in %) of each item compared to main view or absolute (in px)
				kinetic: false
			};
			$('#espntv_select_date').mySlider(settings);	// Call mySlider plugin

			self.currentViewWidth = $('#espntv_select_date').width();
			
			self.bindDateList();			// Bind event listener to li elements in date list
			self.bindTimeList();			// Bind event listener to li elements in 24-hour time line list
			self.bindProgramList();			// Bind event listener to program details view
			self.bindProgramDetails();		// Bind event listener to program details pop up
			self.preparePromo();			// Fetch & create promo data & start showing
			self.initRegionList();			// Create region data & start showing channels
			self.bindRegionList();			// Bind event listener to region selection list
		},

		/* Create 2 week time span starting from today & 24-hour time line span */

		initDateTime: function(){
			var self = this;
			var days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
			var months = moment.monthsShort;
			var tmpStr = '';
			var tmp = null;
			var $list = $('#espntv_select_date ul');
			var $timeList = $('#espntv_time_list');

			self.currentDate = moment().subtract('d',1);

			for( var i = 0; i < 14; i++){
				tmp = self.currentDate.add('d',1);
				tmpStr += '<li><img class="date" src="img/date.png"><p>'+days[tmp.day()]+'<br>'+tmp.date()+' '+months[tmp.month()]+'</p></li>';
			}

			$list.empty().append(tmpStr);
			$list.find('li').eq(0).addClass('espntv_selected_date').prepend('<img class="selected" src="img/date_selected.png">');
			self.currentDate.subtract('d',13);

			setTimeout(function(){
				/* Create 24-hour time line span */

				tmp = moment().hours(0).minutes(0).seconds(0).subtract('m',30);
				tmpStr = '';
				var unitWidth = $('#espntv_time_line').width() * 0.2;
				
				var fixLeft = 0;

				for(var j = 0; j < 49; j++){
					tmpStr += '<li style="width:'+unitWidth+'px;left:'+fixLeft+'px;"><img src="img/time_point.png"><p>'+tmp.add('m',30).format('h:mm A')+'</p></li>';
					
					fixLeft += unitWidth;
				}
				$timeList.empty().append(tmpStr);
			},100);
			
		},

		/* Bind event listener to li elements in date list */

		bindDateList: function(){
			var self = this;
			var $dateList = $('#espntv_select_date ul li');
			var $timeList = $('#espntv_time_line div.time_line_container');
			var index;
			var $loadPrev = $('#espntv_programs .load_prev.day');
			var $loadPrevHr = $('#espntv_programs .load_prev.hour');
			var $loadNext = $('#espntv_programs .load_next.day');
			var $loadNextHr = $('#espntv_programs .load_next.hour');

			$dateList.on('mySlider_click_event',function(){
				$dateList.find('img.selected').prependTo(this);
				$dateList.removeClass('espntv_selected_date');
				$(this).addClass('espntv_selected_date');
				index = $dateList.index(this) - self.currentDateIdx;
				if (index !== 0){
					self.currentDateIdx += index;
					self.currentDate.add('d',index);
					self.updatePrograms(self.regionData[self.currentRegion]);
					
					self.currentPosition = $timeList.scrollLeft();

					if (self.currentPosition <= 0){
						
						self.currentPosition = 0;
						if (self.currentDateIdx > 0){
							$loadPrev.css('display','block');
						}
						else{
							$loadPrev.css('display','none');
							
						}
						$loadPrevHr.addClass('hide');
					}

					if (self.currentPosition >= self.currentViewWidth*8.8){
						
						self.currentPosition = self.currentViewWidth*8.8;
						if (self.currentDateIdx < 13){
							$loadNext.css('display','block');
						}
						else{
							$loadNext.css('display','none');
						}
						$loadNextHr.addClass('hide');
					}
				}
			});
		},

		/* Bind event listener to li elements in 24-hour time line list */

		bindTimeList: function(){
			var self = this;
			var $timeList = $('#espntv_time_line div.time_line_container');
			var $programList = $('#espntv_programs div.programs_schedule');
			var $loadPrev = $('#espntv_programs .load_prev.day');
			var $loadNext = $('#espntv_programs .load_next.day');
			var $loadPrevHr = $('#espntv_programs .load_prev.hour');
			var $loadNextHr = $('#espntv_programs .load_next.hour');
			

			$timeList.parent().find('.espntv_time_arrow_left').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				$loadNext.css('display','none');

				self.currentPosition = $timeList.scrollLeft();
				self.currentPosition -= self.currentViewWidth;

				if (self.currentPosition <= 0){
					self.currentPosition = 0;
					if (self.currentDateIdx > 0){
						$loadPrev.css('display','block');
					}
					$loadPrevHr.addClass('hide');
				}
				else{
					$loadPrev.css('display','none');
					$loadPrevHr.removeClass('hide');
				}

				$loadNextHr.removeClass('hide');
				$timeList.animate({scrollLeft:self.currentPosition},300);
				$programList.animate({scrollLeft:self.currentPosition},300,function(){
					self.adjustView();
				});
			});

			$timeList.parent().find('.espntv_time_arrow_right').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				$loadPrev.css('display','none');

				self.currentPosition = $timeList.scrollLeft();
				self.currentPosition += self.currentViewWidth;

				if (self.currentPosition >= self.currentViewWidth*8.8){
					self.currentPosition = self.currentViewWidth*8.8;
					if (self.currentDateIdx < 13){
						$loadNext.css('display','block');
					}
					$loadNextHr.addClass('hide');
				}
				else{
					$loadNext.css('display','none');
					$loadNextHr.removeClass('hide');
				}
				$loadPrevHr.removeClass('hide');
				
				$timeList.animate({scrollLeft:self.currentPosition},300);
				$programList.animate({scrollLeft:self.currentPosition},300,function(){
					self.adjustView();
				});
			});

			var time_line = document.getElementById('espntv_time_list');
			var touch,startX,endLeft;
			var init = false, dragging = false;

			/* Listen to drag events */
			
			if (!time_line.addEventListener){ // if IE < 9
				$timeList.parent().on('mousedown',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					startX = ev.screenX;
					self.currentPosition = $timeList.scrollLeft();
				});
				$timeList.parent().on('mousemove',function(ev){
					ev.preventDefault();
					if (init){
						dragging = true;

						endLeft = self.currentPosition - (ev.screenX - startX);

						if (endLeft <= 0){
							endLeft = 0;
							if (self.currentDateIdx > 0){
								$loadPrev.css('display','block');
							}
						}
						else{
							$loadPrev.css('display','none');
						}

						if (endLeft >= self.currentViewWidth*8.8){
							endLeft = self.currentViewWidth*8.8;
							if (self.currentDateIdx < 13){
								$loadNext.css('display','block');
							}
						}
						else{
							$loadNext.css('display','none');
						}

						$timeList.scrollLeft(endLeft);
						$programList.scrollLeft(endLeft);
					}
				});
				$timeList.parent().on('mouseup mouseleave',function(ev){
					ev.preventDefault();
					init = false;
					if (dragging){
						self.adjustView();
						dragging = false;
					}
				});
			}
			else{	// if IE9 or above
				// Listen to touch events

				time_line.addEventListener('touchstart',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					self.currentPosition = $timeList.scrollLeft();
				});

				time_line.addEventListener('touchmove',function(ev){
					ev.preventDefault();
					touch = ev.touches[0];
					if (init){
						dragging = true;
						startX = touch.pageX;
						init = false;
					}

					endLeft = self.currentPosition - (touch.pageX - startX);

					if (endLeft <= 0){
						endLeft = 0;
						if (self.currentDateIdx > 0){
							$loadPrev.css('display','block');
						}
					}
					else{
						$loadPrev.css('display','none');
					}

					if (endLeft >= self.currentViewWidth*8.8){

						endLeft = self.currentViewWidth*8.8;
						if (self.currentDateIdx < 13){
							$loadNext.css('display','block');
						}
					}
					else{
						$loadNext.css('display','none');
					}

					$timeList.scrollLeft(endLeft);
					$programList.scrollLeft(endLeft);
				});
				
				time_line.addEventListener('touchend',function(ev){
					ev.preventDefault();
					if (dragging){
						self.adjustView();
						dragging = false;
					}
				});

				// Listen to mouse events

				time_line.addEventListener('mousedown',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					startX = ev.pageX;
					self.currentPosition = $timeList.scrollLeft();
				});
				time_line.addEventListener('mousemove',function(ev){
					ev.preventDefault();
					if (init){
						dragging = true;

						endLeft = self.currentPosition - (ev.pageX - startX);

						if (endLeft <= 0){
							endLeft = 0;
							if (self.currentDateIdx > 0){
								$loadPrev.css('display','block');
							}
						}
						else{
							$loadPrev.css('display','none');
						}

						if (endLeft >= self.currentViewWidth*8.8){

							endLeft = self.currentViewWidth*8.8;
							if (self.currentDateIdx < 13){
								$loadNext.css('display','block');
							}
						}
						else{
							$loadNext.css('display','none');
						}

						$timeList.scrollLeft(endLeft);
						$programList.scrollLeft(endLeft);
					}
				});
				time_line.addEventListener('mouseup',function(ev){
					ev.preventDefault();
					init = false;
					if (dragging){
						self.adjustView();
						dragging = false;
					}
				});
				$timeList.parent().on('mouseleave',function(ev){
					ev.preventDefault();
					init = false;
					if (dragging){
						self.adjustView();
						dragging = false;
					}
				});
			}
		},

		/* Bind event listener to program details view */

		bindProgramList: function(){
			var self = this;
			var programs = document.getElementById('espntv_programs');
			var touch,startX,startY,endLeft;
			var init = false, dragging = false, adjust = false;
			var $timeList = $('#espntv_time_line div.time_line_container');
			var $programList = $('#espntv_programs div.programs_schedule');
			var $dateList = $('#espntv_select_date ul li');
			var $loadPrev = $('#espntv_programs .load_prev.day');
			var $loadNext = $('#espntv_programs .load_next.day');
			var $loadPrevHr = $('#espntv_programs .load_prev.hour');
			var $loadNextHr = $('#espntv_programs .load_next.hour');

			/* Listen to drag events */

			if (!programs.addEventListener){ // if IE < 9
				$programList.on('mousedown',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					startX = ev.screenX;
					self.currentPosition = $timeList.scrollLeft();
				});
				$programList.on('mousemove',function(ev){
					ev.preventDefault();
					if ((init)&&(ev.screenX - startX !== 0)){
						dragging = true;
						adjust = true;

						endLeft = self.currentPosition - (ev.screenX - startX);
						
						if (endLeft <= 0){
							endLeft = 0;
							if (self.currentDateIdx > 0){
								$loadPrev.css('display','block');
							}
						}
						else{
							$loadPrev.css('display','none');
						}

						if (endLeft >= self.currentViewWidth*8.8){

							endLeft = self.currentViewWidth*8.8;
							if (self.currentDateIdx < 13){
								$loadNext.css('display','block');
							}
						}
						else{
							$loadNext.css('display','none');
						}

						$timeList.scrollLeft(endLeft);
						$programList.scrollLeft(endLeft);
					}
				});
				$programList.on('mouseup mouseleave',function(ev){
					ev.preventDefault();
					init = false;
					if (adjust) {
						self.adjustView();
						adjust = false;
					}
				});
			}
			else{	// if IE9 or above
				// Listen to touch events

				programs.addEventListener('touchstart',function(ev){

					init = true;
					dragging = false;
					self.currentPosition = $timeList.scrollLeft();
				});

				programs.addEventListener('touchmove',function(ev){
					
					touch = ev.touches[0];
					if (init){
						dragging = true;
						adjust = true;
						startX = touch.pageX;
						startY = touch.pageY;
						init = false;
					}

					endLeft = self.currentPosition - (touch.pageX - startX);

					if (Math.abs(touch.pageX - startX) > 2*Math.abs(touch.pageY - startY)){
						ev.preventDefault();
					}

					if (endLeft <= 0){
						endLeft = 0;
						if (self.currentDateIdx > 0){
							$loadPrev.css('display','block');
						}
					}
					else{
						$loadPrev.css('display','none');
					}

					if (endLeft >= self.currentViewWidth*8.8){

						endLeft = self.currentViewWidth*8.8;
						if (self.currentDateIdx < 13){
							$loadNext.css('display','block');
						}
					}
					else{
						$loadNext.css('display','none');
					}

					$timeList.scrollLeft(endLeft);
					$programList.scrollLeft(endLeft);
				});

				programs.addEventListener('touchend',function(ev){

					if (adjust){
						self.adjustView();
						adjust = false;
					}
				});
				
				// Listen to mouse events

				programs.addEventListener('mousedown',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					startX = ev.pageX; // pageX

					self.currentPosition = $programList.scrollLeft();
				});
				programs.addEventListener('mousemove',function(ev){
					ev.preventDefault();
					if ((init) && (ev.pageX - startX !== 0)){
						dragging = true;
						adjust = true;

						endLeft = self.currentPosition - (ev.pageX - startX);

						if (endLeft <= 0){
							endLeft = 0;
							if (self.currentDateIdx > 0){
								$loadPrev.css('display','block');
							}
						}
						else{
							$loadPrev.css('display','none');
						}

						if (endLeft >= self.currentViewWidth*8.8){

							endLeft = self.currentViewWidth*8.8;
							if (self.currentDateIdx < 13){
								$loadNext.css('display','block');
							}
						}
						else{
							$loadNext.css('display','none');
						}

						$timeList.scrollLeft(endLeft);
						$programList.scrollLeft(endLeft);
					}
				});
				programs.addEventListener('mouseup',function(ev){
					ev.preventDefault();
					init = false;
					if (adjust){
						self.adjustView();
						adjust = false;
					}
				});
				$programList.on('mouseleave',function(ev){
					ev.preventDefault();
					init = false;
					if (adjust){
						self.adjustView();
						adjust = false;
					}
				});
			}

			if (Modernizr.touch){	// disable load next/prev 2 hours on touch devices
				$loadPrevHr.addClass('disabled');
				$loadNextHr.addClass('disabled');
			}
			else{	// enable on desktop only
				$loadPrevHr.on('mouseup touchend', function(ev){

					ev.preventDefault();
					if ($('html').hasClass('ie')){
						if (!init){
							$('#espntv_time_line .espntv_time_arrow_left').trigger('touchstart');
						}
					}
					else if (!dragging){
							$('#espntv_time_line .espntv_time_arrow_left').trigger('touchstart');
						}
				});

				$loadNextHr.on('mouseup touchend', function(ev){
					ev.preventDefault();
					if ($('html').hasClass('ie')){
						if (!init){
							$('#espntv_time_line .espntv_time_arrow_right').trigger('touchstart');
						}
					}
					else if (!dragging){
						$('#espntv_time_line .espntv_time_arrow_right').trigger('touchstart');
					}
				});
			}

			$('#espntv_programs').on('mouseup touchend','ul li.espntv',function(ev){
				ev.preventDefault();
				init = false;
				
				if (!dragging){
					$('#espntv_programs ul li.espntv').removeClass('selected');
					$(this).addClass('selected');
					self.showDetails(this);
				}
			});
			
			$loadPrev.on('mouseup touchend',function(ev){
				ev.preventDefault();
				$loadPrevHr.removeClass('hide');
				if (self.currentDateIdx > 0){
					self.updateTime = true;
					self.viewTime = 'prev';
					$dateList.eq(self.currentDateIdx-1).trigger('mySlider_click_event');
				}
				if (self.currentDateIdx <= 7){
					$('#espntv_select_date .mySlider_arrow').eq(0).trigger('touchstart');
				}
				else{
					$('#espntv_select_date .mySlider_arrow').eq(1).trigger('touchstart');
				}
			});

			$loadNext.on('mouseup touchend',function(ev){
				ev.preventDefault();
				$loadNextHr.removeClass('hide');
				if (self.currentDateIdx < 13){
					self.updateTime = true;
					self.viewTime = 'next';
					$dateList.eq(self.currentDateIdx+1).trigger('mySlider_click_event');
				}
				if (self.currentDateIdx >= 6){
					$('#espntv_select_date .mySlider_arrow').eq(1).trigger('touchstart');
				}
				else{
					$('#espntv_select_date .mySlider_arrow').eq(0).trigger('touchstart');
				}
			});

			$('#espntv_channels .espntv_showing').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				if (self.currentDateIdx === 0){
					self.updateRealTimeView('now');
				}
				else{
					self.updateTime = true;
					self.viewTime = 'now';
					$dateList.eq(0).trigger('mySlider_click_event');
				}
				$('#espntv_select_date .mySlider_arrow').eq(0).trigger('touchstart');
			});
		},

		/* Show pop up details for selected program */

		showDetails: function(item){
			var self = this;
			var $ele = $(item);
			var $popup = $('#espntv_program_details');
			var tmpStr = '';

			tmpStr += '<p class="espntv_sub_genre">'+$ele.find('p.espntv_sub_genre').text()+'</p><p class="espntv_date">'+$ele.find('p.espntv_date').text()+'</p><p class="espntv_time">'+$ele.find('p.espntv_time').text()+'</p><p class="espntv_programme">'+$ele.find('p.espntv_programme').text()+'</p><p class="espntv_matchup">'+$ele.find('p.espntv_matchup').text()+'</p><p class="espntv_channel_name">'+self.logosData[$ele.parent().attr('class')].name+'</p>';
			if ($ele.hasClass('live')){
				tmpStr += '<img class="espntv_details_live" src="img/live_indicator.png">';
				$popup.find('div.espntv_details').addClass('live');
			}
			else{
				$popup.find('div.espntv_details').removeClass('live');
			}
			
			$popup.find('img.espntv_details_channel').attr('src',self.logosData[$ele.parent().attr('class')].logo);
			$popup.find('div.espntv_details_content').empty().append(tmpStr);
			$popup.fadeIn(300);
		},

		/* Bind event listener to program details pop up */

		bindProgramDetails: function(){
			var $programDetails = $('#espntv_program_details');
			var share_text, share_url;
			var share_param;

			$programDetails.find('a.espntv_details_close').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				$programDetails.fadeOut(200);
				$('#espntv_programs ul li.espntv').removeClass('selected');
			});

			$programDetails.find('.espntv_details_share .twitter').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				share_text = 'Watch '+$programDetails.find('p.espntv_programme').text() + ': '+$programDetails.find('p.espntv_matchup').text()+' on '+$programDetails.find('p.espntv_channel_name').text()+'. '+$programDetails.find('p.espntv_time').text()+' '+$programDetails.find('p.espntv_date').text();
				share_param = 'https://twitter.com/share?text='+share_text; //+'&url='+share_url;
				window.open(share_param,'','left=0,top=0,status=no,location=no,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=320');
			});

			$programDetails.find('.espntv_details_share .facebook').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				share_text = 'Watch '+$programDetails.find('p.espntv_programme').text() + ': '+$programDetails.find('p.espntv_matchup').text()+' on '+$programDetails.find('p.espntv_channel_name').text()+'. '+$programDetails.find('p.espntv_time').text()+' '+$programDetails.find('p.espntv_date').text();
				var obj = {
					method: 'feed',
					link: 'http://tv.foxsportsasia.com',
					picture: $('#espntv_program_details img.espntv_details_channel').attr('src'),
					name: $programDetails.find('p.espntv_programme').text(),
					caption: share_text
				};

				if (typeof FB != 'undefined'){
					FB.ui(obj);
				}
			});

			$programDetails.find('.espntv_details_share .gplus').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				share_url = 'http://tv.foxsportsasia.com';
				share_param = 'https://plus.google.com/share?url='+share_url;
				window.open(share_param,'','top=0,left=0,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=480');
			});
		},

		/* Rotate among promos */

		updatePromo: function(leftHide, leftShow, rightHide, rightShow, mainHide, mainShow, slider, msg, video){
			var self = this;
			var next;

			if (!self.resetPromo){
				if (self.currentPromo == (self.promoData.length-1)){
					next = 0;
				}
				else{
					next = self.currentPromo + 1;
				}

				leftShow.attr('src',self.promoData[next].leftimage);
				rightShow.attr('src',self.promoData[next].rightimage);
				mainShow.attr('src',self.promoData[next].mainimage);
				

				setTimeout(function(){
					if (!self.resetPromo){
						leftShow.fadeIn(800);
						leftHide.fadeOut(800);
						rightShow.fadeIn(800);
						rightHide.fadeOut(800);
						mainShow.fadeIn(800);
						mainHide.fadeOut(800);

						if (self.currentPromo == (self.promoData.length-1)){
							next = 0;
						}
						else{
							next = self.currentPromo + 1;
						}
						
						slider.removeClass('selected');
						slider.eq(next).addClass('selected');
						msg.html(self.promoData[next].displaymessage);

						$('#espntv_main_promo .espntv_msg').css('display','block');
						if (typeof self.promoData[next].videolink == "string"){
							if (self.promoData[next].videolink.length > 0){
								$('#espntv_main_promo .espntv_msg').css('display','none');
								$('#espntv_main_promo .espntv_video_container').css('display','block');
								if (video.children().size() === 0){
									video.jPlayer({
										ready: function() { // The $.jPlayer.event.ready event
											$(this).jPlayer("setMedia", { // Set the media
												m4v: self.promoData[next].videolink
										}); //.jPlayer("play") -- Attempt to auto play the media
										},
										play: function() { // The $.jPlayer.event.ended event
											self.resetPromo = true;
										},
										pause: function() { // The $.jPlayer.event.ended event
												self.resetPromo = true;
										},
										ended: function() { // The $.jPlayer.event.ended event
											if ($('#espntv_main_promo img.promo_controls.play').css('display')=='none'){
												self.resetPromo = false;
											}
										},
										swfPath:"js/libs",
										solution: "flash,html",
										supplied: "m4v",
										preload: "none",
										cssSelectorAncestor: "", // Remove the ancestor css selector clause
										cssSelector: {
											videoPlay: ".espntv_video_start",
											play: ".espntv_video_play",
											pause: ".espntv_video_pause",
											seekBar: ".espntv_video_seek",
											playBar: ".espntv_video_play_bar"
										}
									});
								}
								else if(!self.videoPaused){
									video.jPlayer("setMedia",{
										m4v: self.promoData[next].videolink
									});
								}
							}
							else{
								$('#espntv_main_promo .espntv_video_container').css('display','none');
							}
						}
						else{
							$('#espntv_main_promo .espntv_video_container').css('display','none');
						}

						self.currentPromo = next;
						self.updatePromo(leftShow, leftHide, rightShow, rightHide, mainShow, mainHide, slider, msg, video);
					}
					else{
						setTimeout(function(){
							if (leftHide.css('display') == 'block'){
								self.updatePromo(leftHide, leftShow, rightHide, rightShow, mainHide, mainShow, slider, msg, video);
							}
							else{
								self.updatePromo(leftShow, leftHide, rightShow, rightHide, mainShow, mainHide, slider, msg, video);
							}
						},1000);
					}
				},15000);
			}
			else{
				setTimeout(function(){
					self.updatePromo(leftHide, leftShow, rightHide, rightShow, mainHide, mainShow, slider, msg, video);
				},1000);
			}
		},

		/* Fetch & create promo data */

		preparePromo: function(){
			var self = this;
			var tmpStr='';
			var fetchUrl = 'http://tv.foxsportsasia.com/curl.php?file=http://apps.espnstar.asia/tvlisting/';

			fetchUrl = 'json/';

			$.ajax({
				type:'GET',
				dataType: 'json',
				url: fetchUrl+'program.json',
				success:function(data){
					self.promoData = data.items.item;
					for (var i = 0; i < self.promoData.length; i++){
						tmpStr += '<li></li>';
					}

					$('#espntv_main_promo .espntv_slider ul').append(tmpStr);
					self.initPromo();
				},
				error:function(data){
				}
			});
		},

		/* Start showing promo */

		initPromo: function(){
			var self = this;
			var $slider = $('#espntv_main_promo .espntv_slider ul li');
			var $msg = $('#espntv_main_promo p.espntv_msg');
			var $msgContainer = $('#espntv_main_promo .espntv_msg');
			var $video = $('#espntv_main_promo div.espntv_video');
			var $leftPromo = $('#espntv_left_promo img.espntv_promo');
			var $leftBuffer = $('#espntv_left_promo img.espntv_buffer');
			var $rightPromo = $('#espntv_right_promo img.espntv_promo');
			var $rightBuffer = $('#espntv_right_promo img.espntv_buffer');
			var $mainPromo = $('#espntv_main_promo img.espntv_promo');
			var $mainBuffer = $('#espntv_main_promo img.espntv_buffer');
			var $playBtn = $('#espntv_main_promo img.promo_controls.play');
			var $pauseBtn = $('#espntv_main_promo img.promo_controls.pause');
			var $prevBtn = $('#espntv_main_promo img.promo_controls.prev');
			var $nextBtn = $('#espntv_main_promo img.promo_controls.next');

			$slider.eq(0).addClass('selected');
			$leftPromo.attr('src',self.promoData[0].leftimage);
			$rightPromo.attr('src',self.promoData[0].rightimage);
			$mainPromo.attr('src',self.promoData[0].mainimage);
			$msg.html(self.promoData[0].displaymessage);
			$msgContainer.css('display','block');

			if (typeof self.promoData[0].videolink == "string"){
				if (self.promoData[0].videolink.length > 0){
					$('#espntv_main_promo .espntv_msg').css('display','none');
					$('#espntv_main_promo .espntv_video_container').css('display','block');

					$video.jPlayer({
						ready: function() { // The $.jPlayer.event.ready event
							$(this).jPlayer("setMedia", { // Set the media
								m4v: self.promoData[0].videolink //"http://video-js.zencoder.com/oceans-clip.mp4"
						}); //.jPlayer("play") -- Attempt to auto play the media
						},
						play: function() { // The $.jPlayer.event.ended event
							self.resetPromo = true;
						},
						pause: function() { // The $.jPlayer.event.ended event
								self.resetPromo = true;
						},
						ended: function() { // The $.jPlayer.event.ended event
							if ($playBtn.css('display')=='none'){
								self.resetPromo = false;
							}
						},
						//size: {width: "640px", height: "360px"},
						swfPath:"js/libs",
						solution: "flash,html",
						supplied: "m4v",
						preload: "none",
						cssSelectorAncestor: "", // Remove the ancestor css selector clause
						cssSelector: {
							videoPlay: ".espntv_video_start",
							play: ".espntv_video_play",
							pause: ".espntv_video_pause",
							// stop: '.jp-stop',
							seekBar: ".espntv_video_seek",
							playBar: ".espntv_video_play_bar"
							// mute: '.jp-mute',
							// unmute: '.jp-unmute',
							// volumeBar: '.jp-volume-bar',
							// volumeBarValue: '.jp-volume-bar-value',
							// volumeMax: '.jp-volume-max',
							// currentTime: '.jp-current-time',
							// duration: '.jp-duration',
							// fullScreen: '.jp-full-screen',
							// restoreScreen: '.jp-restore-screen',
							// repeat: '.jp-repeat',
							// repeatOff: '.jp-repeat-off',
							// gui: '.jp-gui',
							// noSolution: '.jp-no-solution'
						}
					});
				}
			}
			
			if (self.promoData.length > 1){
				self.updatePromo($leftPromo, $leftBuffer, $rightPromo, $rightBuffer, $mainPromo, $mainBuffer, $slider, $msg, $video);
				
				/* Bind event listener to li elements in promo slider */

				$slider.on('mousedown touchstart', function(ev){
					ev.preventDefault();
					var next;
					index = $slider.index(this);
					// self.resetPromo = true;
					self.currentPromo = index;

					$slider.removeClass('selected');
					$slider.eq(index).addClass('selected');
					$msg.html(self.promoData[index].displaymessage);
					$msgContainer.css('display','block');

					if (typeof self.promoData[index].videolink == "string"){
						if (self.promoData[index].videolink.length > 0){
							$('#espntv_main_promo .espntv_msg').css('display','none');
							$('#espntv_main_promo .espntv_video_container').css('display','block');
							if ($video.children().size() === 0){
								$video.jPlayer({
									ready: function() { // The $.jPlayer.event.ready event
										$(this).jPlayer("setMedia", { // Set the media
											m4v: self.promoData[index].videolink
									}); //.jPlayer("play") -- Attempt to auto play the media
									},
									play: function() { // The $.jPlayer.event.ended event
										self.resetPromo = true;
									},
									pause: function() { // The $.jPlayer.event.ended event
											self.resetPromo = true;
									},
									ended: function() { // The $.jPlayer.event.ended event
										if ($playBtn.css('display')=='none'){
											self.resetPromo = false;
										}
									},
									swfPath:"js/libs",
									solution: "flash,html",
									supplied: "m4v",
									preload: "none",
									cssSelectorAncestor: "", // Remove the ancestor css selector clause
									cssSelector: {
										videoPlay: ".espntv_video_start",
										play: ".espntv_video_play",
										pause: ".espntv_video_pause",
										seekBar: ".espntv_video_seek",
										playBar: ".espntv_video_play_bar"
									}
								});
							}
							else if (!self.videoPaused){
								$video.jPlayer("setMedia",{
									m4v: self.promoData[index].videolink
								});
							}
						}
						else{
							$('#espntv_main_promo .espntv_video_container').css('display','none');
						}
					}
					else{
						$('#espntv_main_promo .espntv_video_container').css('display','none');
					}

					if ($leftPromo.css('display') == 'block'){
						
						$leftPromo.attr('src',self.promoData[index].leftimage);
						$rightPromo.attr('src',self.promoData[index].rightimage);
						$mainPromo.attr('src',self.promoData[index].mainimage);

						if (self.currentPromo == (self.promoData.length-1)){
							next = 0;
						}
						else{
							next = self.currentPromo + 1;
						}
						
						$leftBuffer.attr('src',self.promoData[next].leftimage);
						$rightBuffer.attr('src',self.promoData[next].rightimage);
						$mainBuffer.attr('src',self.promoData[next].mainimage);
					}
					else{
						
						$leftBuffer.attr('src',self.promoData[index].leftimage);
						$rightBuffer.attr('src',self.promoData[index].rightimage);
						$mainBuffer.attr('src',self.promoData[index].mainimage);

						if (self.currentPromo == (self.promoData.length-1)){
							next = 0;
						}
						else{
							next = self.currentPromo + 1;
						}

						$leftPromo.attr('src',self.promoData[next].leftimage);
						$rightPromo.attr('src',self.promoData[next].rightimage);
						$mainPromo.attr('src',self.promoData[next].mainimage);
					}
				});

				/* Bind event listener to play/pause buttons */

				$pauseBtn.on('mousedown touchstart', function(ev){
					ev.preventDefault();
					self.resetPromo = true;
					$playBtn.css('display','block');
				});

				$playBtn.on('mousedown touchstart', function(ev){
					ev.preventDefault();
					self.resetPromo = false;
					$playBtn.css('display','none');
				});

				/* Bind event listener to prev/next buttons */

				$prevBtn.on('mousedown touchstart', function(ev){
					ev.preventDefault();
					var idx;
					if (self.currentPromo === 0){
						idx = self.promoData.length - 1;
					}
					else{
						idx = self.currentPromo - 1;
					}
					$slider.eq(idx).trigger('touchstart');
				});

				$nextBtn.on('mousedown touchstart', function(ev){
					ev.preventDefault();
					var idx;
					if (self.currentPromo == (self.promoData.length-1)){
						idx = 0;
					}
					else{
						idx = self.currentPromo + 1;
					}
					$slider.eq(idx).trigger('touchstart');
				});

				/* Bind event listener for drag */

				var main_promo = document.getElementById('espntv_main_promo');
				var touch,startX,startY, endX;
				var init = false, dragging = false;
				
				var $promoContainer = $('#espntv_main_promo');

				/* Listen to drag events */

				if (!main_promo.addEventListener){ // if IE < 9
					$promoContainer.on('mousedown',function(ev){
						ev.preventDefault();
						init = true;
						dragging = false;
						startX = ev.screenX;
					});
					$promoContainer.on('mousemove',function(ev){
						ev.preventDefault();
						endX = ev.screenX;
						if ((init)&&(endX - startX !== 0)){
							dragging = true;
						}
					});
					$promoContainer.on('mouseup mouseleave',function(ev){
						ev.preventDefault();
						init = false;
						if (dragging){
							dragging = false;
							if (endX > startX){
								$nextBtn.trigger('touchstart');
							}
							else if (endX < startX){
								$prevBtn.trigger('touchstart');
							}
						}
					});
				}
				else{	// if IE9 or above
					// Listen to touch events

					main_promo.addEventListener('touchstart',function(ev){
						init = true;
						dragging = false;
					});

					main_promo.addEventListener('touchmove',function(ev){
						touch = ev.touches[0];
						if (init){
							init = false;
							dragging = true;
							startX = touch.pageX;
							startY = touch.pageY;
						}

						endX = touch.pageX;

						if (Math.abs(endX - startX) > 2*Math.abs(touch.pageY - startY)){
							ev.preventDefault();
						}
					});

					main_promo.addEventListener('touchend',function(ev){
						if (dragging){
							
							dragging = false;
							if (endX > startX){
								$nextBtn.trigger('touchstart');
							}
							else if (endX < startX){
								$prevBtn.trigger('touchstart');
							}
						}
					});
					
					// Listen to mouse events

					main_promo.addEventListener('mousedown',function(ev){
						ev.preventDefault();
						init = true;
						dragging = false;
						startX = ev.pageX;
					});
					main_promo.addEventListener('mousemove',function(ev){
						ev.preventDefault();
						endX = ev.pageX;
						if ((init) && (endX - startX !== 0)){
							dragging = true;
						}
					});
					main_promo.addEventListener('mouseup',function(ev){
						ev.preventDefault();
						init = false;
						if (dragging){
							dragging = false;
							if (endX > startX){
								$nextBtn.trigger('touchstart');
							}
							else if (endX < startX){
								$prevBtn.trigger('touchstart');
							}
						}
					});
					$promoContainer.on('mouseleave',function(ev){
						ev.preventDefault();
						init = false;
						if (dragging){
							dragging = false;
							if (endX > startX){
								$nextBtn.trigger('touchstart');
							}
							else if (endX < startX){
								$prevBtn.trigger('touchstart');
							}
						}
					});
				}
			}
		},

		/* Create region data & region selection list */

		initRegionList: function(){
			var self = this;
			var $list = $('#espntv_region_list');
			var tmpStr='';

			self.regionData = {
				"Bangladesh":["EIN1","SIN1","EINA","SCR1"],			
				"Bhutan":["EIN1","SIN1","EINA","SCR1","SCRA"],				
				"Brunei":["EML1","SML1","EMLA"],			
				"Cambodia":["ESE1","SSE1","ESEA"],				
				"China":["ECN1","SCN1"],
				"Hong Kong":["ESN1","SEN1","ESEA"],
				"India":["EIN1","SIN1","EINA","SCR1","SCRA"],
				"Indonesia (Indovision)":["EID1","SID1","ESEA"],
				"Indonesia (others)":["ESN1","SDN1","ESEA"],				
				"Korea":["SBS","SSE1"],				
				"Macau":["ESN1","SEN1","ESEA"],				
				"Malaysia":["EML1","SML1","EMLA"],				
				"Malaysia - Fox Football":["FFC1"],				
				"Maldives":["EIN1","SIN1","EINA","SCR1","SCRA"],
				"Mongolia":["ESE1","SSE1","ESEA"],
				"Myanmar":["ESE1","SSE1","ESEA"],
				"Nepal":["EIN1","SIN1","EINA","SCR1","SCRA"],
				"Pakistan":["EIN1","SIN1"],
				"Papua New Guinea":["ESE1","SSE1","SCR1"],				
				"Philippines":["EPH1","SSE1","ESEA"],
				"Singapore":["ESN1","SSG1","ESEA","SCRA"],				
				"Sri Lanka":["EIN1","SIN1","EINA","SCR1","SCRA"],
				"Taiwan":["ETW1","STW1","ETWA"],				
				"Thailand":["ESN1","SEN1","ESEA"],				
				"Vietnam":["ESN1","SEN1","ESEA"]
			};

			for (var region in self.regionData){
				tmpStr += '<li>'+region+'</li>';
			}
			$list.append(tmpStr);

			/* Prepare logos data */
			self.prepareLogos();
		},

		/* Bind event listener to region selection list */

		bindRegionList: function(){
			var self = this;
			var $container = $('#espntv_select_region .espntv_selected_region');
			var $list = $('#espntv_region_list li');

			$container.on('mousedown touchstart', function(ev){
				ev.preventDefault();
				$list.parent().css('display','block');
			});

			$container.parent().on('mouseleave', function(ev){
				ev.preventDefault();
				$list.parent().css('display','none');
			});

			$list.on('mousedown touchstart', function(ev){
				ev.preventDefault();
				if ($(this).text() == 'Korea'){
					window.open('http://medianet.sbs.co.kr/jsp/schedule/sc_sports.jsp');
				}
				else{
					$container.find('p').html($(this).text());
					$list.parent().css('display','none');
					self.currentRegion = $(this).text();
					self.updateChannelList();
				}
			});
		},

		/* Update channels in current selected region */

		updateChannelList: function(){
			var self = this;

			var $list = $('#espntv_channel_list');
			var tmpStr = '';
			var logo = '';

			var channelList = self.regionData[self.currentRegion];

			for (var i = 0; i < channelList.length; i++){
				logo = self.logosData[channelList[i]].logo;

				if (i % 2 === 0){
					tmpStr += '<li class="odd"><span class="dummy"></span><img src="'+logo+'"></li>';
				}
				else{
					tmpStr += '<li><span class="dummy"></span><img src="'+logo+'"></li>';
				}
			}

			$list.empty().append(tmpStr);
			
			/* Update program schedule of current channels */

			self.updatePrograms(channelList);
		},

		/* Prepare (fetch) channels logo data */

		prepareLogos: function(){
			var self = this;
			var tempArr = [];
			var tempObj = {};
			var fetchUrl = 'http://tv.foxsportsasia.com/curl.php?file=http://apps.espnstar.asia/tvlisting/logos/';

			if (self.espntv_env == 'dev'){
				fetchUrl = 'json/';
			}

			self.logosData = {};

			$.ajax({
				type:'GET',
				dataType: 'json',
				url: fetchUrl+'logos.json?cache='+Math.floor(Math.random()*1000000),
				success:function(data){
					tempArr = data.channels.channel;

					for (var i = 0; i < tempArr.length; i++){
						tempObj = {};
						tempObj[tempArr[i].code] = {name: tempArr[i].name, logo: tempArr[i].logo};
						$.extend(self.logosData,tempObj);
					}
					self.checkUserLocation();
				},
				error:function(data){
				}
			});
		},

		/* Update (fetch) program schedule of current channels */

		updatePrograms: function(channelList){
			var self = this;
			var fetchUrl = 'http://tv.foxsportsasia.com/curl.php?file=http://apps.espnstar.asia/tvlisting/data/';
			var count = 0;
			$('#espntv_programs .programs_schedule').empty().append('<div class="dummy" style="height:'+channelList.length*60+'px;"><span class="dummy"></span><img src="img/loading.gif"></div>');

			self.programsData = {};

			if (self.espntv_env == 'dev'){
				fetchUrl = 'json/';
			}

			for (var i = 0; i < channelList.length; i++){
				$.ajax({
					type:'GET',
					dataType: 'json',
					url: fetchUrl+channelList[i]+self.currentDate.format('YYMMDD')+'.json?cache='+Math.floor(Math.random()*1000000),
					success:function(data){
						$.extend(self.programsData,data);
						count += 1;
						if (count == channelList.length){
							self.refreshPrograms(channelList);
						}
					},
					error:function(data,test){
						count += 1;
						if (count == channelList.length){
							self.refreshPrograms(channelList);
						}
					}
				});
			}
		},

		/* Show actual program schedule of current channels */

		refreshPrograms: function(channelList){
			var self = this;
			var months = moment.monthsShort;
			var tmpArr = [];
			var tmpStr = '',finalStr = '';
			var tmpEle = {};
			var i = 0,j = 0;
			var lastTime, nextTime, span, date, time, shortShow;
			var unitWidth = $('.programs_schedule').width()*0.02;

			var fixWidth, fixLeft = 0;

			for (i = 0; i < channelList.length; i++){
				tmpArr = self.programsData[channelList[i]];
				
				if (typeof tmpArr == 'undefined'){
					finalStr += '<ul></ul>';
				}
				else{
					fixLeft = unitWidth*5;
					tmpStr = '<ul class="'+channelList[i]+'" style="padding-left:'+fixLeft+'px;">';
					lastTime = moment('00:00:00','HH:mm:ss');

					for (j = 0; j < tmpArr.length; j++){
						tmpEle = tmpArr[j];
						nextTime = moment(tmpEle.start_time,'HH:mm:ss');
						span = nextTime.diff(lastTime)/(1000*60*3);
						if (span > 0){
							tmpStr += '<li style="width:'+span*unitWidth+'px;left:'+fixLeft+'px;"><p class="espntv_span_bk">'+span+'</p></li>';
							fixLeft += span*unitWidth;
						}
						span = moment(tmpEle.duration,'HH:mm:ss');
						time = nextTime.format('h:mm A')+'';
						lastTime = nextTime.add({
							'h':span.hours(),
							'm':span.minutes()
						});
						if (span.hours() * 60 + span.minutes() > 5){
							shortShow = false;
						}
						else{
							shortShow = true;
						}
						span = (span.hours() * 60 + span.minutes()) / 3;
						date = moment(tmpEle.date,'MM-DD-YY');
						date = tmpEle.dow+' '+ date.date()+' '+months[date.month()];
						time += ' - '+lastTime.format('h:mm A');

						fixWidth = span*unitWidth;

						if (tmpEle.live != "L"){
							if (shortShow){
								tmpStr += '<li title="Click for more details" class="espntv short" style="width:'+fixWidth+'px;left:'+fixLeft+'px;"><div class="espntv_program_wrapper short"><div><img src="img/icon_i.png"><p class="espntv_sub_genre">'+tmpEle.sub_genre.toUpperCase()+'</p><p class="espntv_programme">'+tmpEle.programme+'</p><p class="espntv_matchup">'+tmpEle.matchup+'</p><p class="espntv_date">'+date+'</p><p class="espntv_time">'+time+'</p><p class="espntv_span_bk">'+span+'</p></div></div></li>';
							}
							else{
								tmpStr += '<li title="Click for more details" class="espntv" style="width:'+fixWidth+'px;left:'+fixLeft+'px;"><div class="espntv_program_wrapper"><p class="espntv_sub_genre">'+tmpEle.sub_genre.toUpperCase()+'</p><p class="espntv_programme">'+tmpEle.programme+'</p><p class="espntv_matchup">'+tmpEle.matchup+'</p><p class="espntv_date">'+date+'</p><p class="espntv_time">'+time+'</p><p class="espntv_span_bk">'+span+'</p></div></li>';
							}
						}
						else{
							if (shortShow){
								tmpStr += '<li title="Click for more details" class="espntv live short" style="width:'+fixWidth+'px;left:'+fixLeft+'px;"><div class="espntv_program_wrapper short"><div><img src="img/icon_i.png"><p class="espntv_sub_genre">'+tmpEle.sub_genre.toUpperCase()+'</p><div class="live_container"><p class="espntv_programme">'+tmpEle.programme+'</p><img src="img/live_indicator.png"></div><p class="espntv_matchup">'+tmpEle.matchup+'</p><p class="espntv_date">'+date+'</p><p class="espntv_time">'+time+'</p><p class="espntv_span_bk">'+span+'</p></div></div></li>';
							}
							else{
								tmpStr += '<li title="Click for more details" class="espntv live" style="width:'+fixWidth+'px;left:'+fixLeft+'px;"><div class="espntv_program_wrapper"><p class="espntv_sub_genre">'+tmpEle.sub_genre.toUpperCase()+'</p><div class="live_container"><p class="espntv_programme">'+tmpEle.programme+'</p><img src="img/live_indicator.png"></div><p class="espntv_matchup">'+tmpEle.matchup+'</p><p class="espntv_date">'+date+'</p><p class="espntv_time">'+time+'</p><p class="espntv_span_bk">'+span+'</p></div></li>';
							}
						}
						fixLeft += fixWidth;
					}

					tmpStr += '</ul>';
					finalStr += tmpStr;
				}
			}

			$('#espntv_programs .programs_schedule').empty().append(finalStr);

			if (self.updateTime){
				
				/* Init real-time view (only run once on load) */

				self.updateRealTimeView(self.viewTime);
				self.updateTime = false;
			}
			else{
				self.currentPosition = $('#espntv_time_line div.time_line_container').scrollLeft();
				$('#espntv_programs div.programs_schedule').scrollLeft(self.currentPosition);
				self.adjustView();
			}
		},

		/* Update the view (now, next day, previous day)*/

		updateRealTimeView: function(arg){
			var self = this;
			var now = moment();
			var offset=0;
			var $timeList = $('#espntv_time_line div.time_line_container');
			var $programList = $('#espntv_programs div.programs_schedule');
			var $loadPrev = $('#espntv_programs .load_prev.day');
			var $loadPrevHr = $('#espntv_programs .load_prev.hour');
			var $loadNext = $('#espntv_programs .load_next.day');
			var $loadNextHr = $('#espntv_programs .load_next.hour');

			if (arg == 'now'){
				if (now.minutes() >=30){
					offset = now.hours() * 2 + 1;
				}
				else{
					offset = now.hours() * 2;
				}
				offset *= self.currentViewWidth/5;
				
				$timeList.animate({scrollLeft:offset},400);
				$programList.animate({scrollLeft:offset},400,function(){
					self.adjustView();
				});

			}
			else if (arg == 'next'){
				offset = 0;
				
				$timeList.scrollLeft(offset);
				$programList.scrollLeft(offset);
				self.adjustView();
			}
			else if (arg == 'prev'){
				offset = self.currentViewWidth*8.8;
				
				$timeList.scrollLeft(offset);
				$programList.scrollLeft(offset);
				self.adjustView();
			}

			self.currentPosition = offset;

			$loadPrev.css('display','none');
			$loadNext.css('display','none');
			$loadNextHr.removeClass('hide');
			$loadPrevHr.removeClass('hide');

			if (self.currentPosition <= 0){
				self.currentPosition = 0;
				if (self.currentDateIdx > 0){
					$loadPrev.css('display','block');
				}
				$loadPrevHr.addClass('hide');
			}

			if (self.currentPosition >= self.currentViewWidth*8.8){
				self.currentPosition = self.currentViewWidth*8.8;
				if (self.currentDateIdx < 13){
					$loadNext.css('display','block');
				}
				$loadNextHr.addClass('hide');
			}
		},

		/* Reposition schedule based on current timeline */

		adjustView: function(){
			var self = this;

			var $lists = $('#espntv_programs ul');
			var $list, $item, $items, $content;
			var listLeft =  - $lists.eq(0).position().left;
			var unit = self.currentViewWidth / 5;

			for (var i = 0; i < $lists.length; i++){
				$items = $lists.eq(i).find('li.espntv');

				for (var j = 0; j < $items.length; j++){
					$item = $items.eq(j);
					if (($item.position().left - listLeft < 0)&&($item.width() + $item.position().left - listLeft >= unit)){
						$content = $item.find('div.espntv_program_wrapper');
						$content.css({
							left:listLeft - $item.position().left,
							width: $item.width() + $item.position().left - listLeft -10 + 'px'
						});
					}
					else if ($item.position().left - listLeft > 0){
						$content = $item.find('div.espntv_program_wrapper');
						$content.css({
							left:0,
							width: 'auto'
						});
					}
				}
			}
		},

		/* Adjust size of timeline & schedule on window.resize event */

		adjustSize: function(){
			var self = this;
			var $timeList = $('#espntv_time_list li');
			var $programList = $('#espntv_programs .programs_schedule ul');
			var tmpArr = [];

			/* Update size of time line span */

			var unitWidth = $('#espntv_time_line').width() * 0.2;
			
			var fixLeft = 0,span;

			$.each($timeList,function(idx,obj){
				$(obj).css({
					width: unitWidth+'px',
					left: fixLeft + 'px'
				});
				fixLeft += unitWidth;
			});

			/* Update size of programs */

			unitWidth /= 10;

			$.each($programList,function(idx,list){
				fixLeft = unitWidth * 5;
				$(list).css('padding-left',fixLeft+'px');

				tmpArr.clear().pushObjects($(list).find('li'));

				$.each(tmpArr[0],function(id,obj){
					span = parseFloat($(obj).find('p.espntv_span_bk').html());
					$(obj).css({
						width: span*unitWidth+'px',
						left: fixLeft + 'px'
					});
					fixLeft += span*unitWidth;
				});
				
			});
		},

		/* Bind window events (resize) */

		startBindings: function(){
			var self = this;
			var $timeList = $('#espntv_time_line');
			var $programList = $('#espntv_programs div.programs_schedule');

			$(window).resize(function(){
				if (!self.resetSize){
					self.resetSize = true;
					setTimeout(function(){
						self.adjustSize();
						self.currentViewWidth = $('#espntv_select_date').width();

						self.currentPosition = $programList.scrollLeft();
						self.currentPosition += self.currentViewWidth;

						if (self.currentPosition >= self.currentViewWidth*8.8){

							self.currentPosition = self.currentViewWidth*8.8;
							if (self.currentDateIdx < 13){
								$('#espntv_programs .load_next.day').css('display','block');
							}
							$('#espntv_programs .load_next.hour').addClass('hide');
							
							$timeList.scrollLeft(self.currentPosition);
							$programList.scrollLeft(self.currentPosition);
						}
						else{
							$('#espntv_programs .load_next.day').css('display','none');
							$('#espntv_programs .load_next.hour').removeClass('hide');
						}
						self.adjustView();
						self.resetSize = false;
					},500);
				}
			});
		},

		/* Check current user location and update region accordingly (if not available then use first region as default)*/

		checkUserLocation: function(){
			var self = this;
			var $container = $('#espntv_select_region .espntv_selected_region');
			var country = '';
			var fetchUrl = 'http://tv.foxsportsasia.com/geo-lookup/getGeoByIPJson.php';

			if (self.espntv_env == 'dev'){
				fetchUrl = 'json/location.json';
			}

			$.ajax({
				type:'GET',
				dataType: 'json',
				url: fetchUrl,
				success:function(data){
					country = data.country[0].countryName;
				
					for (var key in self.regionData){
						if ((key.indexOf(country) >= 0) || (country.indexOf(key) >= 0)){
							$container.find('p').html(key);
							self.currentRegion = key;
							break;
						}
					}
					
					/* Use matched region or default region as China if not found a match */

					self.updateChannelList();
				},
				error:function(data){
					self.updateChannelList();
				}
			});
		}
	});
});