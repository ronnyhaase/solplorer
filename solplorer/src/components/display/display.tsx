import React from 'react'

import StandardProps from '../StandardProps'

type DisplayProps = StandardProps & {
  placeholder?: string | React.ReactNode
  prefix?: string | React.ReactNode
  suffix?: string | React.ReactNode
}

/**
 * A wrapper component that displays placeholder while children is null and adds
 * a prefix and suffix if set (no matter if children is null)
 */
const Display = ({
  as: Tag = 'span',
  children,
  prefix = null,
  suffix = null,
  placeholder = '-',
  ...rest
}: DisplayProps) => (
  <Tag {...rest}>{prefix}{children ? children : placeholder}{suffix}</Tag>
)

const NumberFormatDisplay = ({
  format,
  val,
  ...rest
}: DisplayProps & { format: Intl.NumberFormatOptions, val: number }) => {
  const formattedVal: string = (val !== null && val !== undefined)
    ? (new Intl.NumberFormat(undefined, format)).format(val)
    : null

  return (<Display {...rest}>{formattedVal}</Display>)
}

const DateTimeFormatDisplay = ({
  format,
  val,
  ...rest
}: DisplayProps & { format: Intl.DateTimeFormatOptions, val: Date }) => {
  const formattedVal: string = val ? (new Intl.DateTimeFormat(undefined, format)).format(val) : null

  return (<Display {...rest}>{formattedVal}</Display>)
}

const CurrencyDisplay = ({
  val,
  short = false,
  currency = 'USD',
  ...rest
}: DisplayProps & { val: number, short?: boolean, currency?: string }) => {
  const format: Intl.NumberFormatOptions = short
    ? { style: 'currency', currency, notation: 'compact', compactDisplay: 'short' }
    : { style: 'currency', currency }

  return (<NumberFormatDisplay val={val} format={format} {...rest} />)
}

const NumberDisplay = ({
  val,
  short = false,
  ...rest
}: DisplayProps & { val: number, short?: boolean }) => {
  const format: Intl.NumberFormatOptions = short
    ? { notation: 'compact', compactDisplay: 'short' }
    : { maximumFractionDigits: 2 }

  return (<NumberFormatDisplay val={val} format={format} {...rest} />)
}

const DateDisplay = ({ val, ...rest }: DisplayProps & { val: Date}) => (
  <DateTimeFormatDisplay val={val} format={{ dateStyle: 'full' }} {...rest} />
)

const ChangeDisplay = ({ val, percent = false, ...rest }: { val: number, percent?: boolean }) => {
  if (val === undefined || val === null) return null

  let color, symbol

  if (val === 0) {
    color = 'muted'
    symbol = '±'
  } else if (val > 0) {
    color = 'success'
    symbol = '▲'
  } else if (val < 0) {
    color = 'danger'
    symbol = '▼'
  }

  return (
    <NumberDisplay
      className={`text-${color}`}
      prefix={`${symbol} `}
      suffix={percent ? ' %' : null}
      val={val}
      {...rest}
    />
  )
}

export {
  ChangeDisplay,
  CurrencyDisplay,
  DateDisplay,
  DateTimeFormatDisplay,
  Display,
  NumberFormatDisplay,
  NumberDisplay,
}
