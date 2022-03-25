import useSWR from 'swr'

import { Panel, Progress } from '../../components'
import intlFormatHelper from '../../utils/intl-format-helper'

const Epoch = () => {
  const { data, error } = useSWR('/api/epoch', url => fetch(url).then((res) => res.json()))

  return (
    <Panel>
      <div className="d-flex">
        <div className="p-md border-0 border-r border-solid border-inset">
          <div>
            <span className="text-muted">Slot Height</span>
          </div>
          <div className="text-xl">
            {data ? intlFormatHelper.number(data.slotHeightTotal) : '-'}
          </div>
        </div>
        <div className="p-md border-0 border-r border-solid border-inset">
          <div>
          <span className="text-muted">Transactions</span>
          </div>
          <div className="text-xl">
            {data ? intlFormatHelper.number(data.transactionsTotal) : '-'}
          </div>
        </div>
        <div className="p-md grow">
          <div>
          <span className="text-muted">Epoch</span>
          </div>
          <div className="d-flex">
            {data ? (<>
              <span className="text-xl">{data.currentEpoch}</span>
              <div className="grow mx-md">
                <div className="d-flex text-sm">
                  <div className="grow">{data.epochProgress} %</div>
                  <div>ETA {intlFormatHelper.timeLeft(data.epochETA)} </div>
                </div>
                <Progress className="grow" min={0} max={100} value={data.epochProgress}></Progress>
              </div>
              <span className="text-inset text-xl">{data.nextEpoch}</span>
            </>) : '-'}
          </div>
        </div>
      </div>
    </Panel>
  )
}

export default Epoch
