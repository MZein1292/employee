import Ember from 'ember';
//import {getToday} from '../utils/functions';
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
  //-----------------------------------
  mgrFilter: 'ALL',
  sortBy: 'name',
  managers: managers,
  managers2: managers2,
  sortItems: ['name', 'manager'],
  filteredEmp: Ember.computed('mgrFilter', 'sortBy', 'reverse', 'refresh', function () {
      let filter = this.get('model.emp');

      if (this.get('sortBy') !== 'ALL') {
        filter = filter.sortBy(this.get('sortBy'));
      }
      //reverse sort
      if (this.get('reverse')) {
        filter.reverse();
      }

      // Filter by Manager
      if (this.get('mgrFilter') !== 'ALL') {
        filter = filter.filterBy('manager', this.get('mgrFilter'));
      }

      //Done sorting
      return filter;
    }),
  filteredExEmp: Ember.computed('mgrFilter', 'sortBy', 'reverse', 'refresh', function () {
    let filter = this.get('model.ex_emp');

    if (this.get('sortBy') !== 'ALL') {
      filter = filter.sortBy(this.get('sortBy'));
    }
    //reverse sort
    if (this.get('reverse')) {
      filter.reverse();
    }

    // Filter by Manager
    if (this.get('mgrFilter') !== 'ALL') {
      filter = filter.filterBy('manager', this.get('mgrFilter'));
    }

    //Done sorting
    return filter;
  }),

  actions: {
    rev() {
      this.toggleProperty('reverse');
    },
    refresh(){
      this.toggleProperty('refresh');
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
    test(){
      //window.open('https://newton.newtonsoftware.com/candidate/8a7886f856fdfca601570c227c9f6f34');
      this.toggleProperty('showEdit');
    },
    editDlg(val1, val2){
      //va1 = item, val2=data record
      if (val1 === 'comment') {
        this.set('title', 'Comment');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'jobcode') {
        this.set('title', 'Jobcode');
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'gender') {
        this.set('title', 'Gender');
        this.set('dlgDropdown', ['M', 'F']);
        this.set('showDlg', 'DROPDOWN');
      }
      else if (val1 === 'manager') {
        this.set('title', 'MANAGER');
        this.set('dlgDropdown', this.get('managers'));
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
    createNewEx(emp){

      if (check_ex(this.get('model.ex_emp'), emp.get('id'))) {
        alert('OK');

        let newEx = this.store.createRecord('ex-employee', {
          id: emp.get('id'),
          backfill: '',
          backfillStart: '',
          backfillComment: '',
          code: emp.get('code'),
          college: emp.get('college'),
          comment: emp.get('comment'),
          company: emp.get('company'),
          cost: emp.get('cost'),
          country: emp.get('country'),
          degree: emp.get('degree'),
          employeeID: emp.get('employeeID'),
          experience: emp.get('experience'),
          fcaContact: emp.get('fcaContact'),
          fcaOrg: emp.get('fcaOrg'),
          fcaSR: emp.get('fcaSR'),
          firstname: emp.get('firstname'),
          gender: emp.get('gender'),
          hours: emp.get('hours'),
          immigration: emp.get('immigration'),
          lastname: emp.get('lastname'),
          manager: emp.get('manager'),
          newCompany: '',
          rate: emp.get('rate'),
          rating: emp.get('rating'),
          startDate: emp.get('start'),
          termDate:'',
          termReason: '',
          workType:emp.get('workType'),
        });

         newEx.save().then(() => {
            console.log('Ex-Employee Saved');
            emp.destroyRecord(); //delete employee
          },
          () => {
            alert("Error Creating Employee");
          });
      }
      else {alert('ERROR - Ex-Employee already exists');}

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


function check_ex(mdl, ex_emp){
  let isValid = true;

  //check if jobcode exists
  mdl.forEach(function (item) {
    if (item.get('id') === ex_emp) {
      isValid = false;
    }
  });
  return isValid;
}
