#### * * * * * * *
#  CalCalc.js   *
# Version  0.10 *
# License:  MIT *
# SimonWaldherr *
# * * * * * * * 
###

###jslint browser: true, indent: 2 ###

'use strict'
# Define the calcalc object with various methods
calcalc = 
  curve: (x) ->
    if x < 0.5 then 4 * x * x * x else 1 - (4 * (1 - x) * (1 - x) * (1 - x))
  scrollAnimation: (element, targetY, startY, startTime, speed) ->
    percent = (new Date - startTime) / 1000 * speed
    if percent > 1
      element.scrollTop = targetY
    else
      element.scrollTop = Math.round(startY + (targetY - startY) * calcalc.curve(percent))
      setTimeout (->
        calcalc.scrollAnimation element, targetY, startY, startTime, speed
        return
      ), 10
    return
  scrollToDay: (element, preventNewDays) ->
    clientHeight = element.clientHeight
    y = element.offsetTop
    targetY = undefined
    startY = undefined
    startTime = undefined
    startDist = undefined
    if !preventNewDays
      document.body.setAttribute 'data-scrolling', 'true'
    # Calculate the total vertical offset of the element
    while element.offsetParent and element.offsetParent != document.body
      element = element.offsetParent
      y += element.offsetTop
    # Center the target element in the viewport
    targetY = y - ((window.innerHeight - clientHeight) / 2)
    startY = element.scrollTop
    startTime = new Date
    if targetY != startY
      startDist = Math.abs(targetY - startY)
      speed = if startDist > 512 then 2 else if startDist > 256 then 6 else 12
      setTimeout (->
        calcalc.scrollAnimation element, targetY, startY, startTime, speed
        return
      ), 10
      # Set the scrolling attribute to false after a delay
      setTimeout (->
        calcalc.setAttr 'data-scrolling', 'false'
        return
      ), 1000
    return
  getWeekNumber: (int) ->
    date = new Date(parseInt(int, 10))
    date.setHours 0, 0, 0
    date.setDate date.getDate() + 4 - (date.getDay() or 7)
    yearStart = new Date(date.getFullYear(), 0, 1)
    weekNumber = Math.ceil(((date - yearStart) / 86400000 + 1) / 7)
    [
      weekNumber
      date.getFullYear()
    ]
  setAttr: (attr, val) ->
    document.body.setAttribute attr, val
    return
  target: null
# Add date handling methods to Object prototype

Object::TStoDate = ->
  timestamp = parseInt(@valueOf(), 10)
  date = new Date(timestamp)
  [
    date.getDate()
    date.getMonth() + 1
    date.getFullYear()
  ]

Object::getWeekNumber = (int) ->
  date = new Date(parseInt(int or @valueOf(), 10))
  date.setHours 0, 0, 0
  date.setDate date.getDate() + 4 - (date.getDay() or 7)
  yearStart = new Date(date.getFullYear(), 0, 1)
  weekNumber = Math.ceil(((date - yearStart) / 86400000 + 1) / 7)
  [
    weekNumber
    date.getFullYear()
  ]

Object::insertToday = ->
  event = new Event('calcalc')
  date = new Date
  weekNumber = calcalc.getWeekNumber(date.getTime())
  datestr = date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate()
  oddweek = weekNumber[0] % 2
  oddmonth = date.getMonth() % 2
  newdiv = document.createElement('td')
  newdiv.setAttribute 'data-datestr', datestr
  newdiv.className = 'today calcalcday day' + date.getDay() + ' oddweek' + oddweek + ' oddmonth' + oddmonth
  newdiv.id = date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear()
  newdiv.innerHTML = '<span>' + date.getDate() + '</span>'
  # Find or create the week container for the new day
  weekCont = @querySelector('.kw' + weekNumber[0] + '_' + weekNumber[1])
  if !weekCont
    weekCont = document.createElement('tr')
    weekCont.className = 'kw' + weekNumber[0] + '_' + weekNumber[1] + ' weektr'
    @appendChild weekCont
  weekCont.appendChild newdiv
  # Set the new date attribute
  @setAttribute 'data-newdate', date
  # Dispatch a 'calcalc' event
  @dispatchEvent event
  date

Object::insertThisWeek = ->
  date = new Date
  @insertToday()
  @prependDay date.getDay() - 1
  @appendDay 7 - date.getDay()
  return

Object::appendDay = (quantity) ->
  quantity = quantity or 1
  lastday = if @lastChild.lastChild.hasAttribute('data-datestr') then @lastChild.lastChild.getAttribute('data-datestr').split('.') else @lastChild.lastChild.previousElementSibling.getAttribute('data-datestr').split('.')
  event = new Event('calcalc')
  i = 0
  while i < quantity
    date = new Date(parseInt(lastday[0], 10), parseInt(lastday[1], 10), parseInt(lastday[2], 10))
    date.setDate parseInt(lastday[2], 10) + i + 1
    datestr = date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate()
    weekNumber = calcalc.getWeekNumber(date.getTime())
    oddweek = weekNumber[0] % 2
    oddmonth = date.getMonth() % 2
    newdiv = document.createElement('td')
    newdiv.setAttribute 'data-datestr', datestr
    newdiv.className = 'calcalcday day' + date.getDay() + ' oddweek' + oddweek + ' oddmonth' + oddmonth
    newdiv.id = date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear()
    newdiv.innerHTML = '<span>' + date.getDate() + '</span>'
    weekCont = @querySelector('.kw' + weekNumber[0] + '_' + weekNumber[1])
    if !weekCont
      weekCont = document.createElement('tr')
      weekCont.className = 'kw' + weekNumber[0] + '_' + weekNumber[1] + ' weektr'
      @appendChild weekCont
    weekCont.appendChild newdiv
    i++
  @setAttribute 'data-newdate', date
  event.initEvent 'calcalc', false, false
  # Deprecated, but kept for compatibility
  @dispatchEvent event
  date

Object::prependDay = (quantity) ->
  quantity = quantity or 1
  firstday = if @firstChild.firstChild.hasAttribute('data-datestr') then @firstChild.firstChild.getAttribute('data-datestr').split('.') else @firstChild.firstChild.nextElementSibling.getAttribute('data-datestr').split('.')
  event = new Event('calcalc')
  i = 0
  while i < quantity
    date = new Date(parseInt(firstday[0], 10), parseInt(firstday[1], 10), parseInt(firstday[2], 10))
    date.setDate parseInt(firstday[2], 10) - (i + 1)
    datestr = date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate()
    weekNumber = calcalc.getWeekNumber(date.getTime())
    oddweek = weekNumber[0] % 2
    oddmonth = date.getMonth() % 2
    newdiv = document.createElement('td')
    newdiv.setAttribute 'data-datestr', datestr
    newdiv.className = 'calcalcday day' + date.getDay() + ' oddweek' + oddweek + ' oddmonth' + oddmonth
    newdiv.id = date.getDate() + '_' + date.getMonth() + '_' + date.getFullYear()
    newdiv.innerHTML = '<span>' + date.getDate() + '</span>'
    weekCont = @querySelector('.kw' + weekNumber[0] + '_' + weekNumber[1])
    if !weekCont
      weekCont = document.createElement('tr')
      weekCont.className = 'kw' + weekNumber[0] + '_' + weekNumber[1] + ' weektr'
      @insertBefore weekCont, @firstChild
    weekCont.insertBefore newdiv, weekCont.firstChild
    i++
  @setAttribute 'data-newdate', date
  event.initEvent 'calcalc', false, false
  # Deprecated, but kept for compatibility
  @dispatchEvent event
  date

# Function to handle content reloading on scroll

reloadOnScroll = (ele) ->
  yPos = ele.parentNode.scrollTop
  height = ele.clientHeight
  date = false
  if document.body.getAttribute('data-scrolling') == 'true'
    return false
  # Check if we need to prepend days
  if yPos < ele.parentNode.clientHeight / 2
    date = ele.prependDay(42)
    ele.parentNode.scrollTop = yPos + ele.clientHeight - height
    return date
  # Check if we need to append days
  if yPos > height - (ele.parentNode.clientHeight) - (ele.parentNode.clientHeight / 2)
    date = ele.appendDay(42)
    return date
  false

# Initialize scroll event for calendar

Object::calcalcinit = ->
  ele = this

  ele.parentNode.onscroll = ->
    returnValue = reloadOnScroll(ele)
    if returnValue != false
      ele.setAttribute 'data-newdate', returnValue
      event = new Event('calcalc')
      ele.dispatchEvent event
    return

  return
