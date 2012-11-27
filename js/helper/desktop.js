define(['helper/app','libs/text!template/desktop.tpl'],function(App,templ){

	App.DesktopView = Em.View.extend({
		template: Em.Handlebars.compile(templ),
		didInsertElement: function(){
			this.get('controller').initDateList();
		}
	});

	App.DesktopController = Em.Controller.extend({
		initDate: true,

		initDateList: function(){
			var self = this;

			var settings = {	// example of full settings
				width: '100%',					// Width (in %) of slider compared to window width
				height: '45px',					// Height (in px) of slider
				arrows: true,					// Toggle left & right arrows (optional, default false)
				arrowsWidth: '5%',				// Width (in %) of left & right arrows compared to slider (optional, default 8%)
				mainWidth: '90%',				// Width (in %) of main view compared to slider (optional, default 80% if arrows enabled and 100% otherwise)
				mainMargin: '0',				// Margin (in %) of main view compared to slider (optional, default 0 2% if arrows enabled and 0 otherwise)
				imgPath: 'img',					// Path to img folder (where arrow_left.png & arrow_right.png present)
				itemWidth: '13%'				// Width (in %) of each item compared to main view or absolute (in px)
			};
			if (self.initDate){
				$('#espntv_select_date').mySlider(settings);
				self.initDate = false;
			}
		}
	});

});