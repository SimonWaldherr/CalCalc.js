/* * * * * * * * *
 *  CalCalc .js  *
 * Version  0.03 *
 * License:  MIT *
 * SimonWaldherr *
 * * * * * * * * */

Object.prototype.TStoDate = function () {
  "use strict";
  var timestamp = parseInt(this.valueOf(),10),
      date      = new Date(timestamp);
  return [date.getDate(), date.getMonth()+1, date.getFullYear()];
};

Object.prototype.getWeekNumber = function () {
  "use strict";
  var date = new Date(parseInt(this.valueOf(),10)),
      yearStart, weekNumber;
      date.setHours(0,0,0);
      date.setDate(date.getDate() + 4 - (date.getDay()||7));
      yearStart = new Date(date.getFullYear(),0,1);
      weekNumber = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);
  return weekNumber;
};

Object.prototype.insertToday = function () {
  "use strict";
  var date     = new Date(),
      datestr  = date.getFullYear()+'.'+date.getMonth()+'.'+date.getDate(),
      oddweek  = date.getTime().getWeekNumber()%2,
      oddmonth = date.getMonth()%2;
  this.innerHTML = '<div data-datestr="'+datestr+'" class="calcalcday today day'+date.getDay()+' oddweek'+oddweek+' oddmonth'+oddmonth+'" id="'+date.getDate()+'_'+date.getMonth()+'_'+date.getFullYear()+'"><span>'+date.getDate()+'</span></div>';
};

Object.prototype.insertThisWeek = function () {
  "use strict";
  var date     = new Date();
  this.insertToday();
  this.prependDay(date.getDay());
  this.appendDay(6-date.getDay());
};

Object.prototype.appendDay = function (quantity) {
  "use strict";
  var lastday   = (this.lastChild.hasAttribute('data-datestr')) ? this.lastChild.getAttribute('data-datestr').split('.') : this.lastChild.previousElementSibling.getAttribute('data-datestr').split('.'),
      i         = 0,
      date, datestr, oddweek, oddmonth, newdiv, linebreak;
  quantity = (quantity === parseInt(quantity, 10)) ? quantity : 1;
  for(i = 0; i < quantity; i += 1) {
    date      = new Date(parseInt(lastday[0],10),parseInt(lastday[1],10),parseInt(lastday[2],10));
    date.setDate(parseInt(lastday[2],10)+(i+1));
    datestr   = date.getFullYear()+'.'+date.getMonth()+'.'+date.getDate();
    oddweek   = date.getTime().getWeekNumber()%2;
    oddmonth  = date.getMonth()%2;
    newdiv = document.createElement('div');
    newdiv.setAttribute('data-datestr', datestr);
    newdiv.className = 'calcalcday day'+date.getDay()+' oddweek'+oddweek+' oddmonth'+oddmonth;
    newdiv.id = date.getDate()+'_'+date.getMonth()+'_'+date.getFullYear();
    newdiv.innerHTML = '<span>'+date.getDate()+'</span>';
    if(date.getDay() === 0) {
      linebreak = document.createElement('div');
      linebreak.className = 'linebreak';
      this.appendChild(linebreak);
    }
    this.appendChild(newdiv);
  }
};

Object.prototype.prependDay = function (quantity) {
  "use strict";
  var firstday   = (this.firstChild.hasAttribute('data-datestr')) ? this.firstChild.getAttribute('data-datestr').split('.') : this.firstChild.nextElementSibling.getAttribute('data-datestr').split('.'),
      i         = 0,
      date, datestr, oddweek, oddmonth, newdiv, linebreak;
  quantity = (quantity === parseInt(quantity, 10)) ? quantity : 1;
  for(i = 0; i < quantity; i += 1) {
    date      = new Date(parseInt(firstday[0],10),parseInt(firstday[1],10),parseInt(firstday[2],10));
    date.setDate(parseInt(firstday[2],10)-(i+1));
    datestr   = date.getFullYear()+'.'+date.getMonth()+'.'+date.getDate();
    oddweek   = date.getTime().getWeekNumber()%2;
    oddmonth  = date.getMonth()%2;
    newdiv = document.createElement('div');
    newdiv.setAttribute('data-datestr', datestr);
    newdiv.className = 'calcalcday day'+date.getDay()+' oddweek'+oddweek+' oddmonth'+oddmonth;
    newdiv.id = date.getDate()+'_'+date.getMonth()+'_'+date.getFullYear();
    newdiv.innerHTML = '<span>'+date.getDate()+'</span>';
    this.insertBefore(newdiv,this.firstChild);
    if(date.getDay() === 0) {
      linebreak = document.createElement('div');
      linebreak.className = 'linebreak';
      this.insertBefore(linebreak,this.firstChild);
    }
  }
};

var curve = function (x) {
  "use strict";
  return (x < 0.5) ? (4*x*x*x) : (1 - 4*(1-x)*(1-x)*(1-x));
};

var scrollAnimation = function (targetY, startY, startTime) {
  "use strict";
  var percent = (new Date() - startTime) / 1000;
  if(percent > 1) {
    window.scrollTo(0, targetY);
  } else {
    window.scrollTo(0, Math.round(startY + (targetY - startY) * curve(percent)));
    setTimeout(scrollAnimation, 10, targetY, startY, startTime);
  }
};

var scrollToDay = function (element) {
  "use strict";
  var clientHeight = element.clientHeight,
      y = element.offsetTop,
      targetY, startY, startTime;
  while(element.offsetParent && element.offsetParent !== document.body) {
    element = element.offsetParent;
    y += element.offsetTop;
  }
  targetY = y - (window.innerHeight - clientHeight) / 2; 
  startY = (document.documentElement) ? Math.max(document.body.scrollTop, document.documentElement.scrollTop) : document.body.scrollTop;
  startTime = new Date();
  if(targetY !== startY) {
    setTimeout(scrollAnimation, 10, targetY, startY, startTime);
  }
};
