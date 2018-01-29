import Ember from 'ember';

export default Ember.Controller.extend({
  //---------------------------------
  // For edit dialogs
  showDlg: 'NONE',
  dlgData: '',
  dlgDropdown: null,
  selectedRecord: null,
  selectedData: '',
  newName:'',
  newOwner:'',
  newDescription:'',
  title: '',
  //-----------------------------------
  owners:['Aneil Shah','John Podolan', 'Dave Huffman', 'Joel Tremblay', 'Mike Nidiffer',  'Ben Lee', 'Jeff Lindgren',  'Devon Bleibtrey', 'Other'],
  statuses:['Open','Closed','Rejected'],
  //-----------------------------------
  // Set Default Filters
  statusFilter:'Open',
  allowDelete: false,
  refresh: true,
  reverse: false,
  sortBy: 'DATE',
  //-----------------------------------
  // Set computeted Data
  filtered: Ember.computed('statusFilter', 'refresh', 'sortBy', 'reverse', function () {
      var filter2;
      var sortItem='';

      // Filter by Manager
      filter2 = this.get('model');

      // Sort Data
      if (this.get('sortBy') === 'DATE') {sortItem='dateVal';}

      // Reverse Data
      if (this.get('reverse')) {filter2=filter2.sortBy(sortItem).reverse();}
      else {filter2=filter2.sortBy(sortItem);}

      // Filter by status
      if (this.get('statusFilter') === 'ALL') {}
      else {
        filter2 = filter2.filterBy('status', this.get('statusFilter'));
      }

      //Done sorting
      return filter2;
    }),

  actions:{
    refresh() {
      this.toggleProperty('refresh');
    },
    sort(val){
      if (this.get('sortval')===val){this.toggleProperty('reverse');}
      else {this.set('sortval',val);}
    },
    updateFilter(val1,val2){
      if (val2!==null){
        this.set(val1,val2);
      }
    },
    openWindow(url){
      window.open(url);
    },
    delete(issue){
      var self=this;
      if (this.allowDelete) {
        issue.destroyRecord();
        this.set('allowDelete', false);
      }
      Ember.run.later((function() {
        self.send('refresh');
      }), 1000);
    },
    new(){
      this.set('showDlg', 'NEW');
    },
    saveIssue(){
      let self = this;
      // create new issue
      let newIssue = this.store.createRecord('issue', {
         comment: '',
         date: getToday(),
         description: this.get('newDescription'),
         name: this.get('newName'),
         owner: this.get('newOwner'),
         status: 'Open',
      });

      if (this.get('newOwner')==='') {alert("Must select issue owner");}
      else if (this.get('newDescription')==='') {alert("Must have a description");}
      else {
        newIssue.save().then(() => {
            console.log('New Issue Saved');
          },
          () => {
            console.log('Issue Save Failed');
          });
        this.send('closeDlg');
        Ember.run.later((function () {
          self.send('refresh');
        }), 1000);
      }
    },
    reverseSort(){
      this.toggleProperty('reverse');
    },
    toggleDelete() {
      this.toggleProperty('allowDelete');
    },
    test(){
      alert('test');
    },
     editDlg(val1, val2){
      //va1 = item, val2=data record
      if (val1 === 'comment') {
        this.set('title', 'Comment');
        this.set('dlgData', val2.get('comment'));
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'name') {
        this.set('title', 'Issue Name');
        this.set('dlgData', val2.get('name'));
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'description') {
        this.set('title', 'Description');
        this.set('dlgData', val2.get('description'));
        this.set('showDlg', 'EDIT');
      }
      else if (val1 === 'status') {
        this.set('title', 'Status');
        this.set('dlgData', val2.get('status'));
        this.set('dlgDropdown', this.get('statuses'));
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
    },
    closeDlg(){
      var self=this;
      this.set('showDlg', 'NONE');
      this.send('clearDlgData');
      Ember.run.later((function () {
        self.send('refresh');
      }), 400);
    },
    clearDlgData(){
      this.set('selectedRecord', null);
      this.set('selectedData', '');
      this.set('newName', '');
      this.set('newOwner', '');
      this.set('newDescription', '');
    }
  }
});

function getToday(zeroPadDate=false) {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();

  if (zeroPadDate) {
    if (dd < 10) {dd = '0' + dd;}
    if (mm < 10) {mm = '0' + mm;}
  }

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}
