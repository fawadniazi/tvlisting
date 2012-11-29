define(['helper/app','libs/text!template/desktop.tpl'],function(App,templ){

	App.DesktopView = Em.View.extend({
		template: Em.Handlebars.compile(templ),
		didInsertElement: function(){
			this.get('controller').initDateList();
		}
	});

	App.DesktopController = Em.Controller.extend({
		currentPosition: 0,
		currentViewWidth: 0,
		promoData: [],
		currentPromo: 0,
		resetPromo: false,
		regionData: {},
		currentRegion: 'China',
		currentDate: null,
		currentDateIdx: 0,
		programsData: {},

		initDateList: function(){
			var self = this;

			self.initDate();

			var settings = {	// example of full settings
				width: '100%',					// Width (in %) of slider compared to window width
				height: '61px',					// Height (in px) of slider
				arrows: true,					// Toggle left & right arrows (optional, default false)
				arrowsWidth: '10%',				// Width (in %) of left & right arrows compared to slider (optional, default 8%)
				mainWidth: '80%',				// Width (in %) of main view compared to slider (optional, default 80% if arrows enabled and 100% otherwise)
				mainMargin: '0',				// Margin (in %) of main view compared to slider (optional, default 0 2% if arrows enabled and 0 otherwise)
				imgPath: 'img',					// Path to img folder (where arrow_left.png & arrow_right.png present)
				itemWidth: '11%'				// Width (in %) of each item compared to main view or absolute (in px)
			};
			$('#espntv_select_date').mySlider(settings);
			self.currentViewWidth = $('#espntv_select_date').width();
			self.bindDateList();
			self.bindTimeList();
			self.bindProgramList();
			self.bindProgramDetails();
			self.preparePromo();
			self.initPromo();
			self.initRegionList();
			self.bindRegionList();
		},

		bindDateList: function(){
			var self = this;
			var $dateList = $('#espntv_select_date ul li');
			$dateList.on('mySlider_click_event',function(){
				$dateList.find('img').prependTo(this);
				$dateList.removeClass('espntv_selected_date');
				$(this).addClass('espntv_selected_date');
			});
		},

		bindTimeList: function(){
			var self = this;
			var $timeList = $('#espntv_time_line ul');
			var $programList = $('#espntv_programs ul');

			$timeList.parent().find('.espntv_time_arrow_left').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				self.currentPosition += self.currentViewWidth;
				if (self.currentPosition > 0){
					self.currentPosition = 0;
				}
				$timeList.animate({
					left: self.currentPosition
				},300);
				$programList.animate({
					left: self.currentPosition
				},300);
			});

			$timeList.parent().find('.espntv_time_arrow_right').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				self.currentPosition -= self.currentViewWidth;
				if (self.currentPosition < -self.currentViewWidth*9.1){
					self.currentPosition = -self.currentViewWidth*9.1;
				}
				$timeList.animate({
					left: self.currentPosition
				},300);
				$programList.animate({
					left: self.currentPosition
				},300);
			});

			var time_line = document.getElementById('espntv_time_list');
			var touch,startTouch,endLeft;
			var init = false, dragging = false;

			/* Listen to drag events */
			
			if (!time_line.addEventListener){ // if IE < 9
				$timeList.parent().on('mousedown',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					startTouch = ev.screenX;
					self.currentPosition = parseFloat($timeList.css('left'));
				});
				$timeList.parent().on('mousemove',function(ev){
					ev.preventDefault();
					if (init){
						dragging = true;
						endLeft = self.currentPosition + ev.screenX - startTouch;
						if (endLeft > 0){
							endLeft = 0;
						}
						if (endLeft < -self.currentViewWidth*9.1){
							endLeft = -self.currentViewWidth*9.1;
						}
						$timeList.css('left',endLeft+'px');
						$programList.css('left',endLeft+'px');
					}
				});
				$timeList.parent().on('mouseup',function(ev){
					ev.preventDefault();
					init = false;
				});
			}
			else{	// if IE9 or above
				// Listen to touch events

				time_line.addEventListener('touchstart',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					self.currentPosition = parseFloat($timeList.css('left'));
				});

				time_line.addEventListener('touchmove',function(ev){
					ev.preventDefault();
					touch = ev.touches[0];
					if (init){
						dragging = true;
						startTouch = touch.pageX;
						init = false;
					}
					endLeft = self.currentPosition + touch.pageX - startTouch;
					if (endLeft > 0){
						endLeft = 0;
					}
					if (endLeft < -self.currentViewWidth*9.1){
						endLeft = -self.currentViewWidth*9.1;
					}
					$timeList.css('left',endLeft+'px');
					$programList.css('left',endLeft+'px');
				});
				
				// time_line.addEventListener('touchend',function(ev){
				// 	ev.preventDefault();
				// 	if (dragging){
				// 		$list.animate({
				// 			left: '+='+(endLeft - info.currentLeft)/5+'px'
				// 		},400,function(){
				// 			adjustPosition($list,false);	
				// 		});
				// 	}
				// });

				// Listen to mouse events

				time_line.addEventListener('mousedown',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					startTouch = ev.pageX;
					self.currentPosition = parseFloat($timeList.css('left'));
				});
				time_line.addEventListener('mousemove',function(ev){
					ev.preventDefault();
					if (init){
						dragging = true;
						endLeft = self.currentPosition + ev.pageX - startTouch;
						if (endLeft > 0){
							endLeft = 0;
						}
						if (endLeft < -self.currentViewWidth*9.1){
							endLeft = -self.currentViewWidth*9.1;
						}
						$timeList.css('left',endLeft+'px');
						$programList.css('left',endLeft+'px');
					}
				});
				time_line.addEventListener('mouseup',function(ev){
					ev.preventDefault();
					init = false;
				});
			}
		},

		bindProgramList: function(){
			var programs = document.getElementById('espntv_programs');
			var touch,startTouch,endLeft;
			var init = false, dragging = false;
			var $timeList = $('#espntv_time_line ul');
			var $programList = $('#espntv_programs ul');

			/* Listen to drag events */
			
			if (!programs.addEventListener){ // if IE < 9
				$programList.parent().on('mousedown',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					startTouch = ev.screenX;
					self.currentPosition = parseFloat($timeList.css('left'));
				});
				$programList.parent().on('mousemove',function(ev){
					ev.preventDefault();
					if (init){
						dragging = true;
						endLeft = self.currentPosition + ev.screenX - startTouch;
						if (endLeft > 0){
							endLeft = 0;
						}
						if (endLeft < -self.currentViewWidth*9.1){
							endLeft = -self.currentViewWidth*9.1;
						}
						$timeList.css('left',endLeft+'px');
						$programList.css('left',endLeft+'px');
					}
				});
				$programList.parent().on('mouseup',function(ev){
					ev.preventDefault();
					init = false;
				});
			}
			else{	// if IE9 or above
				// Listen to touch events

				programs.addEventListener('touchstart',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					self.currentPosition = parseFloat($timeList.css('left'));
				});

				programs.addEventListener('touchmove',function(ev){
					ev.preventDefault();
					touch = ev.touches[0];
					if (init){
						dragging = true;
						startTouch = touch.pageX;
						init = false;
					}
					endLeft = self.currentPosition + touch.pageX - startTouch;
					if (endLeft > 0){
						endLeft = 0;
					}
					if (endLeft < -self.currentViewWidth*9.1){
						endLeft = -self.currentViewWidth*9.1;
					}
					$timeList.css('left',endLeft+'px');
					$programList.css('left',endLeft+'px');
				});
				
				// Listen to mouse events

				programs.addEventListener('mousedown',function(ev){
					ev.preventDefault();
					init = true;
					dragging = false;
					startTouch = ev.pageX;
					self.currentPosition = parseFloat($timeList.css('left'));
				});
				programs.addEventListener('mousemove',function(ev){
					ev.preventDefault();
					if (init){
						dragging = true;
						endLeft = self.currentPosition + ev.pageX - startTouch;
						if (endLeft > 0){
							endLeft = 0;
						}
						if (endLeft < -self.currentViewWidth*9.1){
							endLeft = -self.currentViewWidth*9.1;
						}
						$timeList.css('left',endLeft+'px');
						$programList.css('left',endLeft+'px');
					}
				});
				programs.addEventListener('mouseup',function(ev){
					ev.preventDefault();
					init = false;
				});
			}

			$programList.find('li').on('mouseup touchend',function(ev){
				ev.preventDefault();
				if (!dragging){
					//$(this).trigger('mySlider_click_event');
					console.log($programList.find('li').index(this));
				}
			});
		},

		bindProgramDetails: function(){
			var $programDetails = $('#espntv_program_details');
			var share_text, share_url;
			var share_param;

			$programDetails.find('a.espntv_details_close').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				$programDetails.fadeOut(200);
			});

			$programDetails.find('.espntv_details_share .twitter').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				share_text = $programDetails.find('.espntv_details_content .espntv_bold').text();
				share_url = 'http://www.espnstar.com';
				share_param = 'https://twitter.com/share?text='+share_text+'&url='+share_url;
				window.open(share_param,'','left=0,top=0,status=no,location=no,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=320');
			});

			$programDetails.find('.espntv_details_share .facebook').on('mousedown touchstart',function(ev){
				console.log('clicked');
				ev.preventDefault();
				var obj = {
					method: 'feed',
					link: 'http://www.espnstar.com',
					picture: 'http://thesoccerroom.com/wp-content/uploads/2011/05/ESPN-STAR-sports.jpg',
					name: 'Sample name goes here',
					caption: 'Sample caption goes here',
					description: 'Sample description goes here'
				};

				if (typeof FB != 'undefined'){
					FB.ui(obj);
				}
			});

			$programDetails.find('.espntv_details_share .gplus').on('mousedown touchstart',function(ev){
				ev.preventDefault();
				share_url = 'http://www.espnstar.com';
				share_param = 'https://plus.google.com/share?url='+share_url;
				window.open(share_param,'','top=0,left=0,menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=480');
			});
		},

		updatePromo: function(leftHide, leftShow, rightHide, rightShow, mainHide, mainShow, slider, msg){
			var self = this;
			var next;

			if (!self.resetPromo){
				if (self.currentPromo == (self.promoData.length-1)){
					next = 0;
				}
				else{
					next = self.currentPromo + 1;
				}

				leftShow.attr('src',self.promoData[next].leftImg);
				rightShow.attr('src',self.promoData[next].rightImg);
				mainShow.attr('src',self.promoData[next].mainImg);

				setTimeout(function(){
					leftShow.fadeIn(800);
					leftHide.fadeOut(800);
					rightShow.fadeIn(800);
					rightHide.fadeOut(800);
					mainShow.fadeIn(800);
					mainHide.fadeOut(800);
					
					slider.removeClass('selected');
					slider.eq(next).addClass('selected');
					msg.html(self.promoData[next].msg);

					self.currentPromo = next;
					self.updatePromo(leftShow, leftHide, rightShow, rightHide, mainShow, mainHide, slider, msg);
				},5000);
			}
			else{
				setTimeout(function(){
					if (leftHide.css('display') == 'block'){
						self.updatePromo(leftHide, leftShow, rightHide, rightShow, mainHide, mainShow, slider, msg);
					}
					else{
						self.updatePromo(leftShow, leftHide, rightShow, rightHide, mainShow, mainHide, slider, msg);
					}
				},1000);
			}
		},

		preparePromo: function(){
			var self = this;
			var tmpStr='';

			self.promoData = [{
				leftImg: 'http://www.espnstar.com/essvideos/images/tvlisitng/TV-Listings-Panel-VerdictLaLiga_L.jpg',
				rightImg: 'http://www.espnstar.com/essvideos/images/tvlisitng/TV-Listings-Panel-VerdictLaLiga_R.jpg',
				mainImg: 'http://www.espnstar.com/essvideos/images/tvlisitng/TV-Listings-Banner-VerdictLaLiga.jpg',
				msg: 'Tune in every WEDNESDAY 11:00 PM - HKT, SGT'
			},{
				leftImg: 'img/promo_side.png',
				rightImg: 'img/promo_side.png',
				mainImg: 'img/changi.png',
				msg: 'Tune in every TUESDAY 09:00 AM - HKT, SGT'
			}];

			for (var i = 0; i < self.promoData.length; i++){
				tmpStr += '<li></li>';
			}

			$('#espntv_main_promo .espntv_slider ul').append(tmpStr);
		},

		initPromo: function(){
			var self = this;
			var $slider = $('#espntv_main_promo .espntv_slider ul li');
			var $msg = $('#espntv_main_promo p.espntv_msg');
			var $leftPromo = $('#espntv_left_promo img.espntv_promo');
			var $leftBuffer = $('#espntv_left_promo img.espntv_buffer');
			var $rightPromo = $('#espntv_right_promo img.espntv_promo');
			var $rightBuffer = $('#espntv_right_promo img.espntv_buffer');
			var $mainPromo = $('#espntv_main_promo img.espntv_promo');
			var $mainBuffer = $('#espntv_main_promo img.espntv_buffer');

			$slider.eq(0).addClass('selected');
			$leftPromo.attr('src',self.promoData[0].leftImg);
			$rightPromo.attr('src',self.promoData[0].rightImg);
			$mainPromo.attr('src',self.promoData[0].mainImg);
			$msg.html(self.promoData[0].msg);

			if (self.promoData.length > 1){
				self.updatePromo($leftPromo, $leftBuffer, $rightPromo, $rightBuffer, $mainPromo, $mainBuffer, $slider, $msg);
				
				$slider.on('mousedown touchstart', function(ev){
					ev.preventDefault();
					index = $slider.index(this);
					self.resetPromo = true;
					self.currentPromo = index;
					
					$slider.removeClass('selected');
					$slider.eq(index).addClass('selected');
					$msg.html(self.promoData[index].msg);

					if ($leftPromo.css('display') == 'block'){
						$leftBuffer.attr('src',self.promoData[index].leftImg);
						$rightBuffer.attr('src',self.promoData[index].rightImg);
						$mainBuffer.attr('src',self.promoData[index].mainImg);
						
						$leftBuffer.fadeIn(200);
						$leftPromo.fadeOut(200);
						$rightBuffer.fadeIn(200);
						$rightPromo.fadeOut(200);
						$mainBuffer.fadeIn(200);
						$mainPromo.fadeOut(200);
					}
					else{
						$leftPromo.attr('src',self.promoData[index].leftImg);
						$rightPromo.attr('src',self.promoData[index].rightImg);
						$mainPromo.attr('src',self.promoData[index].mainImg);
						
						$leftBuffer.fadeOut(200);
						$leftPromo.fadeIn(200);
						$rightBuffer.fadeOut(200);
						$rightPromo.fadeIn(200);
						$mainBuffer.fadeOut(200);
						$mainPromo.fadeIn(200);
					}

					setTimeout(function(){
						self.resetPromo = false;
					},5000);
				});
			}
		},

		bindPromo: function(){
			var self = this;
			var index;
			var $slider = $('#espntv_main_promo .espntv_slider ul li');

			$slider.on('mousedown touchstart', function(ev){
				ev.preventDefault();
				index = $slider.index(this);
				self.resetPromo = true;

			});

		},

		initDate: function(){
			var self = this;
			var days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var tmpStr = '';
			var tmp = null;
			var $list = $('#espntv_select_date ul');
			var $timeList = $('#espntv_time_list');

			self.currentDate = moment().subtract('d',1);

			for( var i = 0; i < 14; i++){
				tmp = self.currentDate.add('d',1);
				tmpStr += '<li><p>'+days[tmp.day()]+' '+tmp.date()+' '+months[tmp.month()]+'</p></li>';
			}

			$list.empty().append(tmpStr);
			$list.find('li').eq(0).addClass('espntv_selected_date').prepend('<img src="img/date_selected.png">');
			self.currentDate.subtract('d',13);

			tmp = moment().hours(0).minutes(0).seconds(0).subtract('m',30);
			tmpStr = '';
			for(var j = 0; j < 49; j++){
				tmpStr += '<li><img src="img/time_point.png"><p>'+tmp.add('m',30).format('h:mm A')+'</p></li>';
			}
			$timeList.empty().append(tmpStr);
		},

		initRegionList: function(){
			var self = this;
			var $list = $('#espntv_region_list');
			var tmpStr='';

			self.regionData = {
				"China":["ECN1","SCN1"],
				"Hong Kong":["ESN1","SEN1","ESEA"],
				"India":["EIN1","SIN1","EINA","SCR1","SCRA"],
				"Nepal":["EIN1","SIN1","EINA","SCR1","SCRA"],
				"Bangladesh":["EIN1","SIN1","EINA","SCR1"],
				"Pakistan":["EIN1","SIN1"],
				"Sri Lanka":["EIN1","SIN1","EINA","SCR1","SCRA"],
				"Maldives":["EIN1","SIN1","EINA","SCR1","SCRA"],
				"Bhutan":["EIN1","SIN1","EINA","SCR1","SCRA"],
				"Malaysia":["EML1","SML1","EMLA"],
				"Malaysia - Fox Football":["FFC"],
				"Philippines":["EPH1","SSE1","ESEA"],
				"Indonesia (Indovision)":["EID1","SID1","ESEA"],
				"Indonesia (others)":["ESN1","SDN1","ESEA"],
				"Vietnam":["ESN1","SEN1","ESEA"],
				"Cambodia":["ESE1","SSE1","ESEA"],
				"Papau New Guinea":["ESE1","SSE1","SCR1"],
				"Myanmar":["ESE1","SSE1","ESEA"],
				"Mongolia":["ESE1","SSE1","ESEA"],
				"Brunei":["EML1","SML1","EMLA"],
				"Macau":["ESN1","SEN1","ESEA"],
				"Korea":["SBS","SSE1"],
				"Thailand":["ESN1","SEN1","ESEA"],
				"Singapore":["ESN1","SSG1","ESEA","SCRA"],
				"Taiwan":["ETW1","STW1","ETWA"]
			};

			for (var region in self.regionData){
				tmpStr += '<li>'+region+'</li>';
			}
			$list.append(tmpStr);
			self.updateChannelList();
		},

		updateChannelList: function(){
			var self = this;

			var $list = $('#espntv_channel_list');
			var tmpStr = '';

			var channelList = self.regionData[self.currentRegion];

			for (var i = 0; i < channelList.length; i++){
				tmpStr += '<li><img src="'+'img/logo/espn.png'+'"></li>';
			}

			$list.empty().append(tmpStr);
			self.updatePrograms(channelList);

		},

		updatePrograms: function(channelList){
			var self = this;
			var fetchUrl = 'json/';
			
			self.programsData = {};

			for (var i = 0; i < channelList.length; i++){
				$.ajax({
					type:'GET',
					dataType: 'json',
					url: fetchUrl+channelList[i]+self.currentDate.format('YYMMDD')+'.json',
					success:function(data){
						$.extend(self.programsData,data);
					}
				});
			}
			
			
		},

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
				$container.find('p').html($(this).text());
				$list.parent().css('display','none');
				self.currentRegion = $(this).text();
				self.updateChannelList();
			});
		}

	});

});