import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  backfill: DS.attr(),
  backfillStart: DS.attr(),
  backfillComment: DS.attr(),
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
  lastname: DS.attr(),
  manager: DS.attr(),
  newCompany: DS.attr(),
  rate: DS.attr(),
  rating: DS.attr(),
  startDate: DS.attr(),
  termDate: DS.attr(),
  termReason: DS.attr(),
  workType: DS.attr(),
  expyear: Ember.computed('experience', function () {
    return 2018 - parseInt(this.get('experience'));
  }),
  termYear: Ember.computed('termDate', function () {
    return this.get('termDate').substring(0, 4);
  }),
  startYear: Ember.computed('startDate', function () {
    return this.get('startDate').substring(0, 4);
  }),
  gap: Ember.computed('termDate', 'backfillStart', function () {
    var ty, tm, td, by, bm, bd;
    let invalid = 0;
    if (this.get('termDate').length === 10) {
      ty = parseInt(this.get('termDate').substring(0, 4));
      tm = parseInt(this.get('termDate').substring(5, 7));
      td = parseInt(this.get('termDate').substring(8, 10));
    }
    else {
      invalid = 1;
    }
    if (this.get('backfillStart').length === 10) {
      by = parseInt(this.get('backfillStart').substring(0, 4));
      bm = parseInt(this.get('backfillStart').substring(5, 7));
      bd = parseInt(this.get('backfillStart').substring(8, 10));
    }
    else {
      invalid = 1;
    }
    if (invalid) {
      return '';
    }
    else {
      return (365 * (by - ty) + 30 * (bm - tm) + (bd - td));
    }
  }),
  startDateVal: Ember.computed('startDate', function () {
    return day(this.get('startDate'));
  }),
  termDateVal: Ember.computed('termDate', function () {
    return day(this.get('termDate'));
  }),
});

function day(date){
  // yyyy_mm_dd
  if (date==='') {date='2000_01_01';}

  var numbers = date.match(/\d+/g);
  var yyyy=parseInt(numbers[0]);
  var mm=parseInt(numbers[1]);
  var dd=parseInt(numbers[2]);
  if (yyyy>2020 || yyyy<2000){yyyy=2000;}
  if (mm<1 || mm>12) {mm=0;}
  if (dd<1 || dd>31) {dd=0;}
  var day = yyyy*10000+mm*100+dd;
  return day;
}
