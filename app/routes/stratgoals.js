import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.query('stratgoal', {orderBy: 'name'});
  },
  beforeModel: function() {
    //Redirect if not authenticated
    if (!this.get('user').get('isAuthenticated')) {
      this.transitionTo('login');
    }
  }
});
