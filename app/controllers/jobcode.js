import Ember from 'ember';
import {managers,managers2} from '../utils/globals';

export default Ember.Controller.extend({
  allowDelete: false,
  //---------------------------------
  // For edit dialogs
  showDlg: 'NONE',
  dlgData: '',
  dlgDropdown: null,
  dlgScrollTop: 0,
  selectedRecord: null,
  selectedData: '',
  title: '',
  //----------------------------------
  // for new jobcode dialog
  newJobcode: '',
  //-----------------------------------
  viewStyle: 'STD',
  refresh: false,
  reverse:false,
  mgrFilter: 'ALL',
  statusFilter: 'ALL',
  typeFilter: 'ALL',
  leadFilter: 'ALL',
  sortby: 'JOBCODE',
  viewTypeList: ['STD', 'COST'],
  managers: managers,
  managers2: managers2,
  types: ['PS', 'ZC', 'ZC*'],
  types2: ['ALL', 'PS', 'ZC', 'ZC*'],
  statuses: ['Active', 'Backfill', 'On Hold'],
  statuses2: ['ALL','Active', 'Backfill', 'On Hold'],
  leads: ['Aneil', 'John'],
  orgs: ['EE', 'Uconnect', 'Powertrain', 'SRT', '<Non FCA>', 'Other'],
  sortItems: ['JOBCODE', 'MANAGER', 'ORG', 'CONTACT', 'TYPE'],
  filtered: Ember.computed('mgrFilter', 'statusFilter', 'typeFilter', 'leadFilter',
    'sortby', 'reverse', 'refresh', function () {
      let filter2 = this.get('model');

      // Sort Data
      if (this.get('sortby') === 'MANAGER') {
        filter2 = filter2.sortBy('manager');
      }
      else if (this.get('sortby') === 'ORG') {
        filter2 = filter2.sortBy('org');
      }
      else if (this.get('sortby') === 'CONTACT') {
        filter2 = filter2.sortBy('contact');
      }
      else if (this.get('sortby') === 'TYPE') {
        filter2 = filter2.sortBy('type');
      }
      else if (this.get('sortby') === 'JOBCODE') {
        filter2 = filter2.sortBy('jobcode');
      }

      //reverse sort
      if (this.get('reverse')) {
        filter2 = filter2.reverse();
      }

      // Filter by Manager
      if (this.get('mgrFilter') !== 'ALL') {
        filter2 = filter2.filterBy('manager', this.get('mgrFilter'));
      }

      // Filter by Status
      if (this.get('statusFilter') !== 'ALL') {
        filter2 = filter2.filterBy('status', this.get('statusFilter'));
      }

      // Filter by Type
      if (this.get('typeFilter') !== 'ALL') {
        filter2 = filter2.filterBy('type', this.get('typeFilter'));
      }

      // Filter by Lead
      if (this.get('leadFilter') !== 'ALL') {
        filter2 = filter2.filterBy('lead', this.get('leadFilter'));
      }

      //Done sorting
      return filter2;
    }),
  actions: {
    rev() {
      this.toggleProperty('reverse');
    },
    refresh(){
      this.toggleProperty('refresh');
    },
    toggleDelete() {
      this.toggleProperty('allowDelete');
    },
    delete(sale){
      let self=this;
      if (this.allowDelete) {
        sale.deleteRecord();
        sale.save();
        this.set('allowDelete', false);
      }
      else {alert("Delete not allowed");}

      Ember.run.later((function () {
        self.send('refresh');
      }), 500);
    },
    scrollTo(tag){
      $(window).scrollTop(tag);
    },
    test(){

    },
    new(){
      this.set('title', 'New Jobcode');
      this.set('dlgData', '');
      this.set('showDlg', 'EDIT');
      this.set('selectedData', 'newJobcode');
      this.set('selectedRecord', null);
    },
    editDlg(val1, val2){
      //va1 = item, val2=data record
      if (this.get('user').get('readOnly')) {return;}

      if (val1 === 'employee') {
        this.set('title', 'Employee');
        this.set('dlgData', val2.get('employee'));
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'jobcode') {
        this.set('title', 'Jobcode');
        this.set('dlgData', val2.get('jobcode'));
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'description') {
        this.set('title', 'Description');
        this.set('dlgData', val2.get('description'));
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'contact') {
        this.set('title', 'Contact');
        this.set('dlgData', val2.get('contact'));
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'manager') {
        this.set('title', 'Manager');
        this.set('dlgData', val2.get('manager'));
        this.set('dlgDropdown', this.get('managers'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'status') {
        this.set('title', 'Status');
        this.set('dlgData', val2.get('status'));
        this.set('dlgDropdown', this.get('statuses'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'org') {
        this.set('title', 'FCA Org');
        this.set('dlgData', val2.get('org'));
        this.set('dlgDropdown', this.get('orgs'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'type') {
        this.set('title', 'Type');
        this.set('dlgData', val2.get('type'));
        this.set('dlgDropdown', this.get('types'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'lead') {
        this.set('title', 'Account Lead');
        this.set('dlgData', val2.get('lead'));
        this.set('dlgDropdown', this.get('leads'));
        this.set('showDlg', 'DROPDOWN');
      }

      this.set('selectedData', val1);
      this.set('selectedRecord', val2);
      // Save screen position
      this.set('dlgScrollTop', $(window).scrollTop());
    },
    saveDlgData(){
      let self = this;
      let record = this.get('selectedRecord');
      if (record !== null) {
        if (this.get('selectedData') === 'jobcode') {
          this.send('rename',record,this.get('dlgData'));
        }
        else {
          record.set(this.get('selectedData'), this.get('dlgData'));
          record.save();
        }
      }
      //Save new jobcode
      else {
        if (this.get('selectedData') === 'newJobcode') {
          this.send('createNew',this.get('dlgData'));
        }
      }
      Ember.run.later((function () {
        self.send('refresh');
      }), 500);
      this.send('closeDlg');
    },
    createNew(jobcode){
      if (check_code(this.get('model'), jobcode)) {
        let newJobcode = this.store.createRecord('code', {
          id: jobcode,
          area: '',
          balance: '0',
          balmonth: '1',
          contact: '',
          description: '',
          employee: '',
          endmonth: '',
          jobcode: jobcode,
          lead: '',
          manager: '',
          monthavg: '',
          org: '',
          qty: '1',
          status: '',
          type: '',
        });

        newJobcode.save().then(() => {
            console.log('New Jobcode Saved');
          },
          () => {
            alert("Error Creating Jobcode");
          });
      }
      else {alert('ERROR - Jobcode already exists');}
      this.send('closeDlg');
      this.send('refresh');
    },
    rename(old, newCode){
      if (check_code(this.get('model'), newCode)) {
        let newJobcode = this.store.createRecord('code', {
          id: newCode,
          area: old.get('area'),
          balance: old.get('balance'),
          balmonth: old.get('balmonth'),
          contact: old.get('contact'),
          description: old.get('description'),
          employee: old.get('employee'),
          endmonth: old.get('endmonth'),
          jobcode: newCode,
          lead: old.get('lead'),
          manager: old.get('manager'),
          monthavg: old.get('monthavg'),
          org: old.get('org'),
          qty: old.get('qty'),
          status: old.get('status'),
          type: old.get('type'),
        });
        newJobcode.save().then(() => {
            console.log('New Jobcode Saved');
            old.destroyRecord();
          },
          () => {
            alert("Error Creating Jobcode");
          });
      }
      else {alert('ERROR - Jobcode already exists');}
      this.send('closeDlg');
      this.send('refresh');
    },
    closeDlg(){
      let self = this;
      this.set('showDlg', 'NONE');
      this.send('clearDlgData');
      Ember.run.later((function () {
        self.send('scrollTo', self.get('dlgScrollTop'));
      }), 200);
    },
    clearDlgData(){
      this.set('selectedRecord', null);
      this.set('selectedData', '');
    }
  },
});

function check_code(mdl, jobcode){
  let isValid = true;

  //check if jobcode exists
  mdl.forEach(function (item) {
    if (item.get('id') === jobcode) {
      isValid = false;
    }
  });
  return isValid;
}
