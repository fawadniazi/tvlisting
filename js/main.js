require(['helper/app','helper/utils','helper/desktop','helper/mobile'],function(App,utils){

	//Create Router
	var initRouter = Em.Router.create({
		enableLogging:false,
		root: Em.Route.extend({
			index:Em.Route.extend({
				route:'/',
				connectOutlets:function(router){
					if(utils.getWidth() > 480){
						router.transitionTo('desktop.index');
					} else {
						router.transitionTo('mobile.index');
					}
				}
			}),
			desktop:Em.Route.extend({
				route:'/desktop',
				index: Ember.Route.extend({
					route: '/',
					connectOutlets:function(router){
						if(utils.getWidth() <= 480){
							router.transitionTo('mobile.index');
						} else {
							router.get('applicationController').connectOutlet('desktop');
						}
					}
				})
			}),
			mobile:Em.Route.extend({
				route:'/mobile',
				index: Ember.Route.extend({
					route: '/',
					connectOutlets:function(router){
						if(utils.getWidth() > 480){
							router.transitionTo('desktop.index');
						} else {
							router.get('applicationController').connectOutlet('mobile');
						}
					},
					move:Em.Route.transitionTo('root')
				})
			})
		})
	});

	App.initialize(initRouter);
});
