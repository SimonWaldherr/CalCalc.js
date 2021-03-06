/* * * * * * * * *
 *  CalCalc .js  *
 * Version  0.08 *
 * License:  MIT *
 * SimonWaldherr *
 * * * * * * * * */
/*jslint browser: true, indent: 2 */
var calcalc = {
  curve: function (x) {
    "use strict";
    return (x < 0.5) ? (4 * x * x * x) : (1 - 4 * (1 - x) * (1 - x) * (1 - x));
  },
  scrollAnimation: function (element, targetY, startY, startTime, speed) {
    "use strict";
    var percent = (new Date() - startTime) / 1000 * speed;

    if (percent > 1) {
      element.scrollTop = targetY;
    } else {
      element.scrollTop = Math.round(startY + (targetY - startY) * calcalc.curve(percent));
      setTimeout(calcalc.scrollAnimation, 10, element, targetY, startY, startTime, speed);
    }
  },
  scrollToDay: function (element, preventNewDays) {
    "use strict";
    var clientHeight = element.clientHeight,
      y = element.offsetTop,
      targetY,
      startY,
      startTime,
      startDist;

    if (!preventNewDays) {
      document.body.setAttribute('data-scrolling', 'true');
    }
    while (element.offsetParent && element.offsetParent !== document.body) {
      element = element.offsetParent;
      y += element.offsetTop;
    }
    targetY = y - (window.innerHeight - clientHeight) / 2;
    startY = element.scrollTop;
    startTime = new Date();

    if (targetY !== startY) {
      startDist = Math.max(targetY, startY) - Math.min(targetY, startY);
      if (startDist > 512) {
        setTimeout(calcalc.scrollAnimation, 10, element, targetY, startY, startTime, 2);
      } else if (startDist > 256) {
        setTimeout(calcalc.scrollAnimation, 6, element, targetY, startY, startTime, 6);
      } else if (startDist > 64) {
        setTimeout(calcalc.scrollAnimation, 4, element, targetY, startY, startTime, 12);
      }
      setTimeout(calcalc.setAttr, 1000, 'data-scrolling', 'false');
    }
  },
  getWeekNumber: function (int) {
    "use strict";
    var date = new Date(parseInt(int, 10)),
      yearStart,
      weekNumber;

    date.setHours(0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    yearStart = new Date(date.getFullYear(), 0, 1);
    weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return [weekNumber, date.getFullYear()];
  },
  setAttr: function (attr, val) {
    "use strict";
    document.body.setAttribute(attr, val);
  },
  target: null
};

Object.prototype.TStoDate = function () {
  "use strict";
  var timestamp = parseInt(this.valueOf(), 10),
    date = new Date(timestamp);

  return [date.getDate(), date.getMonth() + 1, date.getFullYear()];
};

Object.prototype.getWeekNumber = function (int) {
  "use strict";
  var date = new Date(parseInt((int !== '') ? int : this.valueOf(), 10)),
    yearStart,
    weekNumber;

  date.setHours(0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  yearStart = new Date(date.getFullYear(), 0, 1);
  weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return [weekNumber, date.getFullYear()];
};

Object.prototype.insertToday = function () {
  "use strict";
  var event = document.createEvent('Event'),
    date,
    weeknumber,
    weekcont,
    datestr,
    oddweek,
    oddmonth,
    newdiv;

  date = new Date();
  datestr = date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate();
  oddweek = date.getTime().getWeekNumber()[0] % 2;
  oddmonth = date.getMonth() % 2;
  newdiv = document.createElement('td');
  newdiv.setAttribute('data-datestr', datestr);
  newdiv.className = 'today calcalcday day' + date.getDay() + ' oddweek' + oddweek + ' oddmonth' + oddmonth;
  newdiv.id = date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear();
  newdiv.innerHTML = '<span>' + date.getDate() + '</span>';
  weeknumber = calcalc.getWeekNumber(date.getTime());
  if (this.getElementsByClassName('kw' + weeknumber[0] + '_' + weeknumber[1])[0] === undefined) {
    weekcont = document.createElement('tr');
    weekcont.className = 'kw' + weeknumber[0] + '_' + weeknumber[1] + ' weektr';
    this.appendChild(weekcont);
  }
  this.getElementsByClassName('kw' + weeknumber[0] + '_' + weeknumber[1])[0].appendChild(newdiv);
  this.setAttribute('data-newdate', date);
  if (!event) {
    event.initEvent('calcalc', false, false);
    event.target = this;
    this.dispatchEvent(event);
  } else {
    event.initEvent('calcalc', false, false);
    calcalc.target = event.srcElement || event.target;
    calcalc.target = this;
    this.dispatchEvent(event);
  }
  return date;
};

Object.prototype.insertThisWeek = function () {
  "use strict";
  var date = new Date();

  this.insertToday();
  this.prependDay(date.getDay() - 1);
  this.appendDay(7 - date.getDay());
};

Object.prototype.appendDay = function (quantity) {
  "use strict";
  var lastday = (this.lastChild.lastChild.hasAttribute('data-datestr')) ? this.lastChild.lastChild.getAttribute('data-datestr').split('.') : this.lastChild.lastChild.previousElementSibling.getAttribute('data-datestr').split('.'),
    i = 0,
    event = document.createEvent('Event'),
    date,
    weeknumber,
    weekcont,
    datestr,
    oddweek,
    oddmonth,
    newdiv;

  quantity = (quantity === parseInt(quantity, 10)) ? quantity : 1;
  for (i = 0; i < quantity; i += 1) {
    date = new Date(parseInt(lastday[0], 10), parseInt(lastday[1], 10), parseInt(lastday[2], 10));
    date.setDate(parseInt(lastday[2], 10) + (i + 1));
    datestr = date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate();
    oddweek = date.getTime().getWeekNumber()[0] % 2;
    oddmonth = date.getMonth() % 2;
    newdiv = document.createElement('td');
    newdiv.setAttribute('data-datestr', datestr);
    newdiv.className = 'calcalcday day' + date.getDay() + ' oddweek' + oddweek + ' oddmonth' + oddmonth;
    newdiv.id = date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear();
    newdiv.innerHTML = '<span>' + date.getDate() + '</span>';
    weeknumber = calcalc.getWeekNumber(date.getTime());
    if (this.getElementsByClassName('kw' + weeknumber[0] + '_' + weeknumber[1])[0] === undefined) {
      weekcont = document.createElement('tr');
      weekcont.className = 'kw' + weeknumber[0] + '_' + weeknumber[1] + ' weektr';
      this.appendChild(weekcont);
    }
    this.getElementsByClassName('kw' + weeknumber[0] + '_' + weeknumber[1])[0].appendChild(newdiv);
  }
  this.setAttribute('data-newdate', date);
  if (!event) {
    event.initEvent('calcalc', false, false);
    event.target = this;
    this.dispatchEvent(event);
  } else {
    event.initEvent('calcalc', false, false);
    calcalc.target = event.srcElement || event.target;
    calcalc.target = this;
    this.dispatchEvent(event);
  }
  return date;
};

Object.prototype.prependDay = function (quantity) {
  "use strict";
  var firstday = (this.firstChild.firstChild.hasAttribute('data-datestr')) ? this.firstChild.firstChild.getAttribute('data-datestr').split('.') : this.firstChild.firstChild.nextElementSibling.getAttribute('data-datestr').split('.'),
    i = 0,
    event = document.createEvent('Event'),
    date,
    weeknumber,
    weekcont,
    weekelement,
    datestr,
    oddweek,
    oddmonth,
    newdiv;

  quantity = (quantity === parseInt(quantity, 10)) ? quantity : 1;
  for (i = 0; i < quantity; i += 1) {
    date = new Date(parseInt(firstday[0], 10), parseInt(firstday[1], 10), parseInt(firstday[2], 10));
    date.setDate(parseInt(firstday[2], 10) - (i + 1));
    datestr = date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate();
    oddweek = date.getTime().getWeekNumber()[0] % 2;
    oddmonth = date.getMonth() % 2;
    newdiv = document.createElement('td');
    newdiv.setAttribute('data-datestr', datestr);
    newdiv.className = 'calcalcday day' + date.getDay() + ' oddweek' + oddweek + ' oddmonth' + oddmonth;
    newdiv.id = date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear();
    newdiv.innerHTML = '<span>' + date.getDate() + '</span>';
    weeknumber = calcalc.getWeekNumber(date.getTime());
    if (this.getElementsByClassName('kw' + weeknumber[0] + '_' + weeknumber[1])[0] === undefined) {
      weekcont = document.createElement('tr');
      weekcont.className = 'kw' + weeknumber[0] + '_' + weeknumber[1] + ' weektr';
      this.insertBefore(weekcont, this.firstChild);
    }
    weekelement = this.getElementsByClassName('kw' + weeknumber[0] + '_' + weeknumber[1])[0];
    weekelement.insertBefore(newdiv, weekelement.firstChild);
  }
  this.setAttribute('data-newdate', date);
  if (!event) {
    event.initEvent('calcalc', false, false);
    event.target = this;
    this.dispatchEvent(event);
  } else {
    event.initEvent('calcalc', false, false);
    calcalc.target = event.srcElement || event.target;
    calcalc.target = this;
    this.dispatchEvent(event);
  }
  return date;
};

var reloadOnScroll = function (ele) {
  "use strict";
  var yPos = ele.parentNode.scrollTop,
    height = ele.clientHeight,
    oldHeight,
    date = false;

  if (document.body.getAttribute('data-scrolling') === 'true') {
    return false;
  }
  if (yPos < (ele.parentNode.clientHeight / 2)) {
    oldHeight = height;
    date = ele.prependDay(42);
    height = ele.clientHeight;
    ele.parentNode.scrollTop = (yPos + height - oldHeight);
    return date;
  }
  if (yPos > height - ele.parentNode.clientHeight - (ele.parentNode.clientHeight / 2)) {
    date = ele.appendDay(42);
    return date;
  }
  return false;
};

Object.prototype.calcalcinit = function () {
  "use strict";
  var ele = this;

  ele.parentNode.onscroll = function () {
    var event = document.createEvent('Event'),
      returnvalue = false;
    returnvalue = reloadOnScroll(ele);
    if (returnvalue !== false) {
      ele.setAttribute('data-newdate', returnvalue);
      if (!event) {
        event.initEvent('calcalc', false, false);
        event.target = ele;
        ele.dispatchEvent(event);
      } else {
        event.initEvent('calcalc', false, false);
        calcalc.target = event.srcElement || event.target;
        calcalc.target = ele;
        ele.dispatchEvent(event);
      }
    }
  };
};