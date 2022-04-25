import { Display, NumberDisplay, Panel, Progress } from '../../components'
import intlFormatHelper from '../../utils/intl-format-helper'

const Epoch = ({ epochData, slotData }) => {
  const { currentEpoch, epochETA, epochProgress, nextEpoch, transactionsTotal } = epochData || {}

  let slot = null
  if (slotData) slot = slotData.root
  else if (epochData) slot = epochData.slotHeightTotal

  return (
    <Panel>
      <div className="d-flex flex-wrap">
        <div className="mb-md sm:mb-0 mr-md pr-md border-0 sm:border-r border-solid border-inset">
          <div>
            <span className="text-muted">Slot Height</span>
          </div>
          <NumberDisplay as="div" className="font-mono text-xl" val={slot} />
        </div>
        <div className="w-1/1 lg:w-auto sm:w-1/2 lg:mr-md pt-md sm:pt-0 lg:pr-md border-0 border-t sm:border-t-0 lg:border-r border-solid border-inset">
          <div>
            <span className="text-muted">Transactions</span>
          </div>
          <NumberDisplay as="div" className="font-mono text-xl" val={transactionsTotal} />
        </div>
        <div className="mt-md lg:mt-0 pt-md lg:pt-0 border-0 border-solid border-inset grow border-t lg:border-t-0">
          <div>
            <span className="text-muted">Epoch</span>
          </div>
          <div className="d-flex">
            <Display className="text-xl">{currentEpoch}</Display>
            <div className="grow mx-md">
              <div className="d-flex text-sm">
                <Display as="div" className="grow" suffix=" %">{epochProgress}</Display>
                <Display as="div" prefix="ETA " suffix=" ">{epochData ? intlFormatHelper.timeLeft(epochETA) : null}</Display>
              </div>
              <Progress className="grow" min={0} max={100} value={epochProgress ? epochProgress : 0}></Progress>
            </div>
            <Display className="text-inset text-xl">{nextEpoch}</Display>
          </div>
        </div>
      </div>
    </Panel>
  )
}

export default Epoch
