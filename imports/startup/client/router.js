BlazeLayout.setRoot('body');

FlowRouter.subscriptions = function() {};


FlowRouter.route('/', {
	action: function() {
		BlazeLayout.render("layoutFull", {page: "homepage"});

	},
	subscriptions:function(){

	},
});
