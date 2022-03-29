/** Turns milliseconds into object with days, hours and seconds */
function dhm (ms: number)
    : { days: number, hours: number, minutes: number } {
  const DAY_IN_MS = 24 * 60 * 60 * 1000
  const HOURS_IN_MS = 60 * 60 * 1000

  let days = Math.floor(ms / DAY_IN_MS)
  let hours = Math.floor( (ms - days * DAY_IN_MS) / HOURS_IN_MS)
  let minutes = Math.round( (ms - days * DAY_IN_MS - hours * HOURS_IN_MS) / 60000)

  if (minutes === 60) {
    hours += 1
    minutes = 0
  }
  if (hours === 24) {
    days += 1
    hours = 0
  }

  return { days, hours, minutes }
}

/** Turns month number (starting with 0) to short month */
const shortMonth = monthNumber => {
  switch (monthNumber) {
    case  0: return 'Jan'
    case  1: return 'Feb'
    case  2: return 'Mar'
    case  3: return 'Apr'
    case  4: return 'May'
    case  5: return 'Jun'
    case  6: return 'Jul'
    case  7: return 'Aug'
    case  8: return 'Sep'
    case  9: return 'Oct'
    case 10: return 'Nov'
    case 11: return 'Dec'
  }
}

const intlFormatHelper = {
  currency: (val, currency = 'USD') => (new Intl.NumberFormat(undefined, { style: 'currency', currency })).format(val),
  shortCurrency: (val, currency = 'USD') => (new Intl.NumberFormat(undefined, { style: 'currency', currency, notation: 'compact', compactDisplay: 'short' })).format(val),
  chartDate: (val: Date): string => (val.getDate() === 1) ? shortMonth(val.getMonth()) : `${val.getDate()}`,
  date: (val: Date): string => (new Intl.DateTimeFormat(undefined, { dateStyle: 'full' })).format(val),
  number: (val: number) => (new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(val)),
  shortNumber: (val: number) => (new Intl.NumberFormat(undefined, { notation: 'compact', compactDisplay: 'short' })).format(val),
  timeLeft: (val: number) => {
    const { days, hours } = dhm(val)
    if (days === 0 && hours === 0) return 'Less than 1h'
    else return `${days}d ${hours}h`
  }
}

export default intlFormatHelper
