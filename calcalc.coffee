# * * * * * * * * *
# *  CalCalc .js  *
# * Version  0.08 *
# * License:  MIT *
# * SimonWaldherr *
# * * * * * * * * *

calcalc =
  curve: (x) ->
    "use strict"
    (if (x < 0.5) then (4 * x * x * x) else (1 - 4 * (1 - x) * (1 - x) * (1 - x)))

  scrollAnimation: (element, targetY, startY, startTime, speed) ->
    "use strict"
    percent = (new Date() - startTime) / 1000 * speed
    if percent > 1
      element.scrollTop = targetY
    else
      element.scrollTop = Math.round(startY + (targetY - startY) * calcalc.curve(percent))
      setTimeout calcalc.scrollAnimation, 10, element, targetY, startY, startTime, speed
    return

  scrollToDay: (element, preventNewDays) ->
    "use strict"
    clientHeight = element.clientHeight
    y = element.offsetTop
    targetY = undefined
    startY = undefined
    startTime = undefined
    startDist = undefined
    document.body.setAttribute "data-scrolling", "true"  unless preventNewDays
    while element.offsetParent and element.offsetParent isnt document.body
      element = element.offsetParent
      y += element.offsetTop
    targetY = y - (window.innerHeight - clientHeight) / 2
    startY = element.scrollTop
    startTime = new Date()
    if targetY isnt startY
      startDist = Math.max(targetY, startY) - Math.min(targetY, startY)
      if startDist > 512
        setTimeout calcalc.scrollAnimation, 10, element, targetY, startY, startTime, 2
      else if startDist > 256
        setTimeout calcalc.scrollAnimation, 6, element, targetY, startY, startTime, 6
      else setTimeout calcalc.scrollAnimation, 4, element, targetY, startY, startTime, 12  if startDist > 64
      setTimeout calcalc.setAttr, 1000, "data-scrolling", "false"
    return

  getWeekNumber: (int) ->
    "use strict"
    date = new Date(parseInt(int, 10))
    yearStart = undefined
    weekNumber = undefined
    date.setHours 0, 0, 0
    date.setDate date.getDate() + 4 - (date.getDay() or 7)
    yearStart = new Date(date.getFullYear(), 0, 1)
    weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
    [
      weekNumber
      date.getFullYear()
    ]

  setAttr: (attr, val) ->
    "use strict"
    document.body.setAttribute attr, val
    return

  target: null

Object::TStoDate = ->
  "use strict"
  timestamp = parseInt(@valueOf(), 10)
  date = new Date(timestamp)
  [
    date.getDate()
    date.getMonth() + 1
    date.getFullYear()
  ]

Object::getWeekNumber = (int) ->
  "use strict"
  date = new Date(parseInt((if (int isnt "") then int else @valueOf()), 10))
  yearStart = undefined
  weekNumber = undefined
  date.setHours 0, 0, 0
  date.setDate date.getDate() + 4 - (date.getDay() or 7)
  yearStart = new Date(date.getFullYear(), 0, 1)
  weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
  [
    weekNumber
    date.getFullYear()
  ]

Object::insertToday = ->
  "use strict"
  event = document.createEvent("Event")
  date = undefined
  weeknumber = undefined
  weekcont = undefined
  datestr = undefined
  oddweek = undefined
  oddmonth = undefined
  newdiv = undefined
  date = new Date()
  datestr = date.getFullYear() + "." + date.getMonth() + "." + date.getDate()
  oddweek = date.getTime().getWeekNumber()[0] % 2
  oddmonth = date.getMonth() % 2
  newdiv = document.createElement("td")
  newdiv.setAttribute "data-datestr", datestr
  newdiv.className = "today calcalcday day" + date.getDay() + " oddweek" + oddweek + " oddmonth" + oddmonth
  newdiv.id = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear()
  newdiv.innerHTML = "<span>" + date.getDate() + "</span>"
  weeknumber = calcalc.getWeekNumber(date.getTime())
  if @getElementsByClassName("kw" + weeknumber[0] + "_" + weeknumber[1])[0] is `undefined`
    weekcont = document.createElement("tr")
    weekcont.className = "kw" + weeknumber[0] + "_" + weeknumber[1] + " weektr"
    @appendChild weekcont
  @getElementsByClassName("kw" + weeknumber[0] + "_" + weeknumber[1])[0].appendChild newdiv
  @setAttribute "data-newdate", date
  unless event
    event.initEvent "calcalc", false, false
    event.target = this
    @dispatchEvent event
  else
    event.initEvent "calcalc", false, false
    calcalc.target = event.srcElement or event.target
    calcalc.target = this
    @dispatchEvent event
  date

Object::insertThisWeek = ->
  "use strict"
  date = new Date()
  @insertToday()
  @prependDay date.getDay() - 1
  @appendDay 7 - date.getDay()
  return

Object::appendDay = (quantity) ->
  "use strict"
  lastday = (if (@lastChild.lastChild.hasAttribute("data-datestr")) then @lastChild.lastChild.getAttribute("data-datestr").split(".") else @lastChild.lastChild.previousElementSibling.getAttribute("data-datestr").split("."))
  i = 0
  event = document.createEvent("Event")
  date = undefined
  weeknumber = undefined
  weekcont = undefined
  datestr = undefined
  oddweek = undefined
  oddmonth = undefined
  newdiv = undefined
  quantity = (if (quantity is parseInt(quantity, 10)) then quantity else 1)
  i = 0
  while i < quantity
    date = new Date(parseInt(lastday[0], 10), parseInt(lastday[1], 10), parseInt(lastday[2], 10))
    date.setDate parseInt(lastday[2], 10) + (i + 1)
    datestr = date.getFullYear() + "." + date.getMonth() + "." + date.getDate()
    oddweek = date.getTime().getWeekNumber()[0] % 2
    oddmonth = date.getMonth() % 2
    newdiv = document.createElement("td")
    newdiv.setAttribute "data-datestr", datestr
    newdiv.className = "calcalcday day" + date.getDay() + " oddweek" + oddweek + " oddmonth" + oddmonth
    newdiv.id = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear()
    newdiv.innerHTML = "<span>" + date.getDate() + "</span>"
    weeknumber = calcalc.getWeekNumber(date.getTime())
    if @getElementsByClassName("kw" + weeknumber[0] + "_" + weeknumber[1])[0] is `undefined`
      weekcont = document.createElement("tr")
      weekcont.className = "kw" + weeknumber[0] + "_" + weeknumber[1] + " weektr"
      @appendChild weekcont
    @getElementsByClassName("kw" + weeknumber[0] + "_" + weeknumber[1])[0].appendChild newdiv
    i += 1
  @setAttribute "data-newdate", date
  unless event
    event.initEvent "calcalc", false, false
    event.target = this
    @dispatchEvent event
  else
    event.initEvent "calcalc", false, false
    calcalc.target = event.srcElement or event.target
    calcalc.target = this
    @dispatchEvent event
  date

Object::prependDay = (quantity) ->
  "use strict"
  firstday = (if (@firstChild.firstChild.hasAttribute("data-datestr")) then @firstChild.firstChild.getAttribute("data-datestr").split(".") else @firstChild.firstChild.nextElementSibling.getAttribute("data-datestr").split("."))
  i = 0
  event = document.createEvent("Event")
  date = undefined
  weeknumber = undefined
  weekcont = undefined
  weekelement = undefined
  datestr = undefined
  oddweek = undefined
  oddmonth = undefined
  newdiv = undefined
  quantity = (if (quantity is parseInt(quantity, 10)) then quantity else 1)
  i = 0
  while i < quantity
    date = new Date(parseInt(firstday[0], 10), parseInt(firstday[1], 10), parseInt(firstday[2], 10))
    date.setDate parseInt(firstday[2], 10) - (i + 1)
    datestr = date.getFullYear() + "." + date.getMonth() + "." + date.getDate()
    oddweek = date.getTime().getWeekNumber()[0] % 2
    oddmonth = date.getMonth() % 2
    newdiv = document.createElement("td")
    newdiv.setAttribute "data-datestr", datestr
    newdiv.className = "calcalcday day" + date.getDay() + " oddweek" + oddweek + " oddmonth" + oddmonth
    newdiv.id = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear()
    newdiv.innerHTML = "<span>" + date.getDate() + "</span>"
    weeknumber = calcalc.getWeekNumber(date.getTime())
    if @getElementsByClassName("kw" + weeknumber[0] + "_" + weeknumber[1])[0] is `undefined`
      weekcont = document.createElement("tr")
      weekcont.className = "kw" + weeknumber[0] + "_" + weeknumber[1] + " weektr"
      @insertBefore weekcont, @firstChild
    weekelement = @getElementsByClassName("kw" + weeknumber[0] + "_" + weeknumber[1])[0]
    weekelement.insertBefore newdiv, weekelement.firstChild
    i += 1
  @setAttribute "data-newdate", date
  unless event
    event.initEvent "calcalc", false, false
    event.target = this
    @dispatchEvent event
  else
    event.initEvent "calcalc", false, false
    calcalc.target = event.srcElement or event.target
    calcalc.target = this
    @dispatchEvent event
  date

reloadOnScroll = (ele) ->
  "use strict"
  yPos = ele.parentNode.scrollTop
  height = ele.clientHeight
  oldHeight = undefined
  date = false
  return false  if document.body.getAttribute("data-scrolling") is "true"
  if yPos < (ele.parentNode.clientHeight / 2)
    oldHeight = height
    date = ele.prependDay(42)
    height = ele.clientHeight
    ele.parentNode.scrollTop = (yPos + height - oldHeight)
    return date
  if yPos > height - ele.parentNode.clientHeight - (ele.parentNode.clientHeight / 2)
    date = ele.appendDay(42)
    return date
  false

Object::calcalcinit = ->
  "use strict"
  ele = this
  ele.parentNode.onscroll = ->
    event = document.createEvent("Event")
    returnvalue = false
    returnvalue = reloadOnScroll(ele)
    if returnvalue isnt false
      ele.setAttribute "data-newdate", returnvalue
      unless event
        event.initEvent "calcalc", false, false
        event.target = ele
        ele.dispatchEvent event
      else
        event.initEvent "calcalc", false, false
        calcalc.target = event.srcElement or event.target
        calcalc.target = ele
        ele.dispatchEvent event
    return

  return