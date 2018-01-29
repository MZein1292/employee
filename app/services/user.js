import Ember from 'ember';
import {getToday} from '../utils/functions';

export default Ember.Service.extend({
  fullName:'',
  email:'',
  isAuthenticated:false,
  isAdmin:false,
  readOnly:true,
  user: 'no user',
  today: getToday(),
  initials: Ember.computed(function() {
    let user=this.get('user');
    let result='';
    if (user==='John') {result='JP';}
    else if (user==='Aneil') {result='AS';}
    else if (user==='Dave') {result='DH';}
    else if (user==='Ben') {result='BL';}
    else if (user==='Joel') {result='JT';}
    else if (user==='Mike') {result='MN';}
    else if (user==='Jeff') {result='JL';}
    else if (user==='Dmitriy') {result='DZ';}
    return result;
  }),
});
