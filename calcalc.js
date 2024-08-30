/* * * * * * * * *
 *  CalCalc.js   *
 * Version  0.10 *
 * License:  MIT *
 * SimonWaldherr *
 * * * * * * * * */

/*jslint browser: true, indent: 2 */
"use strict";

// Define the calcalc object with various methods
var calcalc = {
  // Function to compute a smooth scroll curve
  curve: function (x) {
    return (x < 0.5) ? (4 * x * x * x) : (1 - 4 * (1 - x) * (1 - x) * (1 - x));
  },

  // Function to animate scrolling to a target position
  scrollAnimation: function (element, targetY, startY, startTime, speed) {
    var percent = ((new Date()) - startTime) / 1000 * speed;

    if (percent > 1) {
      element.scrollTop = targetY;
    } else {
      element.scrollTop = Math.round(startY + (targetY - startY) * calcalc.curve(percent));
      setTimeout(function () {
        calcalc.scrollAnimation(element, targetY, startY, startTime, speed);
      }, 10);
    }
  },

  // Function to scroll to a specific day element
  scrollToDay: function (element, preventNewDays) {
    var clientHeight = element.clientHeight;
    var y = element.offsetTop;
    var targetY, startY, startTime, startDist;

    if (!preventNewDays) {
      document.body.setAttribute('data-scrolling', 'true');
    }

    // Calculate the total vertical offset of the element
    while (element.offsetParent && element.offsetParent !== document.body) {
      element = element.offsetParent;
      y += element.offsetTop;
    }

    // Center the target element in the viewport
    targetY = y - (window.innerHeight - clientHeight) / 2;
    startY = element.scrollTop;
    startTime = new Date();

    if (targetY !== startY) {
      startDist = Math.abs(targetY - startY);
      var speed = startDist > 512 ? 2 : startDist > 256 ? 6 : 12;
      setTimeout(function () {
        calcalc.scrollAnimation(element, targetY, startY, startTime, speed);
      }, 10);

      // Set the scrolling attribute to false after a delay
      setTimeout(function () {
        calcalc.setAttr('data-scrolling', 'false');
      }, 1000);
    }
  },

  // Function to get the week number and year from a timestamp
  getWeekNumber: function (int) {
    var date = new Date(parseInt(int, 10));
    date.setHours(0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    var yearStart = new Date(date.getFullYear(), 0, 1);
    var weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return [weekNumber, date.getFullYear()];
  },

  // Function to set an attribute on the document body
  setAttr: function (attr, val) {
    document.body.setAttribute(attr, val);
  },

  // Placeholder for target element
  target: null
};

// Add date handling methods to Object prototype
Object.prototype.TStoDate = function () {
  var timestamp = parseInt(this.valueOf(), 10);
  var date = new Date(timestamp);
  return [date.getDate(), date.getMonth() + 1, date.getFullYear()];
};

Object.prototype.getWeekNumber = function (int) {
  var date = new Date(parseInt(int || this.valueOf(), 10));
  date.setHours(0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  var yearStart = new Date(date.getFullYear(), 0, 1);
  var weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return [weekNumber, date.getFullYear()];
};

Object.prototype.insertToday = function () {
  var event = new Event('calcalc');
  var date = new Date();
  var weekNumber = calcalc.getWeekNumber(date.getTime());
  var datestr = date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate();
  var oddweek = weekNumber[0] % 2;
  var oddmonth = date.getMonth() % 2;

  var newdiv = document.createElement('td');
  newdiv.setAttribute('data-datestr', datestr);
  newdiv.className = 'today calcalcday day' + date.getDay() + ' oddweek' + oddweek + ' oddmonth' + oddmonth;
  newdiv.id = date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear();
  newdiv.innerHTML = '<span>' + date.getDate() + '</span>';

  // Find or create the week container for the new day
  var weekCont = this.querySelector('.kw' + weekNumber[0] + '_' + weekNumber[1]);
  if (!weekCont) {
    weekCont = document.createElement('tr');
    weekCont.className = 'kw' + weekNumber[0] + '_' + weekNumber[1] + ' weektr';
    this.appendChild(weekCont);
  }
  weekCont.appendChild(newdiv);

  // Set the new date attribute
  this.setAttribute('data-newdate', date);

  // Dispatch a 'calcalc' event
  this.dispatchEvent(event);

  return date;
};

Object.prototype.insertThisWeek = function () {
  var date = new Date();
  this.insertToday();
  this.prependDay(date.getDay() - 1);
  this.appendDay(7 - date.getDay());
};

Object.prototype.appendDay = function (quantity) {
  quantity = quantity || 1;

  var lastday = this.lastChild.lastChild.hasAttribute('data-datestr') ?
    this.lastChild.lastChild.getAttribute('data-datestr').split('.') :
    this.lastChild.lastChild.previousElementSibling.getAttribute('data-datestr').split('.');

  var event = new Event('calcalc');

  for (var i = 0; i < quantity; i++) {
    var date = new Date(parseInt(lastday[0], 10), parseInt(lastday[1], 10), parseInt(lastday[2], 10));
    date.setDate(parseInt(lastday[2], 10) + (i + 1));

    var datestr = date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate();
    var weekNumber = calcalc.getWeekNumber(date.getTime());
    var oddweek = weekNumber[0] % 2;
    var oddmonth = date.getMonth() % 2;

    var newdiv = document.createElement('td');
    newdiv.setAttribute('data-datestr', datestr);
    newdiv.className = 'calcalcday day' + date.getDay() + ' oddweek' + oddweek + ' oddmonth' + oddmonth;
    newdiv.id = date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear();
    newdiv.innerHTML = '<span>' + date.getDate() + '</span>';

    var weekCont = this.querySelector('.kw' + weekNumber[0] + '_' + weekNumber[1]);
    if (!weekCont) {
      weekCont = document.createElement('tr');
      weekCont.className = 'kw' + weekNumber[0] + '_' + weekNumber[1] + ' weektr';
      this.appendChild(weekCont);
    }
    weekCont.appendChild(newdiv);
  }

  this.setAttribute('data-newdate', date);

  event.initEvent('calcalc', false, false); // Deprecated, but kept for compatibility
  this.dispatchEvent(event);

  return date;
};

Object.prototype.prependDay = function (quantity) {
  quantity = quantity || 1;

  var firstday = this.firstChild.firstChild.hasAttribute('data-datestr') ?
    this.firstChild.firstChild.getAttribute('data-datestr').split('.') :
    this.firstChild.firstChild.nextElementSibling.getAttribute('data-datestr').split('.');

  var event = new Event('calcalc');

  for (var i = 0; i < quantity; i++) {
    var date = new Date(parseInt(firstday[0], 10), parseInt(firstday[1], 10), parseInt(firstday[2], 10));
    date.setDate(parseInt(firstday[2], 10) - (i + 1));

    var datestr = date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate();
    var weekNumber = calcalc.getWeekNumber(date.getTime());
    var oddweek = weekNumber[0] % 2;
    var oddmonth = date.getMonth() % 2;

    var newdiv = document.createElement('td');
    newdiv.setAttribute('data-datestr', datestr);
    newdiv.className = 'calcalcday day' + date.getDay() + ' oddweek' + oddweek + ' oddmonth' + oddmonth;
    newdiv.id = date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear();
    newdiv.innerHTML = '<span>' + date.getDate() + '</span>';

    var weekCont = this.querySelector('.kw' + weekNumber[0] + '_' + weekNumber[1]);
    if (!weekCont) {
      weekCont = document.createElement('tr');
      weekCont.className = 'kw' + weekNumber[0] + '_' + weekNumber[1] + ' weektr';
      this.insertBefore(weekCont, this.firstChild);
    }
    weekCont.insertBefore(newdiv, weekCont.firstChild);
  }

  this.setAttribute('data-newdate', date);

  event.initEvent('calcalc', false, false); // Deprecated, but kept for compatibility
  this.dispatchEvent(event);

  return date;
};

// Function to handle content reloading on scroll
var reloadOnScroll = function (ele) {
  var yPos = ele.parentNode.scrollTop;
  var height = ele.clientHeight;
  var date = false;

  if (document.body.getAttribute('data-scrolling') === 'true') {
    return false;
  }

  // Check if we need to prepend days
  if (yPos < ele.parentNode.clientHeight / 2) {
    date = ele.prependDay(42);
    ele.parentNode.scrollTop = yPos + ele.clientHeight - height;
    return date;
  }

  // Check if we need to append days
  if (yPos > height - ele.parentNode.clientHeight - ele.parentNode.clientHeight / 2) {
    date = ele.appendDay(42);
    return date;
  }

  return false;
};

// Initialize scroll event for calendar
Object.prototype.calcalcinit = function () {
  var ele = this;

  ele.parentNode.onscroll = function () {
    var returnValue = reloadOnScroll(ele);

    if (returnValue !== false) {
      ele.setAttribute('data-newdate', returnValue);
      var event = new Event('calcalc');
      ele.dispatchEvent(event);
    }
  };
};
