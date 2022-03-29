import { SolanaConnection } from '../../utils/solana-connection'

const AVG_SLOTTIME = 550

const handler = async (_, res) => {
  const client = SolanaConnection.getInstance()
  const epochInfo = await client.getEpochInfo()

  res.status(200).json({
    currentEpoch: epochInfo.epoch,
    nextEpoch: epochInfo.epoch + 1,
    epochSlotCurrent: epochInfo.slotIndex,
    epochSlotTarget: epochInfo.slotsInEpoch,
    epochETA: (epochInfo.slotsInEpoch - epochInfo.slotIndex) * AVG_SLOTTIME,
    epochProgress: Math.round((epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100),
    slotHeightTotal: epochInfo.absoluteSlot,
    transactionsTotal: epochInfo.transactionCount,
  })
}

export default handler
