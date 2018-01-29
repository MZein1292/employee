import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  acctNote: DS.attr(),
  code: DS.attr(),
  college: DS.attr(),
  comment: DS.attr(),
  company: DS.attr(),
  cost: DS.attr(),
  country: DS.attr(),
  degree: DS.attr(),
  employeeID: DS.attr(),
  experience: DS.attr(),
  fcaContact: DS.attr(),
  fcaOrg: DS.attr(),
  fcaSR: DS.attr(),
  firstname: DS.attr(),
  gender: DS.attr(),
  hours: DS.attr(),
  immigration: DS.attr(),
  intlTravel: DS.attr(),
  jobcode: DS.attr(),
  lastname: DS.attr(),
  manager: DS.attr(),
  otComment: DS.attr(),
  otDate: DS.attr(),
  rate: DS.attr(),
  rating: DS.attr(),
  start: DS.attr(),
  status: DS.attr(),
  type: DS.attr(),
  weekdayOT: DS.attr(),
  weekendOT: DS.attr(),
  workType: DS.attr(),
  zcBalance: DS.attr(),
  zcBalMonth: DS.attr(),
  zcMonthSpend: DS.attr(),
  zcStart: DS.attr(),
  expyear: Ember.computed('experience', function() {
    return 2018-parseInt(this.get('experience'));
  }),
  tenure: Ember.computed('experience', function() {
    return this.get('start').substr(0,4);
  }),
  startVal: Ember.computed('start', function() {
    return day(this.get('start'));
  }),
  zcEnd: Ember.computed('zcStart', 'zcBalance','zcBalMonth','zcMonthSpend',function() {
    let month=0;
    let bal=0;
    let spend=0;
    let end=0;
    let mm=0;
    let dd=0;
    let yy=2017;
    if (invalid(this.get('zcBalMonth'))) {return '';}
    else if (invalid(this.get('zcBalance'))) {return '';}
    else if (invalid(this.get('zcMonthSpend'))) {return '';}
    month= parseInt(this.get('zcBalMonth'));
    bal=parseInt(this.get('zcBalance'));
    spend=parseInt(this.get('zcMonthSpend'));
    end = month+bal/spend;
    mm = Math.floor(end);
    dd=Math.floor(30*(end-mm));
    if (mm>12) {mm=mm-12;yy=yy+1;}
    if (mm<10) {mm = '0'+mm;}
    if (dd<10) {dd = '0'+dd;}
    return yy+'_'+mm+'_'+dd;
  })
});

function day(date){
  // yyyy_mm_dd
  if (date==='') {date='2020_01_01';}

  var numbers = date.match(/\d+/g);
  var yyyy=parseInt(numbers[0]);
  var mm=parseInt(numbers[1]);
  var dd=parseInt(numbers[2]);
  if (yyyy>2020 || yyyy<2000){yyyy=2020;}
  if (mm<1 || mm>12) {mm=0;}
  if (dd<1 || dd>31) {dd=0;}
  var day = yyyy*10000+mm*100+dd;
  return day;
}

function invalid(str){
  if (str===null) {return 1;}
  else if (isNaN(str)) {return 1;}
  else if (str===undefined) {return 1;}
  else if (parseInt(str)===0) {return 1;}
  else {return 0;}
}
