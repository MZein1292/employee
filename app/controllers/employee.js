import Ember from 'ember';
import {getToday,properCase} from '../utils/functions';
import {colleges,countries,immList,immList2,managers,managers2} from '../utils/globals';

export default Ember.Controller.extend({
  allowDelete: false,
  refresh: false,
  //---------------------------------
  // For edit dialogs
  showDlg: 'NONE',
  dlgData: '',
  dlgDropdown: null,
  dlgScrollTop: 0,
  selectedRecord: null,
  selectedData: '',
  title: '',
  //-----------------------------------
  viewStyle: 'STD',
  mgrFilter: 'ALL',
  statusFilter: 'ALL',
  immFilter: 'ALL',
  startYearFilter:'ALL',
  typeFilter: 'ALL',
  sortBy: 'start',
  viewTypeList: ['STD','OTHER','COST', 'FCA','ZC'],
  SRs:['Ciapetta','DiCicco','Metz','Nicolopoulos','Olmack','Riddick','Trame','Travato','SRT','PTEE','ePT','Other'],
  orgs:['EE','ePT','Powertrain','Uconnect','SRT','Chassis','EM','Interior'],
  workTypes:['DRE','Systems','Validation','LV Wiring','HV Wiring', 'Uconnect','Uconnect Val','SRT','Mules','Proto','SWAT',
    'Software','Diag','MBD','IT','Resident',
  'ADAS','ISO','Calibration'],
  managers: managers,
  managers2: managers2,
  colleges:colleges,
  types: ['PS', 'ZC', 'ZC*'],
  types2: ['ALL','PS', 'ZC', 'ZC*'],
  startYears: ['ALL','2018','2017','2016','2015','2014','2013','2012','2011','2010'],
  statuses: ['Active', 'Intern', 'Inactive', 'Leaving','Pending'],
  statuses2: ['ALL','Active', 'Intern', 'Inactive', 'Leaving','Pending'],
  ratings:['1','2','@','#','*'],
  countries: countries,
  immList: immList,
  immList2: immList2,

  filtered: Ember.computed('mgrFilter', 'statusFilter', 'typeFilter', 'immFilter', 'startYearFilter',
    'sortBy', 'reverse', 'refresh', function () {
      let filter = this.get('model');

      filter = filter.sortBy(this.get('sortBy'));
      if (this.get('reverse')) {filter.reverse();}

      // Filter by Manager
      if (this.get('mgrFilter') !== 'ALL') {
        filter = filter.filterBy('manager', this.get('mgrFilter'));
      }

      // Filter by Start Year
      if (this.get('startYearFilter') !== 'ALL') {
        filter = filter.filterBy('tenure', this.get('startYearFilter'));
      }

      // Filter by Status
      if (this.get('statusFilter') !== 'ALL') {
        filter = filter.filterBy('status', this.get('statusFilter'));
      }

      // Filter by Immigration
      if (this.get('immFilter') !== 'ALL') {
        filter = filter.filterBy('immigration', this.get('immFilter'));
      }


      // Filter by Type
      if (this.get('typeFilter') !== 'ALL') {
        filter = filter.filterBy('type', this.get('typeFilter'));
      }

      //this.set('count',Object.keys(filter).length);
      return filter;
    }),

  count: Ember.computed('filtered', function () {
    return Object.keys(this.get('filtered')).length;
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
    delete(emp){
      let self=this;
      if (this.allowDelete) {
        emp.destroyRecord();
        this.set('allowDelete', false);
        Ember.run.later((function () {
          self.send('refresh');
        }), 500);
      }
      else {
        alert("Delete Not Allowed");
      }
    },
    scrollTo(tag){
      $(window).scrollTop(tag);
    },
    sortBy(val){
      if (this.get('sortBy')===val) {this.send('rev');}
      else {this.set('sortBy',val);}
    },
    test(){
      //window.open('https://newton.newtonsoftware.com/candidate/8a7886f856fdfca601570c227c9f6f34');
      this.toggleProperty('showEdit');
    },
    new(){
      this.set('title', 'New Employee');
      this.set('dlgData', '');
      this.set('showDlg', 'EDIT');
      this.set('selectedData', 'newEmployee');
      this.set('selectedRecord', null);
    },
    editDlg(val1, val2){
      if (this.get('user').get('readOnly')) {return;}

      //va1 = item, val2=data record
      if (val1 === 'comment') {
        this.set('title', 'Comment');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'college') {
        this.set('title', 'College');
        if (val2.get('college')==='zOther') {this.set('showDlg', 'EDIT'); }
        else {this.set('dlgDropdown', this.get('colleges'));this.set('showDlg', 'DROPDOWN');}
      }
      else if (val1 === 'company') {
        this.set('title', 'Employer');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'degree') {
        this.set('title', 'Degree');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'experience') {
        this.set('title', 'Experience');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'fcaContact') {
        this.set('title', 'FCA Contact');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'firstname') {
        this.set('title', 'First Name');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'jobcode') {
        this.set('title', 'Jobcode');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'lastname') {
        this.set('title', 'Last Name');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'start') {
        this.set('title', 'Start');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'zcStart') {
        this.set('title', 'ZC Start Date YYYY_MM_DD');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'zcBalance') {
        this.set('title', 'ZC Balance');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'zcBalMonth') {
        this.set('title', 'ZC Balance Month');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'zcMonthSpend') {
        this.set('title', 'ZC Monthly Spend');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'country') {
        this.set('title', 'Country');
        this.set('dlgDropdown', this.get('countries'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'fcaOrg') {
        this.set('title', 'FCA Org');
        this.set('dlgDropdown', this.get('orgs'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'fcaSR') {
        this.set('title', 'FCA SR');
        this.set('dlgDropdown', this.get('SRs'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'gender') {
        this.set('title', 'Gender');
        this.set('dlgDropdown', ['M', 'F']);
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'immigration') {
        this.set('title', 'Immigration');
        this.set('dlgDropdown', this.get('immList'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'manager') {
        this.set('title', 'MANAGER');
        this.set('dlgDropdown', this.get('managers'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'rating') {
        this.set('title', 'Rating');
        this.set('dlgDropdown', this.get('ratings'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'status') {
        this.set('title', 'Status');
        this.set('dlgDropdown', this.get('statuses'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'type') {
        this.set('title', 'Type');
        this.set('dlgDropdown', this.get('types'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'workType') {
        this.set('title', 'Type of Work');
        this.set('dlgDropdown', this.get('workTypes'));
        this.set('showDlg', 'DROPDOWN');
      }
      this.set('selectedData', val1);
      this.set('dlgData', val2.get(val1));
      this.set('selectedRecord', val2);
      // Save screen position
      this.set('dlgScrollTop', $(window).scrollTop());
    },
    saveDlgData(){
      let self=this;
      let record = this.get('selectedRecord');
      if (record !== null) {
        console.log(record);
        record.set(this.get('selectedData'), this.get('dlgData'));
        record.save();
      }
      // Save New Employee
      else{
        if (this.get('selectedData') === 'newEmployee') {
          this.send('createNew',this.get('dlgData'));
        }
      }
      Ember.run.later((function () {
        self.send('refresh');
      }), 500);
      this.send('closeDlg');
    },
    createNew(employee){
      if (check_emp(this.get('model'), employee)) {
        let newEmployee = this.store.createRecord('employee', {
          id: properCase(employee),
          acctNote:'',
          code: '',
          college:'',
          comment: '',
          company: '',
          cost: '',
          country: '',
          degree: '',
          employeeID: '',
          experience: '',
          firstname: '',
          fcaContact: '',
          fcaOrg: '',
          fcaSR: '',
          gender: '',
          hours: '',
          immigration: '',
          intlTravel: '',
          jobcode: '',
          lastname: properCase(employee),
          manager: '',
          otComment: '',
          otDate: getToday(),
          rate: '',
          rating: '',
          start: '',
          status: '',
          type: '',
          weekdayOT: '',
          weekendOT: '',
          workType:'',
          zcBalance:'',
          zcBalMonth:'',
          zcMonthSpend:'',
          zcStart:'',
        });

        newEmployee.save().then(() => {
            console.log('New Employee Saved');
          },
          () => {
            alert("Error Creating Employee");
          });
      }
      else {alert('ERROR - Employee already exists');}
      this.send('closeDlg');
      this.send('refresh');
    },
    closeDlg(){
      let self=this;
      this.set('showDlg', 'NONE');
      this.send('clearDlgData');
      Ember.run.later((function () {
        self.send('scrollTo', self.get('dlgScrollTop'));
      }), 200);
    },
    clearDlgData(){
      this.set('selectedRecord', null);
      this.set('selectedData', '');
      this.set('newEmployee', '');
    }
  },
});


function check_emp(mdl, emp){
  let isValid = true;

  //check if jobcode exists
  mdl.forEach(function (item) {
    if (item.get('id') === emp) {
      isValid = false;
    }
  });
  return isValid;
}


