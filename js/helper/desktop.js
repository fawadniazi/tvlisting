define(['helper/app','libs/text!template/desktop.tpl'],function(App,templ){

	App.DesktopView = Em.View.extend({
		template: Em.Handlebars.compile(templ),
		didInsertElement: function(){
			this.get('controller').initDateList();
		}
	});

	App.DesktopController = Em.Controller.extend({
		initDate: true,
		currentPosition: 0,
		currentViewWidth: 0,

		initDateList: function(){
			var self = this;

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
			if (self.initDate){
				$('#espntv_select_date').mySlider(settings);
				self.currentViewWidth = $('#espntv_select_date').width();
				self.bindDateList();
				self.bindTimeList();
				self.bindProgramList();
				self.initDate = false;
			}
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

		updateView: function(quick){
			var self = this;
			var $timeList = $('#espntv_time_line ul');
			var $programList = $('#espntv_programs ul');

			if (quick){
				$timeList.css('left',self.currentPosition);
				$programList.css('left',self.currentPosition);
			}
			else{
				$timeList.animate({
					left: self.currentPosition
				},300);
				$programList.animate({
					left: self.currentPosition
				},300);
			}
		}
	});

});