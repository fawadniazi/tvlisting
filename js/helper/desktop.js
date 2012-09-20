define(['helper/app','libs/text!template/desktop.tpl'],function(App,desktop){
	
	App.DesktopController = Em.Controller.extend();

	App.DesktopView = Em.View.extend({
		template: Em.Handlebars.compile(desktop),
		didInsertElement: function(){
			App.router.get('applicationController').fetchMedium();
		}
	});

});