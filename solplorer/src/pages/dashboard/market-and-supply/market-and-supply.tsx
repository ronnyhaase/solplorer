import useSWR from 'swr'

import { Panel } from '../../../components'
import Supply from './supply'
import PriceChart from './price-chart'
import Market from './market'

const MarketAndSupply = () => {
  const { data: marketData, error } = useSWR('/api/market', url => fetch(url).then((res) => res.json()))

  return (
    <Panel>
      <div className="d-flex flex-wrap">
        <div className="w-1/1 lg:w-1/3 pr-md">
          <div className="d-flex flex-wrap mb-md lg:mb-0">
            <div className="w-1/2 lg:w-1/1 lg:mb-md lg:pb-md border-solid border-0 lg:border-b border-inset">
              <Market marketData={marketData} />
            </div>
            <div className="w-1/2 lg:w-1/1">
              <Supply />
            </div>
          </div>
        </div>
        <div className="w-1/1 lg:w-2/3 bg-inset" style={{ minHeight: '250px' }}>
          {marketData ? (<PriceChart history={marketData.history} />) : null}
        </div>
      </div>
    </Panel>
  )
}

export default MarketAndSupply
