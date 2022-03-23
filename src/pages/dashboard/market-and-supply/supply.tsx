import { If } from 'react-extras'
import useSWR from 'swr'
import intlFormatHelper from '../../../utils/intl-format-helper'

const Supply = () => {
  const { data, error } = useSWR('/api/supply', url => fetch(url).then((res) => res.json()))

  return (
    <div>
      <If condition={!!data} render={() => (<>
        <div className="text-muted">Circulating Supply</div>
        <div className="whitespace-nowrap">
          {intlFormatHelper.shortNumber(data.circulating)}{' '}
          of {intlFormatHelper.shortNumber(data.total)}{' '}
          ({intlFormatHelper.number(data.circulatingPercent)}%)
        </div>

        <div className="text-muted">Actively Staked</div>
        <div className="whitespace-nowrap">
          {intlFormatHelper.shortNumber(data.activeStake)}{' '}
          of {intlFormatHelper.shortNumber(data.total)}{' '}
          ({intlFormatHelper.number(data.activeStakePercent)}%)
          <div className="text-danger">
            ({intlFormatHelper.number(data.delinquentsStakePercent)}% Delinquents)
          </div>
        </div>
      </>)} />
      <If condition={!data}>
        Loading supply...
      </If>
    </div>
  )
}

export default Supply
