const { parentPort: workerParent, workerData } = require('node:worker_threads')

const redis = require('@redis/client')
const solana = require('@solana/web3.js')

const AVG_SLOTTIME = 550

;(async function () {
  const redisClient = redis.createClient({ url: workerData.data.redisUrl })
  const solanaClient = new solana.Connection(workerData.data.solanaUrl)

  const rawEpochInfo = await solanaClient.getEpochInfo()

  const normalizedEpochInfo = {
    currentEpoch: rawEpochInfo.epoch,
    nextEpoch: rawEpochInfo.epoch + 1,
    epochSlotCurrent: rawEpochInfo.slotIndex,
    epochSlotTarget: rawEpochInfo.slotsInEpoch,
    epochETA:
      (rawEpochInfo.slotsInEpoch - rawEpochInfo.slotIndex) * AVG_SLOTTIME,
    epochProgress: Math.round(
      (rawEpochInfo.slotIndex / rawEpochInfo.slotsInEpoch) * 100,
    ),
    slotHeightTotal: rawEpochInfo.absoluteSlot,
    transactionsTotal: rawEpochInfo.transactionCount,
  }

  await redisClient.connect()
  await redisClient.set('epochInfo', JSON.stringify(normalizedEpochInfo))
  await redisClient.quit()

  if (workerParent) workerParent.postMessage('done')
  else process.exit(0)
})();