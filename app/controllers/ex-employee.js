import Ember from 'ember';
import {colleges,countries,immList,immList2,managers,managers2} from '../utils/globals';

export default Ember.Controller.extend({
  allowDelete: false,
  refresh: false,
  reverse: true,
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
  // for new employee dialog
  newCustomer: '',
  newBle: '',
  newDescription: '',
  newContact: '',
  newComment: '',
  //-----------------------------------
  viewStyle: 'TERM',
  mgrFilter: 'ALL',
  statusFilter: 'ALL',
  immFilter:'ALL',
  typeFilter: 'ALL',
  termYearFilter: '2017',
  sortBy: 'termDate',
  viewTypeList: ['TERM', 'EMPLOYEE'],
  managers: managers,
  managers2: managers2,
  colleges: colleges,
  types:['PS','ZC','ZC*'],
  types2:['ALL','PS','ZC','ZC*'],
  statuses: ['Active', 'Intern', 'Inactive'],
  statuses2: ['ALL','Active', 'Intern', 'Inactive'],
  countries: countries,
  immList: immList,
  immList2: immList2,
  termReasons:['FCA','OEM','Tier','Left Auto/MI','Retired','ESG Transfer','Visa Issue','Involuntary','$$$','Not Happy'],
  termYears:['ALL','2018','2017','2016','2015','2014','2013','2012','2011','2010'],
  filtered: Ember.computed('mgrFilter', 'statusFilter', 'typeFilter', 'immFilter','termYearFilter',
    'sortBy', 'reverse', 'refresh', function () {
      let filter = this.get('model');

      filter = filter.sortBy(this.get('sortBy'));

      //reverse sort
      if (this.get('reverse')) {filter.reverse();}

      // Filter by Manager
      if (this.get('mgrFilter') !== 'ALL') {
        filter = filter.filterBy('manager', this.get('mgrFilter'));
      }

      // Filter by Status
      if (this.get('statusFilter') !== 'ALL') {
        filter = filter.filterBy('status', this.get('statusFilter'));
      }

      // Filter by Immigration
      if (this.get('immFilter') !== 'ALL') {
        filter = filter.filterBy('immigration', this.get('immFilter'));
      }

      // Filter by Term Year
      if (this.get('termYearFilter') !== 'ALL') {
        filter = filter.filterBy('termYear', this.get('termYearFilter'));
      }

      // Filter by Type
      if (this.get('typeFilter') !== 'ALL') {
        filter = filter.filterBy('type', this.get('typeFilter'));
      }

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
    delete(sale){
      if (this.allowDelete) {
        sale.deleteRecord();
        sale.save();
        this.set('allowDelete', false);
      }
      this.send('refresh');
      //TODO: Add Notification if disbled
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
      this.set('title', 'New Ex Employee');
      this.set('dlgData', '');
      this.set('showDlg', 'EDIT');
      this.set('selectedData', 'newExEmployee');
      this.set('selectedRecord', null);
    },
    editDlg(val1, val2){
      if (this.get('user').get('readOnly')) {return;}

      //va1 = item, val2=data record
      if (val1 === 'comment') {
        this.set('title', 'Comment');
        this.set('showDlg', 'EDIT_BIG');
      }
      else if (val1 === 'college') {
        this.set('title', 'College');
        if (val2.get('college')==='zOther') {this.set('showDlg', 'EDIT'); }
        else {this.set('dlgDropdown', this.get('colleges'));this.set('showDlg', 'DROPDOWN');}
      }
      else if (val1 === 'jobcode') {
        this.set('title', 'Jobcode');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'degree') {
        this.set('title', 'Degree');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'backfill') {
        this.set('title', 'Backfill');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'backfillComment') {
        this.set('title', 'Backfill Comment');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'backfillStart') {
        this.set('title', 'Backfill Start Date yyyy_mm_dd');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'experience') {
        this.set('title', 'Experience Year');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'company') {
        this.set('title', 'Company');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'newCompany') {
        this.set('title', 'Term Company');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'termDate') {
        this.set('title', 'Term Date');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'gender') {
        this.set('title', 'Gender');
        this.set('dlgDropdown', ['M','F']);
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'country') {
        this.set('title', 'Country');
        this.set('dlgDropdown', this.get('countries'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'manager') {
        this.set('title', 'MANAGER');
        this.set('dlgDropdown', this.get('managers'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'immigration') {
        this.set('title', 'Immigration');
        this.set('dlgDropdown', this.get('immList'));
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'termReason') {
        this.set('title', 'Term Reason');
        this.set('dlgDropdown', this.get('termReasons'));
        this.set('showDlg', 'DROPDOWN');
      }
      this.set('dlgData', val2.get(val1));
      this.set('selectedData', val1);
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
      this.send('closeDlg');
      Ember.run.later((function () {
        self.send('refresh');
      }), 500);
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
      this.set('newCustomer', '');
      this.set('newBle', '');
      this.set('newDescription', '');
      this.set('newComment', '');
      this.set('newContact', '');
    }
  },
});

function get_index(param) {
  let max = 0, idx=0;
  param.forEach(function (item) {
    idx = parseInt(item.get('idx'));
    if (idx > max) {
      max = idx;
    }
  });
  console.log('Index='+max);
  return max;
}
