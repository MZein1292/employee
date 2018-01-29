import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      emp: this.store.query('employee', {orderBy: 'lastname'}),
      ex_emp: this.store.query('ex-employee', {orderBy: 'lastname'}),
    });
  },
  beforeModel: function() {
    //Redirect if not authenticated
    if (!this.get('user').get('isAuthenticated')) {
      this.transitionTo('login');
    }
  }
});
