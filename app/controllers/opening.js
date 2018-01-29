import Ember from 'ember';
import {getToday} from '../utils/functions';
import {managers} from '../utils/globals';

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
    //----------------------------------
    // for new job dialog
    newCustomer: '',
    newBle: '',
    newDescription: '',
    newContact: '',
    newComment: '',
    //-----------------------------------
    viewStyle: 'STD',
    mgrFilter: 'ALL',
    statusFilter: 'ALL',
    typeFilter: 'ALL',
    sortby: 'CUSTOMER',
    viewTypeList: ['STD', 'COST'],
    managers: managers,
    exps:['Senior', 'Mid','Junior'],
    types:['Backfill','New Job'],
    statuses: ['1) Looking', '2) Intervieiwing', '3) Made Offer', '', '5) Waiting Visa'],
    sortItems: ['MANAGER', 'ORG', 'CONTACT', 'TYPE'],
    filtered: Ember.computed('mgrFilter', 'statusFilter', 'typeFilter', 'sortby', 'reverse', 'refresh', function () {
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

        //reverse sort
        if (this.get('reverse')) {
            filter2.reverse();
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
        test(){
            //window.open('https://newton.newtonsoftware.com/candidate/8a7886f856fdfca601570c227c9f6f34');
            this.toggleProperty('showEdit');
        },
        new(){
            this.send('clearDlgData');
            this.set('showDlg', 'NEW');
        },
        createNew(){
            let customer=this.get('newCustomer');
            let ble=this.get('newBle');
            let description=this.get('newDescription');
            let contact=this.get('newContact');
            let comment=this.get('newComment');

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
                newSale.save().then(()=> {
                        console.log('New Sale Saved');
                        this.transitionToRoute('sales');
                    },
                    ()=> {
                        console.log('Save Failed');
                        alert("Save Failed");
                    });
            }
            this.send('closeDlg');
            this.send('refresh');
        },
        editDlg(val1, val2){
          //va1 = item, val2=data record
          if (this.get('user').get('readOnly')) {return;}

            if (val1 === 'comment') {
                this.set('title', 'Comment');
                this.set('dlgData', val2.get('comment'));
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
            else if (val1 === 'ble') {
                this.set('title', 'BLE');
                this.set('dlgData', val2.get('ble'));
                this.set('dlgDropdown', this.get('bles'));
                this.set('showDlg', 'DROPDOWN');
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
            this.set('showDlg', 'NONE');
            this.send('clearDlgData');
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
