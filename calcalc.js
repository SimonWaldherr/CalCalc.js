/* * * * * * * * *
 *  CalCalc .js  *
 * Version  0.05 *
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
      event = document.createEvent('Event'),
      returnvalue = false,
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
  
  this.setAttribute('data-newdate', date);
  event.initEvent('calcalc',false,false);
  event.target = this;
  this.dispatchEvent(event);
  return date;
};

Object.prototype.prependDay = function (quantity) {
  "use strict";
  var firstday   = (this.firstChild.hasAttribute('data-datestr')) ? this.firstChild.getAttribute('data-datestr').split('.') : this.firstChild.nextElementSibling.getAttribute('data-datestr').split('.'),
      i         = 0,
      event = document.createEvent('Event'),
      returnvalue = false,
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
  
  this.setAttribute('data-newdate', date);
  event.initEvent('calcalc',false,false);
  event.target = this;
  this.dispatchEvent(event);
  return date;
};

var reloadOnScroll = function (ele) {
  "use strict";
  var yPos = (document.documentElement) ? Math.max(document.body.scrollTop, document.documentElement.scrollTop) : document.body.scrollTop,
      height = (document.documentElement) ? Math.max(document.body.clientHeight, document.documentElement.clientHeight) : document.body.clientHeight,
      oldHeight, date = false;
  if(document.body.getAttribute('data-scrolling') === 'true') {
    return false;
  }
  if(yPos < window.innerHeight/2) {
    oldHeight = height;
    date = ele.prependDay(28);
    height = (document.documentElement) ? Math.max(document.body.clientHeight, document.documentElement.clientHeight) : document.body.clientHeight;
    window.scrollBy(0, height - oldHeight);
    return date;
  }
  if(yPos > height - window.innerHeight - window.innerHeight/2) {
    date = ele.appendDay(28);
    return date;
  }
  return false;
};

Object.prototype.calcalcinit = function () {
  "use strict";
  var ele = this;
  window.onscroll = function () {
    var event = document.createEvent('Event'),
    returnvalue = false;
    
    returnvalue = reloadOnScroll(ele);
    
    if(returnvalue !== false) {
      ele.setAttribute('data-newdate', returnvalue);
      event.initEvent('calcalc',false,false);
      event.target = ele;
      ele.dispatchEvent(event);
    }
  };
};

var curve = function (x) {
  "use strict";
  return (x < 0.5) ? (4*x*x*x) : (1 - 4*(1-x)*(1-x)*(1-x));
};

var scrollAnimation = function (targetY, startY, startTime, speed) {
  "use strict";
  var percent = (new Date() - startTime) / 1000*speed;
  if(percent > 1) {
    window.scrollTo(0, targetY);
  } else {
    window.scrollTo(0, Math.round(startY + (targetY - startY) * curve(percent)));
    setTimeout(scrollAnimation, 10, targetY, startY, startTime, speed);
  }
};

var scrollToDay = function (element) {
  "use strict";
  var clientHeight = element.clientHeight,
      y = element.offsetTop,
      targetY, startY, startTime, startDist;
  document.body.setAttribute('data-scrolling', 'true');
  while(element.offsetParent && element.offsetParent !== document.body) {
    element = element.offsetParent;
    y += element.offsetTop;
  }
  targetY = y - (window.innerHeight - clientHeight) / 2; 
  startY = (document.documentElement) ? Math.max(document.body.scrollTop, document.documentElement.scrollTop) : document.body.scrollTop;
  startTime = new Date();
  if(targetY !== startY) {
    startDist = Math.max(targetY, startY)-Math.min(targetY, startY);
    if(startDist > 512) {
      setTimeout(scrollAnimation, 10, targetY, startY, startTime, 2);
    } else if(startDist > 256) {
      setTimeout(scrollAnimation, 6, targetY, startY, startTime, 6);
    } else if(startDist > 64) {
      setTimeout(scrollAnimation, 4, targetY, startY, startTime, 12);
    }
    setTimeout("document.body.setAttribute('data-scrolling', 'false');", 1000);
  }
};
