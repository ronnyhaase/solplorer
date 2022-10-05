require('dotenv').config()

const { parentPort: workerParent, workerData } = require('node:worker_threads')

const redis = require('@redis/client')
const solana = require('@solana/web3.js')
const { normalizeEpoch } = require('../lib/normalizers')

;(async function () {
  const redisUrl = workerParent
    ? workerData.data.redisUrl
    : process.env.REDIS_URL
  const solanaUrl = workerParent
    ? workerData.data.solanaUrl
    : process.env.SOLANA_API_URL

  const solanaClient = new solana.Connection(solanaUrl)


  let rawPerfSample = null, epochInfo = null
  try {
    [rawPerfSample, epochInfo] = await Promise.all([
      solanaClient.getRecentPerformanceSamples(1),
      solanaClient.getEpochInfo(),
    ])
  } catch (error) {
    console.error('Request(s) failed for job "stats"', error)
    if (workerParent) workerParent.postMessage('error')
    else process.exit(1)
  }

  if (!rawPerfSample || !rawPerfSample[0] || !epochInfo) {
    console.error('Missing data', rawPerfSample, epochInfo)
    if (workerParent) workerParent.postMessage('error')
    else process.exit(1)
  }

  const normalizedStats = {
    data: {
      epoch: normalizeEpoch(epochInfo),
      blockHeight: epochInfo.blockHeight,
      slotHeight: epochInfo.absoluteSlot,
      transactionsCount: epochInfo.transactionCount,
      tps: Math.round(rawPerfSample[0].numTransactions / rawPerfSample[0].samplePeriodSecs),
    },
    count: null,
    type: 'object',
    updatedAt: Date.now(),
  }

  const redisClient = redis.createClient({ url: redisUrl })
  await redisClient.connect()
  await redisClient.set('stats', JSON.stringify(normalizedStats))
  await redisClient.quit()

  if (workerParent) workerParent.postMessage('done')
  else process.exit(0)
})();
