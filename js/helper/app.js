define(['libs/text!template/app.tpl','helper/utils'],function(application,utils){
	window.App = window.App || Em.Application.create();

	App.ApplicationController = Em.Controller.extend({
		baseURL:"https://img-upload.s3.amazonaws.com/",
		tempArr:[],
		allGroups:[],
		groupsInfo:[],
		fetchSmall: function(){
			var self = this;
			$.ajax({
				type:'GET',
				url: self.baseURL,
				data:{'prefix':'small/','marker':'small'},
				success:function(xml){
					var json = utils.xmlToJson(xml);
					//self.reOrg(json);
					var group = self.reOrg(json);
					self.allGroups = group;
					//group = self.truncate(group);
					App.router.get('mobileController').set('content',[]);
					App.router.get('mobileController').get('content').push(group[0]);
					Em.run.next(this,function(){
						self.appear();
					});
					self.updateGroupsInfo();
					self.groupsInfo[0].loaded=true;
					Em.run.next(this,function(){
						self.updateLoadBtns(App.router.get('mobileController').get('content'),0);
					});
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
					//self.reOrg(json);
					var group = self.reOrg(json);
					group = self.splitTwo(group);
					self.allGroups = group;
					// group = self.truncate(group);
					//console.log(group);
					App.router.get('desktopController').set('content',[]);
					App.router.get('desktopController').get('content').push(group[0]);
					Em.run.next(this,function(){
						self.appear();
					});
					self.updateGroupsInfo();
					self.groupsInfo[0].loaded=true;
					Em.run.next(this,function(){
						self.updateLoadBtns(App.router.get('desktopController').get('content'),0);
					});
					
					// self.groupsInfo[1].loaded=true;
					//console.log(self.groupsInfo);
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
				obj.prettyDay = moment(arr[0].date).format('MMM DD');
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
					arrObj.prettyDay = moment(arrObj.date).format('MMM DD YY');
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
			var self = this;
			$(window).resize(function(){
				if(utils.getWidth() >= 940){
					App.router.transitionTo('desktop.index');
				} else {
					App.router.transitionTo('mobile.index');
				}
			});
			
		},
		appear:function(){
			//var time = 200;
			$(".pics").one('load', function() {
				$(this).parents('.li-wrapper').addClass('loaded');
				$(this).parents('.li-wrapper').css({'opacity':'1','-webkit-transform': 'translateY(0px)'});

			}).each(function() {
				if(this.complete) $(this).load();
			});
		},
		truncate:function(group) {
			var firstGrp = [];

			if(group.length >2){
				
				firstGrp = [group[0],group[1]];

				App.router.get('applicationController').tempArr = _.reject(group,function(num,index){
					return (index === 0 || index === 1);
				});

				console.log(group);
				console.log(firstGrp);
				console.log(App.router.get('applicationController').tempArr);
			} else if(group.length){
				App.router.get('applicationController').tempArr = [];
				firstGrp = group;
				$('.load-rest').css('display','none');
			}

			return firstGrp;
		},
		selectTime: function(index){
			var selectedDate={};
			var startIndex = -1;
			var self=this;
			if (index === 0){
				selectedDate = moment();
				//selectedDate = moment().format("MMM DD YY");
				console.log(selectedDate);
			}else
			if (index == 1){
				selectedDate = moment().subtract('days',1);//.format("MMM DD YY");
				console.log(selectedDate);
			}else
			if (index == 2){
				selectedDate = moment().subtract('days',3);//.format("MMM DD YY");
				console.log(selectedDate);
			}else
			if (index == 3){
				selectedDate = moment().subtract('days',5);//.format("MMM DD YY");
				console.log(selectedDate);
			}else
			if (index == 4){
				selectedDate = moment().subtract('days',7);//.format("MMM DD YY");
				console.log(selectedDate);
			}
			var tmpDate={};
			for (i=0; i < self.groupsInfo.length; i++){
				tmpDate = moment(self.groupsInfo[i].date,"MMM DD YY");
				if (selectedDate.diff(tmpDate) >= 0){
					startIndex = i;
					break;
				}
			}
			console.log('group index: '+startIndex);
			return startIndex;
		},
		updateGroupsInfo: function(){
			var self = this;
			self.groupsInfo = [];
			var tmp={};
			$.each(self.allGroups,function(index,obj){
				tmp={};
				tmp.date = obj.arr[0].prettyDay;
				tmp.count = obj.arr.length;
				tmp.loaded = false;
				self.groupsInfo.push(tmp);
			});
		},
		getInsertIndex: function(groupIndex){
			var self=this;
			var insertIndex = 0;
			if (groupIndex === 0) return 0;
			else
			for (i=0; i < groupIndex;i++){
				if (self.groupsInfo[i].loaded){
					insertIndex += 1;
				}
			}
			console.log('insert index: '+insertIndex);
			return insertIndex;
		},
		insertGroup: function(arr,groupIndex){
			var self=this;
			if (groupIndex < 0 || groupIndex == self.allGroups.length) return;
			if (!self.groupsInfo[groupIndex].loaded){
				var insertIndex = self.getInsertIndex(groupIndex);
				arr.insertAt(insertIndex,self.allGroups[groupIndex]);
				self.groupsInfo[groupIndex].loaded = true;
				Em.run.next(this,function(){
					self.appear();
					self.updateLoadBtns(arr,groupIndex);
				});
			}
			Em.run.next(this,function(){
				var viewPos = $("[id='"+self.allGroups[groupIndex].prettyDay+"']").offset().top;
				//window.scrollTo(viewPos.left,viewPos.top);
				$('body').animate({scrollTop:viewPos},600);
			});
		},
		updateLoadBtns: function(arr,groupIndex){
			var self = this;
			var viewIdx = $.inArray(self.allGroups[groupIndex],arr);
			var loadNext = false, disPrevNext = false;
			
			if (groupIndex !== 0){
				if (self.groupsInfo[groupIndex-1].loaded){
					disPrevNext = true;
				}
			}
			if (groupIndex != (self.allGroups.length-1)){
				if (!self.groupsInfo[groupIndex+1].loaded){
					loadNext = true;
				}
			}
			console.log(viewIdx);
			
			console.log('load next: '+loadNext);
			console.log('dis prev next: '+disPrevNext);
			
			
			if (loadNext){
				$('ul.load-next').eq(viewIdx).css('display','block');
			}
			if (disPrevNext){
				$('ul.load-next').eq(viewIdx-1).css('display','none');
			}
		}

		
	});

	App.ApplicationView = Em.View.extend({
		template: Em.Handlebars.compile(application),
		didInsertElement:function(){
			this.get('controller').startBindings();
			$("a[rel^='prettyPhoto']").prettyPhoto({allow_resize: true,allow_expand:false});
		}
	});

	return App;
});