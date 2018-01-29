export {clipText,getToday,getTodaySortable,properCase,sendEmail,sendRecruitingEmail,setDlgEdit,setDlgDropdown,truncLink,truncText};

function clipText(text, count) {
  let str = text.toString();
  str=str.replace('  ',' ');

  let len = str.length;
  let truncLen = parseInt(count);
  let result = str.slice(0,truncLen);

  return result;
}

function sendEmail(to, subject, body){
  let email={to: to,subject:subject,body:body};
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'POST',
      url: 'https://hooks.zapier.com/hooks/catch/2085985/5ay4va/',
      //contentType: 'application/json',
      //contentType: 'multipart/form-data',
      //dataType: 'text',
      data: JSON.stringify(email),
      processData: false,
      statusCode: {
        200: () => Em.run(null, resolve),
        500: () => Em.run(null, reject)
      }
    });
  });
}

function sendRecruitingEmail(to, subject, body) {
  let email = {to: to, subject: subject, body: body};
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'POST',
      url: 'https://hooks.zapier.com/hooks/catch/2085985/5pcv4w/',
      data: JSON.stringify(email),
      processData: false,
      statusCode: {
        200: () => Em.run(null, resolve),
        500: () => Em.run(null, reject)
      }
    });
  });
}

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

function getTodaySortable() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {dd = '0' + dd;}
  if (mm < 10) {mm = '0' + mm;}

  today = yyyy + '_' + mm +'_' + dd;
  return today;
}

function properCase(str){
  // 1. lower case the whole string
  str = str.toLowerCase();

  // 2.Split the string into an array of strings
  str = str.split(' ');

  // 3. Upper Case the pieces
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }

  // 4. Join and Return
  return str.join(' ');
}

function setDlgEdit(self,title){
  self.set('title', title);
  self.set('showDlg', 'EDIT');
}

function setDlgDropdown(self,title,list){
  self.set('title', title);
  self.set('dlgDropdown', self.get(list));
  self.set('showDlg', 'DROPDOWN');
}

function truncText(text, count) {
  let str = text.toString();
  str=str.replace('  ',' ');

  let len = str.length;
  let truncLen = parseInt(count);
  let result='';

  if (truncLen<=len) {
    result = str.slice(0,truncLen);
  }
  else {
    result = str+String.fromCharCode(160).repeat(truncLen-len);
  }
  return result;
}

function truncLink(text, url, count) {
  let str = text.toString();
  str=str.replace('  ',' ');
  let space='';

  let len = str.length;
  let truncLen = parseInt(count);

  if (truncLen<=len) {
    str = str.slice(0,truncLen);
  }
  else {
    space=String.fromCharCode(160).repeat(truncLen-len);
  }

  let result = '<a target="_blank" href="'+url+'">'+str+'</a>'+space;
  return result;
}
