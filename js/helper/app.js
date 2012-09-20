define(['libs/text!template/app.tpl','helper/utils'],function(application,utils){
	window.App = window.App || Em.Application.create();

	App.ApplicationController = Em.Controller.extend({
		baseURL:"https://img-upload.s3.amazonaws.com/",
		fetchSmall: function(){
			var self = this;
			$.ajax({
				type:'GET',
				url: self.baseURL,
				data:{'prefix':'small/','marker':'small'},
				success:function(xml){
					var json = utils.xmlToJson(xml);
					self.reOrg(json);
					var group = self.reOrg(json);
					console.log(group);
					App.router.get('mobileController').set('content',group);
				}
			});
		},
		fetchMedium: function(){
			var self = this;
			$.ajax({
				type:'GET',
				url: self.baseURL,
				data:{'prefix':'small/','marker':'small'},
				success:function(xml){
					var json = utils.xmlToJson(xml);
					self.reOrg(json);
					var group = self.reOrg(json);
					console.log(group);
					group = self.splitTwo(group);
					App.router.get('desktopController').set('content',group);
				}
			});
		},
		reOrg:function(json){
			var arr = [],
				contents = _.pluck(json,'Contents')[0],
				self =this;
					
			arr = self.modifyInfo(contents);

			//Sample data
			// arr.push({date:"2013-10-01T08:47:38.000Z",prettyDay:"1st Oct 13"});
			// arr.push({date:"2013-09-04T08:47:38.000Z",prettyDay:"4th Sep 13"});

			var group = _.groupBy(arr.reverse(),function(obj){
				return obj.prettyDay;
			});

			group = _.sortBy(group,function(arr){
				return arr[0].date;
			});

			group = _.map(group,function(arr){
				var obj = {};
				obj.arr = arr;
				obj.prettyDay = moment(arr[0].date).format('MMM Do');
				return obj;
			});
			
			// We reverse it because we want descending date
			return group.reverse();
		},
		modifyInfo:function(contents){
			// Add Original Source, prettify the date for categorisation

			var self = this;
			var arr= [];
			_.each(contents,function(num,i){
				if(i){
					var arrObj = {};
					arrObj.date = num.LastModified['#text'];
					arrObj.prettyDay = moment(arrObj.date).format('MMM Do YY');
					arrObj.prettyTime = moment(arrObj.date).format('hh:mm a');
					arrObj.imgSrc = self.baseURL+num.Key['#text'];
					arrObj.original = self.baseURL+(num.Key['#text'].replace('small/','medium/'));
					arr.push(arrObj);
				}
			});

			return arr;
		},
		splitTwo:function(arr){
			
			_.each(arr,function(obj){
				var arrLeft = [],
					arrRight = [];
				_.each(obj.arr,function(arr,index){
					if(!(index%2)){
						arrRight.push(arr);
					} else {
						arrLeft.push(arr);
					}
				});
				obj.arrLeft = arrLeft;
				obj.arrRight = arrRight;
			});
			return arr;
		},
		sharePics:function(evt){
			var self = this;
			
			FB.ui({
				method:'feed',
				link:'http://google.com',
				picture:$(evt.currentTarget).attr('data-img'),
				name:"Travel the World"
			},function(data){
				if(typeof data != 'undefined'){
					alert('Image shared!');
				}
			});
			
			return false;
		},
		startBindings:function(){
			$(window).resize(function(){
				if(utils.getWidth() >= 940){
					App.router.transitionTo('desktop.index');
				} else {
					App.router.transitionTo('mobile.index');
				}
			});
		}
		
	});

	App.ApplicationView = Em.View.extend({
		template: Em.Handlebars.compile(application),
		didInsertElement:function(){
			console.log(this.get('controller').startBindings());
		}
	});

	return App;
});