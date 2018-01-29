import Ember from 'ember';

export default Ember.Controller.extend({
  allowDelete: false,
  user: "no user",
  actions: {
    menu(){
      this.transitionToRoute('navigate');
    },
    new(){
      this.transitionToRoute('new');
    },
    goto(route){
      this.transitionToRoute(route);
    },
    favorite(){
      alert("favorite pressed!");
    },
    more(){
      this.transitionToRoute('sales');
    },
    logout(){
      this.get('user').set('isAuthenticated',false);
      this.get('user').set('isAdmin',false);
      this.transitionToRoute('login');
      this.set('user',"no user");
    }
  }
});
