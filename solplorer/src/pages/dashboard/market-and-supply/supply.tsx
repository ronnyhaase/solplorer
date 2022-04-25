import { NumberDisplay } from '../../../components'

const Supply = ({ supplyData }) => {
  const {
    activeStake,
    activeStakePercent,
    circulating,
    circulatingPercent,
    delinquentsStakePercent,
    total,
  } = supplyData || {}

  return (
    <div>
      <div className="text-muted">Circulating Supply</div>
      <div className="whitespace-nowrap">
        {supplyData ? (<>
          <NumberDisplay short val={circulating} />
          {' '} of <NumberDisplay short val={total} />
          {' '} (<NumberDisplay val={circulatingPercent} suffix=" %" />)
        </>) : '-'}
      </div>
      <div className="text-muted">Actively Staked</div>
      <div className="whitespace-nowrap">
        {supplyData ? (<>
          <NumberDisplay short val={activeStake} />
          {' '} of <NumberDisplay short val={total} />
          {' '} (<NumberDisplay val={activeStakePercent} suffix=" %" />)
          <NumberDisplay as="div" className="text-danger" val={delinquentsStakePercent} prefix="(" suffix=" % Delinquents)" />
        </>) : <>-<br />&nbsp;</>}
      </div>
    </div>
  )
}

export default Supply
