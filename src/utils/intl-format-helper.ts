function dhm (ms: number) {
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

const shortMonth = monthNumber => {
  switch (monthNumber) {
    case  0: return 'Jan'
    case  0: return 'Feb'
    case  0: return 'Mar'
    case  0: return 'Apr'
    case  0: return 'Jun'
    case  0: return 'Jul'
    case  0: return 'Aug'
    case  0: return 'Sep'
    case  0: return 'Oct'
    case 10: return 'Nov'
    case 11: return 'Dec'
  }
}

const intlFormatHelper = {
  currency: (val, currency = 'USD') => (new Intl.NumberFormat(undefined, { style: 'currency', currency })).format(val),
  shortCurrency: (val, currency = 'USD') => (new Intl.NumberFormat(undefined, { style: 'currency', currency, notation: 'compact', compactDisplay: 'short' })).format(val),
  chartDate: (val: Date): string => (val.getDate() === 1) ? shortMonth(val.getMonth()) : `${val.getDate()}`,
  date: (val: Date): string => (new Intl.DateTimeFormat(undefined, { dateStyle: 'full' })).format(val),
  number: val => (new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(val)),
  shortNumber: val => (new Intl.NumberFormat(undefined, { notation: 'compact', compactDisplay: 'short' })).format(val),
  timeLeft: val => {
    const { days, hours } = dhm(val)
    if (days === 0 && hours === 0) return 'Less than 1h'
    else return `${days}d ${hours}h`
  }
}

export default intlFormatHelper
