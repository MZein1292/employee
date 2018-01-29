import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.query('code', {orderBy: 'jobcode'});
  },
  beforeModel: function() {
    //Redirect if not authenticated
    if (!this.get('user').get('isAuthenticated')) {
      this.transitionTo('login');
    }
  }
});

