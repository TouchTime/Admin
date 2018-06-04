const Request = (obj) => {
  const loginInfo = window.sessionStorage.getItem('loginInfo') ? JSON.parse(window.sessionStorage.getItem('loginInfo') || '') : '';
  const innerData = loginInfo ? JSON.parse(loginInfo.user) : '';
  $.ajax({
    url: ApiPrefix + obj.url,
    method: obj.method || 'GET',
    headers: {
      Authorization: loginInfo ? `Bearer ${innerData.token.access_token}` : ''
    },
    dataType: obj.dataType || 'json',
    data: obj.data || {}
  }).done((res) => {
    obj.done && obj.done(res);
  }).fail((err) => {
    if(err.status == 401){
      alert('登录已经过期，请重新登录');
      window.sessionStorage.removeItem('loginInfo');
      window.location.reload();
    }else{
      obj.fail && obj.fail(err);
    }
  });
}

const OrgRequest = (obj) => {
  const loginInfo = window.sessionStorage.getItem('loginInfo') ? JSON.parse(window.sessionStorage.getItem('loginInfo') || '') : '';
  const innerData = JSON.parse(loginInfo.user);
  $.ajax({
    url: ApiPrefix +'/platforms'+obj.url,
    method: obj.method || 'GET',
    headers: {
      Authorization: loginInfo ? `Bearer ${innerData.token.access_token}` : ''
    },
    dataType: obj.dataType || 'json',
    data: obj.data || {}
  }).done((res) => {
    obj.done && obj.done(res);
  }).fail((err) => {
    if(err.status == 401){
      alert('登录已经过期，请重新登录');
      window.sessionStorage.removeItem('loginInfo');
      window.location.reload();
    }else{
      obj.fail && obj.fail(err);
    }
  });
}

const TRequest = (obj) => {
  const loginInfo = window.sessionStorage.getItem('loginInfo') ? JSON.parse(window.sessionStorage.getItem('loginInfo') || '') : '';
  $.ajax({
    url: obj.url,
    method: obj.method || 'GET',
    headers: {
      Authorization: loginInfo ? `Bearer ${loginInfo.token.access_token}` : ''
    },
    dataType: obj.dataType || 'json',
    data: obj.data || {}
  }).done((res) => {
    obj.done && obj.done(res);
  }).fail((err) => {
    if(err.status == 401){
      alert('登录已经过期，请重新登录');
      window.sessionStorage.removeItem('loginInfo');
      window.location.reload();
    }else{
      obj.fail && obj.fail(err);
    }
  });
}

const wmdr = {
  pad(num){
    return num < 10 ? `0${num}` : num
  },
  dfd(cdate){
    let currDate = new Date(cdate);
    let weekday = currDate.getDay() || 7;
    // currDate.setDate(currDate.getDate());
    currDate.setDate(currDate.getDate() - weekday);
    let currYear  =  currDate.getFullYear();
    let currMonth = currDate.getMonth() + 1;
    // let currDay  = currDate.getDate()+1;
    let currDay  = currDate.getDate()-1;
    console.log(`${currYear}-${this.pad(currMonth)}-${this.pad(currDay)} 00:00:00`)
    return `${currYear}-${this.pad(currMonth)}-${this.pad(currDay)} 00:00:00`; 
  },
  dld(cdate){
    let currDate = new Date(cdate);
    let weekday = currDate.getDay() || 7;
    currDate.setDate(currDate.getDate());
    // currDate.setDate(currDate.getDate() - weekday);
    let currYear  =  currDate.getFullYear();
    let currMonth = currDate.getMonth() + 1;
    // let currDay  = currDate.getDate()+1;
    let currDay  = currDate.getDate();
    console.log(`${currYear}-${this.pad(currMonth)}-${this.pad(currDay)} 23:59:59`)
    return `${currYear}-${this.pad(currMonth)}-${this.pad(currDay)} 23:59:59`; 
  },
  wfd(cdate){
    let currDate = new Date(cdate);
    let weekday = currDate.getDay() || 7;
    currDate.setDate(currDate.getDate() - weekday);
    let currYear  =  currDate.getFullYear();
    let currMonth = currDate.getMonth() + 1;
    let currDay  = currDate.getDate()+1;
    console.log(`${currYear}-${this.pad(currMonth)}-${this.pad(currDay)} 00:00:00`)
    return `${currYear}-${this.pad(currMonth)}-${this.pad(currDay)} 00:00:00`; 
  },
  wld(cdate){
    let currDate = new Date(cdate);
    let currWeekIndex = currDate.getDay();
    currDate.setDate(currDate.getDate() + 6-currWeekIndex);
    let currYear  =  currDate.getFullYear();
    let currMonth = currDate.getMonth() + 1;
    let currDay  = currDate.getDate()+1;
    console.log(`${currYear}-${this.pad(currMonth)}-${this.pad(currDay)} 23:59:59`)
    return `${currYear}-${this.pad(currMonth)}-${this.pad(currDay)} 23:59:59`;
  },
  mfd(cdate){
    let currDate = new Date(cdate);
    let currYear  =  currDate.getFullYear();
    let currMonth = currDate.getMonth() + 1;
    let currDay  = currDate.getDate();
    return `${currYear}-${this.pad(currMonth)}-01 00:00:00`;
  },
  mld(cdate){
    let currDate = new Date(cdate);
    let currYear  =  currDate.getFullYear();
    let nextMonthFirstDay = new Date(currDate.getFullYear(), currDate.getMonth()+1, 1);
    nextMonthFirstDay.setDate(nextMonthFirstDay.getDate() - 1);
    currYear = nextMonthFirstDay.getFullYear();
    let currMonth = nextMonthFirstDay.getMonth() + 1;
    let currDay  = nextMonthFirstDay.getDate();
    return `${currYear}-${this.pad(currMonth)}-${this.pad(currDay)} 23:59:59`;
  },
  yfd(cdate){
    let currDate = new Date(cdate);
    let currYear  =  currDate.getFullYear();
    return `${currYear}-01-01 00:00:00`;
  },
  yld(cdate){
    let currDate = new Date(cdate);
    let nextYear = new Date(currDate.getFullYear()+1,0,0);
    let currYear  =  currDate.getFullYear();
    let currMonth = nextYear.getMonth() + 1;
    let currDay  = nextYear.getDate();
    return `${currYear}-${this.pad(currMonth)}-${this.pad(currDay)} 23:59:59`;
  }
};

export{
  Request,OrgRequest,wmdr,TRequest
}
