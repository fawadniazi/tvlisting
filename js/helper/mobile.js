define(['helper/app','libs/text!template/mobile.tpl'],function(App,templ){

	App.MobileView = Em.View.extend({
		template: Em.Handlebars.compile(templ),
		didInsertElement: function(){
			
		}
	});

	App.MobileController = Em.Controller.extend({

	});

});