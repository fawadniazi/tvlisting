define(['helper/app','libs/text!template/mobile.tpl'],function(App,mobile){
	
	App.MobileController = Em.Controller.extend();

	App.MobileView = Em.View.extend({
		template: Em.Handlebars.compile(mobile),
		didInsertElement: function(){
			App.router.get('applicationController').fetchSmall();
		},
		ssharePics:function(){
			alert('123');
		}
	});

});