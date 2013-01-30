require(['helper/app','helper/desktop'],function(App,utils){

	//Create Router
	var initRouter = Em.Router.create({
		location: 'none',
		
		root: Em.Route.extend({
			index:Em.Route.extend({
				route:'/',
				connectOutlets:function(router){
					router.get('applicationController').connectOutlet('desktop');
				}
			})
		})
	});

	App.initialize(initRouter);
});
