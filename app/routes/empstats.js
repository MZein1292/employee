import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      employees: this.store.query('employee', {orderBy: 'lastname'}),
      ex_employees: this.store.query('exEmployee', {orderBy: 'lastname'}),
    });
  },
  beforeModel: function() {
    //Redirect if not authenticated
    if (!this.get('user').get('isAuthenticated')) {
      this.transitionTo('login');
    }
  }
});
