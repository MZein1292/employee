import Ember from 'ember';
import {getToday} from '../utils/functions';
import {managers} from '../utils/globals';

export default Ember.Controller.extend({
  allowDelete: false,
  refresh: false,
  //---------------------------------
  mgrFilter: 'ALL',
  month: 1,
  year: 2018,
  day: 1,
  viewType: 'EMPLOYEES',
  empCount: 0,
  empEsgCount: 0,
  empOtherCount: 0,
  exEsgCount: 0,
  exOtherCount: 0,
  exEmpCount: 0,
  totalEsgCount: 0,
  totalOtherCount: 0,
  immData:'',
  degreeData:'',
  countryData:'',
  genderData:'',
  tenureData:'',
  experienceData:'',
  esgTot: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
  otherTot: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  tot: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 42, 43],
  sortby: 'CUSTOMER',
  managers: managers,
  sortItems: ['NAME', 'MANAGER'],
  months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  years: [2018, 2017, 2016, 2015, 2014],
  viewTypes: ['EMPLOYEES', 'STATS', 'DATA'],
  filteredEmp: Ember.computed('year', 'month', 'reverse', 'refresh', function () {
    let filter = this.get('model.emp');
    let sortBy = '';

    // Sort Data
    if (this.get('sortby') === 'MANAGER') {
      sortBy = 'manager';
    }
    else if (this.get('sortby') === 'NAME') {
      sortBy = 'name';
    }

    if (sortBy !== '') {
      filter = filter.sortBy(sortBy);
    }
    //reverse sort
    if (this.get('reverse')) {
      filter.reverse();
    }

    // Filter by Manager
    if (this.get('mgrFilter') !== 'ALL') {
      filter = filter.filterBy('manager', this.get('mgrFilter'));
    }

    let self = this;
    // Filter by Date
    filter = filter.filter(function (item, index, enumerable) {
      let date = 10000 * self.get('year') + 100 * self.get('month') + self.get('day');
      //console.log(date+' '+item.get('startVal'));
      return (date > item.get('startVal'));
    });

    //count employees
    let count = 0;
    let esgCount = 0;
    let otherCount = 0;
    filter.forEach(function (item) {
      count++;
      if (item.get('company') === 'ESG') {
        esgCount++;
      }
      else {
        otherCount++;
      }
    });
    this.set('empCount', count);
    this.set('empEsgCount', esgCount);
    this.set('empOtherCount', otherCount);

    //Done sorting
    return filter;
  }),
  filteredExEmp: Ember.computed('year', 'month', 'reverse', 'refresh', function () {
    let filter = this.get('model.ex_emp');
    let sortBy = '';

    // Sort Data

    if (this.get('sortby') === 'MANAGER') {
      sortBy = 'manager';
    }
    else if (this.get('sortby') === 'NAME') {
      sortBy = 'name';
    }

    if (sortBy !== '') {
      filter = filter.sortBy(sortBy);
    }
    //reverse sort
    if (this.get('reverse')) {
      filter.reverse();
    }

    // Filter by Manager
    if (this.get('mgrFilter') !== 'ALL') {
      filter = filter.filterBy('manager', this.get('mgrFilter'));
    }

    let self = this;
    // Filter by Date
    filter = filter.filter(function (item, index, enumerable) {
      let date = 10000 * self.get('year') + 100 * self.get('month') + self.get('day');
      //console.log(date+' '+item.get('startVal'));
      return (date >= item.get('startDateVal') && date <= item.get('termDateVal'));
    });

    //count employees
    let count = 0;
    let esgCount = 0;
    let otherCount = 0;
    filter.forEach(function (item) {
      count++;
      if (item.get('company') === 'ESG') {
        esgCount++;
      }
      else {
        otherCount++;
      }
    });
    this.set('exEsgCount', esgCount);
    this.set('exOtherCount', otherCount);
    this.set('exEmpCount', count);

    //Done sorting
    return filter;
  }),
  totalCount: Ember.computed('empCount', 'exEmpCount', function () {
    return this.get('empCount')+this.get('exEmpCount');
  }),
  totalEsgCount: Ember.computed('empEsgCount', 'exEsgCount', function () {
    return this.get('empEsgCount')+this.get('exEsgCount');
  }),
  totalOtherCount: Ember.computed('empOtherCount', 'exOtherCount', function () {
    return this.get('empOtherCount')+this.get('exOtherCount');
  }),
  countByWeek: Ember.computed('year', 'month', 'refresh', function () {
    let emp = this.get('model.emp');
    let ex = this.get('model.ex_emp');
    let self = this;
    let str = '';
    let strCSV = '';

    let dy = [27, 19, 11, 3];
    let mth = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    let yr = [2018, 2017, 2016, 2015, 2014];
    str = 'year,month,day,tot,esg,other<br>';
    strCSV = 'year,month,day,tot,esg,other\n';
    yr.forEach(function (year) {
      mth.forEach(function (month) {
        dy.forEach(function (day) {
          let total = 0;
          let esgTot = 0;
          let otherTot = 0;
          emp.forEach(function (item) {
            let date = 10000 * year + 100 * month + day;
            if (date >= item.get('startVal')) {
              total++;
              if (item.get('company') === 'ESG') {
                esgTot++;
              }
              else {
                otherTot++;
              }
            }
          });
          ex.forEach(function (item) {
            let date = 10000 * year + 100 * month + day;
            if ((date >= item.get('startDateVal')) && (date <= item.get('termDateVal'))) {
              total++;
              if (item.get('company') === 'ESG') {
                esgTot++;
              }
              else {
                otherTot++;
              }
            }
          });
          //str = str + "Year: " + year + "  Month: " + month + '  Total:' + total + '  ESG total: ' + esgTot +
          //  'Other Total: ' + otherTot + '<br>';
          str = str + month + "/" + day + '/' + year + ', ' + total + ', ' + esgTot + ', ' + otherTot + '<br>';
          strCSV = strCSV + month + "/" + day + '/' + year + ', ' + total + ', ' + esgTot + ', ' + otherTot + '\r\n';
        });
      });
    });

    return str;
  }),

  empList: Ember.computed('year', 'month', 'refresh', function () {
    let emp = this.get('model.emp');
    let ex = this.get('model.ex_emp');
    let self=this;
    let list = [];
    emp.forEach(function (item) {
      let date = 10000 * self.get('year') + 100 * self.get('month') + self.get('day');
      if (date >= item.get('startVal')) {
        list.push({
          firstname: item.get('firstname'),
          lastname: item.get('lastname'),
          type: 'EMP',
          start: item.get('start'),
          tenure: getTenure(item.get('start'),self.get('year'),self.get('month')),
          immigration: item.get('immigration'),
          country: item.get('country'),
          gender: item.get('gender'),
          degree: getDegree(item.get('degree')),
          degreeTxt: getDegree(item.get('degree'))+' ['+item.get('degree')+']',
          experience: self.get('year')-item.get('experience')
        });
      }
    });
    ex.forEach(function (item) {
      let date = 10000 * self.get('year') + 100 * self.get('month') + self.get('day');
      //console.log(date+' '+item.get('startVal'));
      if (date >= item.get('startDateVal') && date <= item.get('termDateVal')) {
        list.push({
          firstname: item.get('firstname'),
          lastname: item.get('lastname'),
          type: 'TERM',
          start: item.get('startDate'),
          tenure:getTenure(item.get('startDate'),self.get('year'),self.get('month')),
          immigration: item.get('immigration'),
          country: item.get('country'),
          gender: item.get('gender'),
          degree: getDegree(item.get('degree')),
          degreeTxt: getDegree(item.get('degree'))+' ['+item.get('degree')+']',
          experience: self.get('year')-item.get('experience')
        });
      }
    });

    // Compute Stats
    let imm = {};
    let country = {};
    let degree = {};
    let gender = {};
    let tenure = {};
    let experience = {};
    list.forEach(function (emp){
      add_item(imm,emp.immigration);
      add_item(country,emp.country);
      add_item(degree,emp.degree);
      add_item(gender,emp.gender);
      add_item(tenure,emp.tenure);
      add_item(experience,emp.experience);
    });
    //Sort Results
    this.set('immData',sorted(imm));
    this.set('degreeData',sorted(degree));
    this.set('countryData',sorted(country));
    this.set('genderData',sorted(gender));
    this.set('tenureData',avg(tenure));
    this.set('experienceData',avg(experience));

    return list;
  }),
  empListCount: Ember.computed('year', 'month', 'refresh', function () {
    return this.get('empList').length;
  }),
  actions: {
    export(){
      let fileContents=JSON.stringify('text');
      let mimeType='application/json';
      let filename='test.txt';
      window.saveAs(new Blob([fileContents], {type: mimeType}), filename);
    },
    rev() {
      this.toggleProperty('reverse');
    },
    refresh(){
      this.toggleProperty('refresh');
    },
    scrollTo(tag){
      $(window).scrollTop(tag);
    },
    setView(viewType){
      this.set('viewType',viewType);
    },
    test(){
      //window.open('https://newton.newtonsoftware.com/candidate/8a7886f856fdfca601570c227c9f6f34');
      this.toggleProperty('showEdit');
    },
  },
});

function getDegree(deg) {
  let result = 'Other';
  if (deg === 'MSEE') result = 'MS';
  else if (deg==='MSCE') result='MS';
  else if (deg==='MSME') result='MS';
  else if (deg==='MS Auto') result='MS';
  else if (deg==='BSEE') result='BS';
  else if (deg==='BSCE') result='BS';
  else if (deg==='BSME') result='BS';
  else if (deg==='BS Auto') result='BS';
  else if (deg==='PHD') result='PHD';
  return result;
}

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

  let count=0;
  sorted.forEach(function (item) {
    count=count+parseInt(item.val);
  });
  if (count>0) {
    sorted.forEach(function (item) {
      let val=item.val;
      let percent=(val*100)/count;
      percent=percent.toFixed(1);
      str = str + item.name + ':' + item.val + ' ['+percent+'%], ';
    });
  }

  return str;
}

function avg(assoc) {
  let str='';
  let arr = []; // Array

  // Save in Array
  Object.keys(assoc).forEach(function (item) {
    arr.push({name:item, val:assoc[item]})
  });

  let count=0;
  let total=0;
  arr.forEach(function (item) {
    count=count+parseInt(item.val);
    total=total+parseFloat(item.name)*parseInt(item.val);
  });
  if (count > 0) {
    let avg = total / count;
    avg = avg.toFixed(1);
    str = str + 'Average: ' + avg;
  }

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

function getTenure(start,year,month){
  let startYear=parseInt(start.substr(0,4));
  let startMonth=parseInt(start.substr(5,2));
  let months=12*(parseInt(year)-startYear)+parseInt(month)-startMonth;
  let result=months/12;
  return result.toFixed(1);
}
