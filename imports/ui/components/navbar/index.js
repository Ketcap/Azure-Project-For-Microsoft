import './index.css'
import './index.html'

Template.navbar.events({
  'click a[href="#logout"]'(event,template){
    event.preventDefault();
    console.log('logout');
    Meteor.logout(function(err){
      if(!err){
        Materialize.toast('See you again ',2500,'green darken-2 white-text');
        FlowRouter.go('/')
      }
    });
  }
})
