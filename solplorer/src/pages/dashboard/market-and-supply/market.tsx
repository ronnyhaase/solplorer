import { Fragment, useEffect, useState } from 'react'
import { CurrencyDisplay, Display } from '../../../components'

const Market = ({ marketData }) => {
  const { change, marketCap, price, tvl, tvlChange, volume } = marketData || {}

  const [changeColor, setChangeColor] = useState('muted')
  const [tvlChangeColor, setTvlChangeColor] = useState('muted')
  const [changeSymbol, setChangeSymbol] = useState('-')
  const [tvlChangeSymbol, setTvlChangeSymbol] = useState('-')

  useEffect(() => {
    if (change === 0) {
      setChangeColor('muted')
      setChangeSymbol('±')
    } else if (change > 0) {
      setChangeColor('success')
      setChangeSymbol('▲')
    } else if (change < 0) {
      setChangeColor('danger')
      setChangeSymbol('▼')
    }

    if (tvlChange === 0) {
      setTvlChangeColor('muted')
      setTvlChangeSymbol('±')
    } else if (tvlChange > 0) {
      setTvlChangeColor('success')
      setTvlChangeSymbol('▲')
    } else if (tvlChange < 0) {
      setTvlChangeColor('danger')
      setTvlChangeSymbol('▼')
    }
  }, [marketData])

  return (
    <>
      <div className="d-flex items-center">
        <CurrencyDisplay as="div" className="text-xl" val={price} suffix={<>&nbsp;</>} />
        <Display as="div" className={`text-${changeColor}`} prefix={changeSymbol + ' '} suffix=" %">{change}</Display>
      </div>
      <table>
        <tbody>
          <tr>
            <th className="text-muted">24H Market Cap</th>
            <td>
              <CurrencyDisplay as={Fragment} short val={marketCap} />
            </td>
          </tr>
          <tr>
            <th className="text-muted">24H Volume</th>
            <td>
              <CurrencyDisplay as={Fragment} short val={volume} />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="d-flex sm:d-block md:d-flex items-center mt-md whitespace-nowrap">
        <CurrencyDisplay as="div" className="text-xl text-pink" short prefix="TVL " val={tvl} suffix={<>&nbsp;</>} />
        <Display as="div" className={`text-${tvlChangeColor}`} prefix={tvlChangeSymbol + ' '} suffix=" %">{tvlChange}</Display>
      </div>
    </>
  )
}

export default Market
