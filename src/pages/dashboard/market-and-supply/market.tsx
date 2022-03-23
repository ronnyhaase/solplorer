import { useEffect, useState } from 'react'
import intlFormatHelper from '../../../utils/intl-format-helper'

const Market = ({ marketData }) => {
  const [changeColor, setChangeColor] = useState('muted')
  const [changeSymbol, setChangeSymbol] = useState('-')

  useEffect(() => {
    if (!marketData || marketData === 0) {
      setChangeColor('muted')
      setChangeSymbol('±')
    } else if (marketData.change > 0) {
      setChangeColor('success')
      setChangeSymbol('▲')
    } else if (marketData.change < 0) {
      setChangeColor('danger')
      setChangeSymbol('▼')
    }
  }, [marketData])

  if (!marketData) return null

  return (
    <>
      <div className="d-flex items-center">
        <div className="text-xl">
          {intlFormatHelper.currency(marketData.price)}
          &nbsp;
        </div>
        <div className={`text-${changeColor}`}>
          {changeSymbol} {marketData.change}%
        </div>
      </div>
      <table>
        <tbody>
          <tr>
            <th className="text-muted">24H Market Cap</th>
            <td>{intlFormatHelper.shortCurrency(marketData.marketCap)}</td>
          </tr>
          <tr>
            <th className="text-muted">24H Volume</th>
            <td>{intlFormatHelper.shortCurrency(marketData.volume)}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default Market
