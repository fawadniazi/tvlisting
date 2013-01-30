define(['libs/text!template/app.tpl'],function(templ){
	window.App = window.App || Em.Application.create();

	App.ApplicationView = Em.View.extend({
		template: Em.Handlebars.compile(templ),
		didInsertElement:function(){
			this.get('controller').startBindings();
		}
	});

	App.ApplicationController = Em.Controller.extend({

		/* Update the size of left & right promo */

		updateLeftRightPromo: function(){
			var promoWidth = ($(window).width()-925)/2;
			$('#espntv_left_promo').css('width',promoWidth);
			$('#espntv_right_promo').css('width',promoWidth);
		},
		
		/* Binding to window resize event */

		startBindings:function(){
			var self = this;
			$(window).resize(function(){
				self.updateLeftRightPromo();
			});
			self.updateLeftRightPromo();
		}
	});

	return App;
});