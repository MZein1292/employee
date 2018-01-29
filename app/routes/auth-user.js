import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    if (this.get('user.email') === 'john.podolan@esg-usa.com') {
      this.get('user').set('isAuthenticated', true);
      this.get('user').set('user', 'John');
      this.get('user').set('readOnly', true);
      this.get('user').set('fullName', 'John Podolan');
      this.get('user').set('isAdmin', false);
      this.transitionTo('employee');
    }
    else if (this.get('user.email') === 'dmitriy.zaderetsky@esg-usa.com') {
      this.get('user').set('isAuthenticated', true);
      this.get('user').set('user', 'Dmitriy - Read Only');
      this.get('user').set('fullName', 'Dmitriy Zaderetsky');
      this.get('user').set('readOnly', true);
      this.get('user').set('isAdmin', false);
      this.transitionTo('employee');
    }

    else if (this.get('user.email') === 'aneil.shah@esg-usa.com') {
      this.get('user').set('isAuthenticated', true);
      this.get('user').set('isAdmin', true);
      this.get('user').set('fullName', 'Aneil Shah');
      this.get('user').set('readOnly', false);
      this.get('user').set('user', 'Aneil');
      this.transitionTo('employee');
    }
    else {
      this.transitionTo('login');
    }
  }
});
