require('dotenv').config()

const { parentPort: workerParent, workerData } = require('node:worker_threads')

const redis = require('@redis/client')
const solana = require('@solana/web3.js')

const AVG_SLOTTIME = 550

;(async function () {
  const redisUrl = workerParent
    ? workerData.data.redisUrl
    : process.env.REDIS_URL
  const solanaUrl = workerParent
    ? workerData.data.solanaUrl
    : process.env.SOLANA_API_URL

  const solanaClient = new solana.Connection(solanaUrl)

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

  const redisClient = redis.createClient({ url: redisUrl })
  await redisClient.connect()
  await redisClient.set('epoch', JSON.stringify(normalizedEpochInfo))
  await redisClient.quit()

  if (workerParent) workerParent.postMessage('done')
  else process.exit(0)
})();
