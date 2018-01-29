import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr(),
  step1: DS.attr(),
  step2: DS.attr(),
  step3: DS.attr(),
  step4: DS.attr(),
  step5: DS.attr(),
  step1comment: DS.attr(),
  step2comment: DS.attr(),
  step3comment: DS.attr(),
  step4comment: DS.attr(),
  step5comment: DS.attr(),
  step1start: DS.attr(),
  step2start: DS.attr(),
  step3start: DS.attr(),
  step4start: DS.attr(),
  step5start: DS.attr(),
  step1end: DS.attr(),
  step2end: DS.attr(),
  step3end: DS.attr(),
  step4end: DS.attr(),
  step5end: DS.attr(),
  comment: DS.attr(),
  changelog: DS.attr(),
});
