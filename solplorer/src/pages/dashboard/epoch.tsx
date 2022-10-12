import { Display, NumberDisplay, Panel, Progress } from '../../components'
import intlFormatHelper from '../../utils/intl-format-helper'

const Epoch = ({ statsData }) => {
  const { slotHeight, tps, transactionsCount } = statsData || {}
  const { currentEpoch, epochETA, epochProgress, nextEpoch, slotRangeStart, slotRangeEnd } = (statsData && statsData.epoch) || {}

  return (
    <Panel>
      <div className="d-flex flex-wrap">
        <div className="mb-md sm:mb-0 mr-md pr-md border-0 sm:border-r border-solid border-inset">
          <div>
            <span className="text-muted">Slot Height</span>
          </div>
          <NumberDisplay as="div" className="FadeIn font-mono text-xl" val={slotHeight} key={Math.random()} />
        </div>
        <div className="w-1/1 lg:w-auto sm:w-1/2 lg:mr-md pt-md sm:pt-0 lg:pr-md border-0 border-t sm:border-t-0 lg:border-r border-solid border-inset">
          <div>
            <span className="text-muted">Transactions</span>
          </div>
          <div>
            <span className="d-inline-block sm:text-center fadeIn">
              <NumberDisplay className="FadeIn font-mono text-xl" val={transactionsCount} key={Math.random()} /><br />
              <span className="text-muted">TPS: </span>
              <NumberDisplay className="FadeIn" val={tps}  key={Math.random()} />
            </span>
          </div>
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
                <Display as="div" prefix="ETA " suffix=" ">{epochETA ? intlFormatHelper.timeLeft(epochETA) : null}</Display>
              </div>
              <Progress className="grow" min={0} max={100} value={epochProgress ? epochProgress : 0}></Progress>
            </div>
            <Display className="text-muted text-xl">{nextEpoch}</Display>
          </div>
          <div className="text-center">
            <span className="text-muted">Slot Range: </span>
            <NumberDisplay val={slotRangeStart} /> - <NumberDisplay val={slotRangeEnd} />
          </div>
        </div>
      </div>
    </Panel>
  )
}

export default Epoch
