import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('issue');
  },
  beforeModel: function() {
    this.controllerFor('issues').set('newOwner', this.get('user').get('fullName'));
    //Redirect if not authenticated
    if (!this.get('user').get('isAuthenticated')) {
      this.transitionTo('login');
    }
  },
});
