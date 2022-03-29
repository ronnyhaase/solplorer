import { If } from 'react-extras'
import useSWR from 'swr'
import intlFormatHelper from '../../../utils/intl-format-helper'

const Supply = () => {
  const { data, error } = useSWR('/api/supply', url => fetch(url).then((res) => res.json()))

  return (
    <div>
      <div className="text-muted">Circulating Supply</div>
      <div className="whitespace-nowrap">
        {data ? (<>
          {intlFormatHelper.shortNumber(data.circulating)}{' '}
          of {intlFormatHelper.shortNumber(data.total)}{' '}
          ({intlFormatHelper.number(data.circulatingPercent)}%)
        </>) : '-'}
      </div>

      <div className="text-muted">Actively Staked</div>
      <div className="whitespace-nowrap">
        {data ? (<>
          {intlFormatHelper.shortNumber(data.activeStake)}{' '}
          of {intlFormatHelper.shortNumber(data.total)}{' '}
          ({intlFormatHelper.number(data.activeStakePercent)}%)
          <div className="text-danger">
            ({intlFormatHelper.number(data.delinquentsStakePercent)}% Delinquents)
          </div>
        </>) : <>-<br />&nbsp;</>}
      </div>
    </div>
  )
}

export default Supply
