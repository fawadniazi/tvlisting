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
				}
			});
		},
		reOrg:function(json){
			var arr = [],
				contents = _.pluck(json,'Contents')[0],
				self =this;
					
			_.each(contents,function(num,i){
				if(i){
					var arrObj = {};
					arrObj.date = num.LastModified['#text'];
					arrObj.prettyDay = moment(arrObj.date).format('MMM Do YY');
					arrObj.prettyTime = moment(arrObj.date).format('hh:mm');
					arrObj.imgSrc = self.baseURL+num.Key['#text'];
					arrObj.original = self.baseURL+(num.Key['#text'].replace('small/','original/'));
					arr.push(arrObj);
				}
			});
			//Sample data
			// arr.push({date:"2013-10-01T08:47:38.000Z",prettyDay:"1st Oct 13"});
			// arr.push({date:"2013-09-04T08:47:38.000Z",prettyDay:"4th Sep 13"});

			var group = _.groupBy(arr,function(obj){
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

			App.router.get('mobileController').set('content',group.reverse());
			setTimeout(function(){
				liArr = $('li');


			},2000);
			
		},
		sharePics:function(evt){
			var self = this;

			console.log(evt);
			
			FB.ui({
				method:'feed',
				link:'http://google.com',
				picture:"http://img-upload.s3.amazonaws.com/small/20120917055858.jpg",
				name:"Travel the World"
			},function(data){
				if(typeof data != 'undefined'){
					alert('Image shared!');
				}
			});
			// FB.getLoginStatus(function(response) {
			// 	if (response.status === 'connected') {
			// 	// the user is logged in and has authenticated your
			// 	// app, and response.authResponse supplies
			// 	// the user's ID, a valid access token, a signed
			// 	// request, and the time the access token 
			// 	// and signed request each expire
			// 	var uid = response.authResponse.userID;
			// 	var accessToken = response.authResponse.accessToken;
			// 	alert('123')
			// 		self.callFB();
			// 	} else if (response.status === 'not_authorized') {
			// 		// the user is logged in to Facebook, 
			// 		// but has not authenticated your app
			// 		alert('456')
			// 		self.callFB();
					
			// 	} else {
			// 	// the user isn't logged in to Facebook.
			// 	alert('789')
			// 	}
				return false;
			//});
		},
		callFB:function(){
			alert('qqq');
			FB.login(function(response) {
					if (response.authResponse) {
						var imgUrl = 'https://img-upload.s3.amazonaws.com/small/20120917055858.jpg';
						FB.ui({
							method:'feed',
							link:'http://google.com',
							picture:"https://img-upload.s3.amazonaws.com/small/20120917055858.jpg"
						},function(){
							console.log('Sent');
						});
					} else {
						console.log('User cancelled login or did not fully authorize.');
					}
				},{ scope: 'publish_stream' });
		}
		
	});

	App.ApplicationView = Em.View.extend({
		template: Em.Handlebars.compile(application)
	});

	return App;
});