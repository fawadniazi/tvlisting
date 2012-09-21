define(['helper/app','libs/text!template/mobile.tpl'],function(App,mobile){
	
	App.MobileController = Em.Controller.extend();


	App.MobileView = Em.View.extend({
		template: Em.Handlebars.compile(mobile),
		didInsertElement: function(){
			App.router.get('applicationController').fetchSmall();
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