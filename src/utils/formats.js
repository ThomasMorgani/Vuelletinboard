export default {
  dateHuman(date, isTimestamp = true, withYear = true) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const [year, month, day] = date.split('-')
    return withYear ? `${months[month - 1]} ${day}, ${year}` : `${months[month - 1]} ${day}`
  },
  timeHuman(time) {
    const timeArr = time.split(':')
    let period = 'am'
    let hour = parseInt(timeArr['0'])
    let min = parseInt(timeArr['1'])
    if (hour >= 12) period = 'pm'
    if (hour > 12) hour = hour - 12
    if (hour === 0) hour = 12
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}${period}`
  },
  timestampFromDt(date = null) {
    if (!date) {
      date = new Date()
    }
    const adjDt = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return adjDt
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')
  },
  timestampHuman(timestamp, withYear = true, withTime = true) {
    const asDate = timestamp && typeof timestamp.getMonth === 'function' ? timestamp : new Date(timestamp)
    let human = ''
    let D = asDate.getDate()
    if (D < 10) {
      D = D.toString().padStart(2, '0')
    }
    let M = asDate.getMonth() + 1
    if (M < 10) {
      M = M.toString().padStart(2, '0')
    }
    human = `${M}/${D}`
    if (withYear) {
      human = human + '/' + asDate.getFullYear()
    }
    if (withTime) {
      let h = asDate.getHours()
      let m = asDate.getMinutes()
      let ampm = 'AM'
      if (h === 0) {
        h = 12
      }
      if (h > 12) {
        h = h - 12
        ampm = 'PM'
      }
      if (m < 10) {
        m = m.toString().padStart(2, '0')
      }
      human = human + `  ${h}:${m} ${ampm}`
    }
    return human
    // return timestamp`
  },
}
