import Ember from 'ember';

export default Ember.Route.extend({
    model() {
    },
    beforeModel: function() {
      //Redirect if not authenticated
      if (!this.get('user').get('isAuthenticated')) {
        this.transitionTo('login');
      }
    }
});
