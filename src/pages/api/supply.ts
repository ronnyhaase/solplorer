import { SOL_PER_LAMPORT } from '../../constants'
import createSolanaConnection from '../../utils/solana-connection'

const handler = async (req, res) => {
  const client = createSolanaConnection()
  const supply = await client.getSupply({ excludeNonCirculatingAccountsList: true })
  const validators = await client.getVoteAccounts()

  const activeStake = Math.round(
    validators.current.reduce((prev, current) => prev + current.activatedStake, 0)
  )
  const delinquentsStake = Math.round(
    validators.delinquent.reduce((prev, current) => prev + current.activatedStake, 0)
  )

  res.status(200).json({
    circulating: supply.value.circulating * SOL_PER_LAMPORT,
    nonCirculating: supply.value.nonCirculating * SOL_PER_LAMPORT,
    total: supply.value.total * SOL_PER_LAMPORT,
    circulatingPercent: (supply.value.circulating / supply.value.total) * 100,
    activeStake: activeStake * SOL_PER_LAMPORT,
    delinquentsStake: delinquentsStake * SOL_PER_LAMPORT,
    activeStakePercent: (activeStake / supply.value.total) * 100,
    delinquentsStakePercent: (delinquentsStake / supply.value.total) * 100,
  })
}

export default handler
