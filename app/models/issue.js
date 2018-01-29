import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  comment: DS.attr(),
  date: DS.attr(),
  description: DS.attr(),
  name: DS.attr(),
  owner: DS.attr(),
  status: DS.attr(),
  seqDateVal: Ember.computed('date', function() {
    return day(this.get('date'));
  }),
  age: Ember.computed('date', function() {
    return today1()-day1(this.get('date'));
  }),
});

function day(date){
  var numbers = date.match(/\d+/g);
  var yyyy=parseInt(numbers[2]);
  var mm=parseInt(numbers[0]);
  var dd=parseInt(numbers[1]);
  if (yyyy>15 && yyyy<21) {yyyy=yyyy+2000;}
  else if (yyyy>2020 || yyyy<2000){yyyy=2000;}
  if (mm<1 || mm>12) {mm=0;}
  if (dd<1 || dd>31) {dd=0;}
  var day = yyyy*10000+mm*100+dd;
  return day;
}

function day1(date){
  if (date==='' || date===null) {return 0;}
  var numbers = date.match(/\d+/g);
  var yyyy=parseInt(numbers[2]);
  var mm=parseInt(numbers[0]);
  var dd=parseInt(numbers[1]);
  if (yyyy>15 && yyyy<21) {yyyy=yyyy+2000;}
  else if (yyyy>2020 || yyyy<2000){yyyy=2000;}
  if (mm<1 || mm>12) {mm=0;}
  if (dd<1 || dd>31) {dd=0;}
  var day = (yyyy-2016)*365+mm*30+dd;
  return day;
}

function today1() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  var day = (yyyy-2016)*365+mm*30+dd;
  return day;
}

function getToday(zeroPadDate=false) {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();

  if (zeroPadDate) {
    if (dd < 10) {dd = '0' + dd;}
    if (mm < 10) {mm = '0' + mm;}
  }

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}
