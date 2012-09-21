define(['helper/app','libs/text!template/desktop.tpl'],function(App,desktop){
	
	App.DesktopController = Em.Controller.extend();

	App.DesktopView = Em.View.extend({
		template: Em.Handlebars.compile(desktop),
		didInsertElement: function(){
			App.router.get('applicationController').fetchMedium();
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