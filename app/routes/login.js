import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Route.extend({
  actions: {
    auth(user,password){
      if (password === ENV.john_pw) {
        this.get('user').set('email', 'john.podolan@esg-usa.com');
        this.transitionTo('auth-user');
      }
      else if (password === ENV.acct_pw) {
        this.get('user').set('email', 'dmitriy.zaderetsky@esg-usa.com');
        this.transitionTo('auth-user');
      }

      else if (password === ENV.aneil_pw){
        this.get('user').set('email', 'aneil.shah@esg-usa.com');
        this.transitionTo('auth-user');
      }
    }
  }
});
