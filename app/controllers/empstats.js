import Ember from 'ember';
import {immList,managers} from '../utils/globals';

export default Ember.Controller.extend({
  allowDelete: false,
  refresh: false,
  //---------------------------------
  // For edit dialogs
  showDlg: 'NONE',
  dlgData: '',
  dlgDropdown: null,
  selectedRecord: null,
  selectedData: '',
  title: '',
  //-----------------------------------
  female:0,
  immData:'',
  degData:'',
  countryData:'',
  orgData:'',
  contactData:'',
  srData:'',
  wtData:'',
  //-----------------------------------
  viewStyle: 'STD',
  mgrFilter: 'ALL',
  statusFilter: 'ALL',
  immFilter:'ALL',
  typeFilter: 'ALL',
  sortBy: 'ALL',
  viewTypeList: ['STD', 'COST'],
  managers: managers,
  types:['PS','ZC','ZC*'],
  statuses: ['Active', 'Intern', 'Inactive'],
  immList: immList,
  filtered: Ember.computed('mgrFilter', 'statusFilter', 'typeFilter', 'immFilter',
    'sortBy', 'reverse', 'refresh', function () {
      let filter2 = this.get('model');
      let sortBy = '';
      let self = this;


      if (sortBy !== 'ALL') {
        filter2 = filter2.sortBy(this.get('sortBy'));
      }
      //reverse sort
      if (this.get('reverse')) {filter2.reverse();}

      // Filter by Manager
      if (this.get('mgrFilter') !== 'ALL') {
        filter2 = filter2.filterBy('manager', this.get('mgrFilter'));
      }

      // Filter by Status
      if (this.get('statusFilter') !== 'ALL') {
        filter2 = filter2.filterBy('status', this.get('statusFilter'));
      }

      // Filter by Immigration
      if (this.get('immFilter') !== 'ALL') {
        filter2 = filter2.filterBy('immigration', this.get('immFilter'));
      }

      // Filter by Type
      if (this.get('typeFilter') !== 'ALL') {
        filter2 = filter2.filterBy('type', this.get('typeFilter'));
      }

      // Compute Stats
      mdl = this.get('model.employees');

      this.set('female', 0);
      this.set('male', 0);
      mdl.forEach(function (item) {
        console.log(item.get('name') + ' ' + item.get('gender'));
        if (item.get('gender') === 'F') {
          self.set('female', self.get('female') + 1);
        }
        else if (item.get('gender') === 'M') {
          self.set('male', self.get('male') + 1);
        }
      });

      //Done sorting
      return filter2;
    }),
  male: Ember.computed('refresh', function () {
    let mdl = this.get('model.employees');
    let self = this;
    let count = 0;
    let key = '';
    let str = '';

    let imm = {};
    let country = {};
    let degree = {};
    let org = {};
    let sr = {};
    let contact = {};
    let worktype = {};

    this.set('female', 0);
    mdl.forEach(function (item) {
      console.log(item.get('firstname') + ' ' + item.get('gender'));
      if (item.get('gender') === 'M') {
        count++;
      }
      else if (item.get('gender') === 'F') {
        self.set('female', self.get('female') + 1);
      }

      add_item(imm,item.get('immigration'));
      add_item(country,item.get('country'));
      add_item(degree,item.get('degree'));
      add_item(org,item.get('fcaOrg'));
      add_item(sr,item.get('fcaSR'));
      add_item(contact,item.get('fcaContact'));
      add_item(worktype,item.get('workType'));
    });

    //Sort Results
    this.set('immData',sorted(imm));
    this.set('degreeData',sorted(degree));
    this.set('countryData',sorted(country));
    this.set('orgData',sorted(org));
    this.set('srData',sorted(sr));
    this.set('contactData',sorted(contact));
    this.set('wtData',sorted(worktype));

    return count;
  }),


  actions: {
    rev() {
      this.toggleProperty('reverse');
    },
    refresh(){
      this.toggleProperty('refresh');
    },
    editDlg(val1, val2){
      //va1 = item, val2=data record
      if (val1 === 'comment') {
        this.set('title', 'Comment');
        this.set('dlgData', val2.get('comment'));
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'immigration') {
        this.set('title', 'Immigration');
        this.set('dlgData', val2.get('immigration'));
        this.set('dlgDropdown', this.get('immList'));
        this.set('showDlg', 'DROPDOWN');
      }
      this.set('selectedData', val1);
      this.set('selectedRecord', val2);
    },
    saveDlgData(){
      let record = this.get('selectedRecord');
      if (record !== null) {
        console.log(record);
        record.set(this.get('selectedData'), this.get('dlgData'));
        record.save();
      }
      this.send('closeDlg');
      this.send('refresh');
    },
    closeDlg(){
      this.set('showDlg', 'NONE');
      this.send('clearDlgData');
    },
    clearDlgData(){
      this.set('selectedRecord', null);
      this.set('selectedData', '');
    }
  },
});

function sorted(assoc) {
  let str='';
  let arr = []; // Array

  // Save in Array
  Object.keys(assoc).forEach(function (item) {
    arr.push({name:item, val:assoc[item]})
  });

  //Sort
  let sorted = arr.sort(function(a, b) {
    return b.val - a.val;
  });

  sorted.forEach(function (item) {
    str = str + item.name + ":" + item.val+ ", ";
  });

  return str;
}

function add_item(assoc,key){
  if (assoc.hasOwnProperty(key)) {
    assoc[key] = assoc[key] + 1;
  }
  else {
    assoc[key] = 1;
  }
}
