/* * * * * * * * *
 *  CalCalc .js  *
 * Version  0.01 *
 * License:  MIT *
 * SimonWaldherr *
 * * * * * * * * */

Object.prototype.TStoDate = function () {
  var timestamp = parseInt(this.valueOf(),10),
      date      = new Date(timestamp);
  return [date.getDate(), date.getMonth()+1, date.getFullYear()];
}

Object.prototype.getWeekNumber = function () {
  var date = new Date(parseInt(this.valueOf(),10)),
      yearStart, weekNumber;
      date.setHours(0,0,0);
      date.setDate(date.getDate() + 4 - (date.getDay()||7));
      yearStart = new Date(date.getFullYear(),0,1);
      weekNumber = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);
  return weekNumber;
}

Element.prototype.insertToday = function () {
  var date     = new Date(),
      datestr  = date.getFullYear()+'.'+date.getMonth()+'.'+date.getDate(),
      oddweek  = date.getTime().getWeekNumber()%2,
      oddmonth = date.getMonth()%2;
      
  this.innerHTML = '<div data-datestr="'+datestr+'" class="calcalcday today day'+date.getDay()+' oddweek'+oddweek+' oddmonth'+oddmonth+'" id="'+date.getDate()+'_'+date.getMonth()+'_'+date.getFullYear()+'"><span>'+date.getDate()+'</span></div>';
}

Element.prototype.insertThisWeek = function () {
  var date     = new Date(),
      datestr  = date.getFullYear()+'.'+date.getMonth()+'.'+date.getDate(),
      oddweek  = date.getTime().getWeekNumber()%2,
      oddmonth = date.getMonth()%2;
  this.insertToday();
  this.prependDay(date.getDay());
  this.appendDay(6-date.getDay());
}

Element.prototype.appendDay = function (quantity) {
  console.log(quantity);
  var container = this,
      lastchild = this.lastChild,
      lastday   = this.lastChild.getAttribute('data-datestr').split('.'),
      date      = new Date(lastday[0],lastday[1],lastday[2]),
      datestr   = date.getFullYear()+'.'+date.getMonth()+'.'+date.getDate(),
      oddweek   = date.getTime().getWeekNumber()%2,
      oddmonth  = date.getMonth()%2,
      newdiv    = document.createElement('div'),
      quantity  = (quantity === parseInt(quantity, 10)) ? quantity : 1,
      i         = 0;
  for(i = 0; i < quantity; i++) {
    date      = new Date(parseInt(lastday[0],10),parseInt(lastday[1],10),parseInt(lastday[2],10));
    date.setDate(parseInt(lastday[2],10)+(i+1));
    datestr   = date.getFullYear()+'.'+date.getMonth()+'.'+date.getDate();
    oddweek   = date.getTime().getWeekNumber()%2;
    oddmonth  = date.getMonth()%2;
    newdiv = document.createElement('div')
    newdiv.setAttribute('data-datestr', datestr);
    newdiv.className = 'calcalcday day'+date.getDay()+' oddweek'+oddweek+' oddmonth'+oddmonth;
    newdiv.id = date.getDate()+'_'+date.getMonth()+'_'+date.getFullYear();
    newdiv.innerHTML = '<span>'+date.getDate()+'</span>';
    this.appendChild(newdiv);
  }
}

Element.prototype.prependDay = function (quantity) {
  console.log(quantity);
  var container = this,
      lastchild = this.firstChild,
      lastday   = this.firstChild.getAttribute('data-datestr').split('.'),
      date      = new Date(lastday[0],lastday[1],lastday[2]),
      datestr   = date.getFullYear()+'.'+date.getMonth()+'.'+date.getDate(),
      oddweek   = date.getTime().getWeekNumber()%2,
      oddmonth  = date.getMonth()%2,
      newdiv    = document.createElement('div'),
      quantity  = (quantity === parseInt(quantity, 10)) ? quantity : 1,
      i         = 0;
  for(i = 0; i < quantity; i++) {
    date      = new Date(parseInt(lastday[0],10),parseInt(lastday[1],10),parseInt(lastday[2],10));
    date.setDate(parseInt(lastday[2],10)-(i+1));
    datestr   = date.getFullYear()+'.'+date.getMonth()+'.'+date.getDate();
    oddweek   = date.getTime().getWeekNumber()%2;
    oddmonth  = date.getMonth()%2;
    newdiv = document.createElement('div')
    newdiv.setAttribute('data-datestr', datestr);
    newdiv.className = 'calcalcday day'+date.getDay()+' oddweek'+oddweek+' oddmonth'+oddmonth;
    newdiv.id = date.getDate()+'_'+date.getMonth()+'_'+date.getFullYear();
    newdiv.innerHTML = '<span>'+date.getDate()+'</span>';
    this.insertBefore(newdiv,this.firstChild);
  }
}
