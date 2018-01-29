import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('auth-user');
  this.route('employee');
  this.route('ex-employee');
  this.route('empbyday');
  this.route('empstats');
  this.route('issues');
  this.route('jobcode');
  this.route('login');
  this.route('movetoex');
  this.route('navigate');
  this.route('overtime');
  this.route('stratgoals');
});

export default Router;
