import Ember from 'ember';
import {getToday} from '../utils/functions';
import {managers,managers2} from '../utils/globals';

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
  //----------------------------------
  // for new employee dialog
  newCustomer: '',
  newBle: '',
  newDescription: '',
  newContact: '',
  newComment: '',
  //-----------------------------------
  viewStyle: 'STD',
  mgrFilter: 'ALL',
  sortby: 'NAME',
  viewTypeList: ['STD'],
  managers: managers,
  managers2: managers2,
  sortItems: ['NAME', 'MANAGER'],
  filtered: Ember.computed('mgrFilter', 'sortby', 'reverse', 'refresh', function () {
      let filter2 = this.get('model');
      let sortBy = '';

      // Sort Data
      if (this.get('sortby') === 'MANAGER') {
        sortBy = 'manager';
      }
      else if (this.get('sortby') === 'NAME') {
        sortBy = 'name';
      }

      if (sortBy !== '') {
        filter2 = filter2.sortBy(sortBy);
      }
      //reverse sort
      if (this.get('reverse')) {
        filter2.reverse();
      }

      // Filter by Manager
      if (this.get('mgrFilter') !== 'ALL') {
        filter2 = filter2.filterBy('manager', this.get('mgrFilter'));
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
    test(){
      //window.open('https://newton.newtonsoftware.com/candidate/8a7886f856fdfca601570c227c9f6f34');
      this.toggleProperty('showEdit');
    },
    new(){
      this.send('clearDlgData');
      this.set('showDlg', 'NEW');
    },
    createNew(){
      let customer = this.get('newCustomer');
      let ble = this.get('newBle');
      let description = this.get('newDescription');
      let contact = this.get('newContact');
      let comment = this.get('newComment');

      //Create valid flag
      let isValid = true;

      // Get todays date
      let today = getToday();

      // get index
      let idx = get_index(this.get('model')) + 1;
      console.log(idx);

      //check index
      if (idx < 100) {
        idx = 998;
        alert('Index out of Range');
      }

      //check customer
      if (customer === '' || customer === undefined) {
        customer = 'ERROR';
        isValid = false;
        alert('Need Customer');
      }

      //check ble
      if (ble === '' || ble === undefined) {
        ble = 'ERROR';
        isValid = false;
        alert('Need BLE');
      }

      //check description
      if (description === '' || description === undefined) {
        description = 'ERROR';
        isValid = false;
        alert('Need Description');
      }

      //check contact
      if (contact === undefined) {
        contact = '';
      }

      // echo the function inputs
      console.log('customer: ' + customer);
      console.log('ble:' + ble);
      console.log('description: ' + description);
      console.log('contact: ' + contact);
      console.log('idx: ' + idx);
      console.log('comment: ' + comment);

      // create new sale
      let newSale = this.store.createRecord('sale', {
        id: customer + idx,
        ble: ble,
        comment: comment,
        idx: idx,
        ref: customer + idx,
        description: description,
        contact: contact,
        customer: customer,
        date: today,
        probability: 0,
        qty: 0,
        status: '1 - Active',
        type: 'TBD',
        value: 0
      });
      if (isValid) {
        newSale.save().then(() => {
            console.log('New Sale Saved');
            this.transitionToRoute('sales');
          },
          () => {
            console.log('Save Failed');
            alert("Save Failed");
          });
      }
      this.send('closeDlg');
      this.send('refresh');
    },
    editDlg(val1, val2){
      //va1 = item, val2=data record
      if (this.get('user').get('readOnly') && (val1 !=='acctNote')) {return;}

      if (val1 === 'comment') {
        this.set('title', 'Comment');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'acctNote') {
        this.set('title', 'Accounting Note');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'intlTravel') {
        this.set('title', 'International Travel');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'otComment') {
        this.set('title', 'Overtime Comments');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'weekdayOT') {
        this.set('title', 'Weekday OT');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'weekendOT') {
        this.set('title', 'Weekend OT');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'manager') {
        this.set('title', 'MANAGER');
        this.set('dlgDropdown', this.get('managers'));
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
      this.set('selectedData', val1);
      this.set('selectedRecord', val2);
      this.set('dlgData', val2.get(val1));
      // Save screen position
      this.set('dlgScrollTop', $(window).scrollTop());
    },
    saveDlgData(){
      let self=this;
      let record = this.get('selectedRecord');
      if (record !== null) {
        console.log(record);
        record.set(this.get('selectedData'), this.get('dlgData'));
        record.set('otDate',getToday());
        record.save();
      }
      Ember.run.later((function () {
        self.send('refresh');
      }), 500);
      this.send('closeDlg');
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
  console.log('Index=' + max);
  return max;
}


