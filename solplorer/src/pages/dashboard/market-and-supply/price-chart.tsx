import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import intlFormatHelper from '../../../utils/intl-format-helper'

const CustomTooltip = ({ active = null, payload = null, label = null }) => {
  if (!active || !payload || !payload.length) return null

  const ts = intlFormatHelper.date(new Date(label))
  const volume = intlFormatHelper.shortNumber(payload[0].value)
  const price = intlFormatHelper.currency(payload[1].value)

  return (
    <div className="bg-outset p-md rounded-md">
      <div><strong>{ts}</strong></div>
      <div>Price: {price}</div>
      <div>Volume: {volume}</div>
    </div>
  )
}

const PriceChart = ({ history }) => (
  <ResponsiveContainer>
    <ComposedChart data={history}>
      <XAxis
        dataKey="ts"
        height={25}
        tickFormatter={val => intlFormatHelper.chartDate(new Date(val))}
      />
      {/* // TODO: Add labels to y-axes */}
      <YAxis
        yAxisId="price"
        dataKey="price"
        orientation="right"
        domain={[dataMin => dataMin * 0.95, dataMax => dataMax + 1]}
        tickFormatter={val => intlFormatHelper.shortCurrency(val)}
        width={45}
      />
      <YAxis
        yAxisId="volume"
        dataKey="volume"
        hide={false}
        domain={[0, dataMax => dataMax * 2]}
        tickFormatter={val => intlFormatHelper.shortNumber(val)}
        width={65}
      />
      <Tooltip content={<CustomTooltip />} />
      <CartesianGrid stroke="var(--c-outset)" />
      <Bar dataKey="volume" yAxisId="volume" fill="var(--c-muted)" barSize={16} />
      <Line yAxisId="price" dataKey="price" dot={false} stroke="var(--c-foreground)" />
    </ComposedChart>
  </ResponsiveContainer>
)

export default PriceChart
