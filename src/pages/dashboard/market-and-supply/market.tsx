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

  return (
    <>
      <div className="d-flex items-center">
        <div className="text-xl">
          {marketData ? intlFormatHelper.currency(marketData.price) : '-'}
          &nbsp;
        </div>
        <div className={`text-${changeColor}`}>
          {changeSymbol} {marketData ? marketData.change : '-'}%
        </div>
      </div>
      <table>
        <tbody>
          <tr>
            <th className="text-muted">24H Market Cap</th>
            <td>
              {marketData
                ? intlFormatHelper.shortCurrency(marketData.marketCap)
                : '-'
              }
            </td>
          </tr>
          <tr>
            <th className="text-muted">24H Volume</th>
            <td>
              {marketData
                ? intlFormatHelper.shortCurrency(marketData.volume)
                : '-'
              }
              </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default Market
