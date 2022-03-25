import useSWR from 'swr'

import { Panel } from '../../../components'
import Supply from './supply'
import PriceChart from './price-chart'
import Market from './market'

const MarketAndSupply = () => {
  const { data: marketData, error } = useSWR('/api/market', url => fetch(url).then((res) => res.json()))

  return (
    <Panel>
      {marketData ? (<>
        <div className="d-flex">
          <div>
            <div className="mb-md pb-md border-solid border-0 border-b border-inset">
              <Market marketData={marketData} />
            </div>
            <div>
              <Supply />
            </div>
          </div>
          <div className="grow ml-md bg-inset">
            <PriceChart history={marketData.history} />
          </div>
        </div>
      </>) : (
        <div className="text-center">Loading market data...</div>
      )}
    </Panel>
  )
}

export default MarketAndSupply
