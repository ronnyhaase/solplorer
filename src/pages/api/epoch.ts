import * as solana from '@solana/web3.js'

const AVG_SLOTTIME = 550

const handler = async (req, res) => {
  const client = new solana.Connection(solana.clusterApiUrl('mainnet-beta'), 'finalized')
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
