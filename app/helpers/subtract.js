import Ember from 'ember';

export default Ember.Helper.helper(function(params,hash) {
  return parseInt(params[0])-parseInt(params[1]);
});
