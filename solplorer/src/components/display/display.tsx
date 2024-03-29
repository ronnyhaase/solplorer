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

  return (<Display as="time" dateTime={val.toISOString()} {...rest}>{formattedVal}</Display>)
}

const CurrencyDisplay = ({
  val,
  short = false,
  currency = 'USD',
  maxDecimals = 2,
  ...rest
}: DisplayProps & { val: number, short?: boolean, currency?: string, maxDecimals?: number }) => {
  const format: Intl.NumberFormatOptions = short
    ? { style: 'currency', currency, notation: 'compact', compactDisplay: 'short', minimumFractionDigits: 0, maximumFractionDigits: maxDecimals }
    : { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: maxDecimals }

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

const DateDisplay = ({
  val,
  dateStyle = 'full',
  ...rest
}: DisplayProps & {
  val: Date,
  dateStyle?: "full" | "long" | "medium" | "short" | undefined,
}) => (
  <DateTimeFormatDisplay val={val} format={{ dateStyle }} {...rest} />
)

const DateTimeDisplay = ({
  val,
  dateStyle = 'full',
  timeStyle = 'full',
  ...rest
}: DisplayProps & {
  val: Date,
  dateStyle?: "full" | "long" | "medium" | "short" | undefined,
  timeStyle?: "full" | "long" | "medium" | "short" | undefined,
}) => (
  <DateTimeFormatDisplay val={val} format={{ dateStyle, timeStyle }} {...rest} />
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
  DateTimeDisplay,
  DateTimeFormatDisplay,
  Display,
  NumberFormatDisplay,
  NumberDisplay,
}
