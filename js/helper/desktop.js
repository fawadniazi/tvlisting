define(['helper/app','libs/text!template/desktop.tpl'],function(App,desktop){
	
	App.DesktopController = Em.Controller.extend();

	App.DesktopView = Em.View.extend({
		template: Em.Handlebars.compile(desktop),
		didInsertElement: function(){
			var self=this;
			var appCtr = App.router.get('applicationController');

			$time_selector = $('#time-selector li');
			$time_selector.unbind('click touchend');
			$time_selector.bind('click touchend',function(){
				index = $time_selector.index(this);
				$time_selector.parent().find('li.active').removeClass('active');
				$time_selector.eq(index).addClass('active');
				
				var startIndex = appCtr.selectTime(index);
				if (startIndex != -1){
					console.log('insert group '+startIndex);
					appCtr.insertGroup(self.get('controller').get('content'),startIndex);
				}
			});
			$('.load-next').die();
			$('.load-next').live('click touchend',function(ev){
				var index = $(this).parent().find('ul.load-next').index(this);
				console.log('index:'+index);
				var realIndex = $.inArray(self.get('controller').get('content')[index],appCtr.allGroups);
				appCtr.insertGroup(self.get('controller').get('content'),realIndex+1);
			});

			appCtr.fetchMedium();
		},
		loadRest:function(){
			var group = App.router.get('applicationController').tempArr;
			group = App.router.get('applicationController').truncate(group);
			this.get('controller').get('content').addObjects(group);
			Em.run.next(this,function(){
				App.router.get('applicationController').appear();
			});
		}
	});

});