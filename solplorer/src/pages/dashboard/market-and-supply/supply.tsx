import { If } from 'react-extras'
import useSWR from 'swr'
import intlFormatHelper from '../../../utils/intl-format-helper'

const Supply = ({ supplyData }) => {
  return (
    <div>
      <div className="text-muted">Circulating Supply</div>
      <div className="whitespace-nowrap">
        {supplyData ? (<>
          {intlFormatHelper.shortNumber(supplyData.circulating)}{' '}
          of {intlFormatHelper.shortNumber(supplyData.total)}{' '}
          ({intlFormatHelper.number(supplyData.circulatingPercent)}%)
        </>) : '-'}
      </div>

      <div className="text-muted">Actively Staked</div>
      <div className="whitespace-nowrap">
        {supplyData ? (<>
          {intlFormatHelper.shortNumber(supplyData.activeStake)}{' '}
          of {intlFormatHelper.shortNumber(supplyData.total)}{' '}
          ({intlFormatHelper.number(supplyData.activeStakePercent)}%)
          <div className="text-danger">
            ({intlFormatHelper.number(supplyData.delinquentsStakePercent)}% Delinquents)
          </div>
        </>) : <>-<br />&nbsp;</>}
      </div>
    </div>
  )
}

export default Supply
