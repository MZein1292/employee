import DS from 'ember-data';

export default DS.Model.extend({
  area: DS.attr(),
  balance: DS.attr(),
  balmonth: DS.attr(),
  contact: DS.attr(),
  description: DS.attr(),
  employee: DS.attr(),
  endmonth: DS.attr(),
  jobcode: DS.attr(),
  lead: DS.attr(),
  manager: DS.attr(),
  monthavg: DS.attr(),
  org: DS.attr(),
  qty: DS.attr(),
  status: DS.attr(),
  type: DS.attr()
});
