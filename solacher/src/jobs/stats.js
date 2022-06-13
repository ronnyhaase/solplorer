require('dotenv').config()

const { parentPort: workerParent, workerData } = require('node:worker_threads')

const redis = require('@redis/client')
const solana = require('@solana/web3.js')

;(async function () {
  const redisUrl = workerParent
    ? workerData.data.redisUrl
    : process.env.REDIS_URL
  const solanaUrl = workerParent
    ? workerData.data.solanaUrl
    : process.env.SOLANA_API_URL

  const redisClient = redis.createClient({ url: redisUrl })
  const solanaClient = new solana.Connection(solanaUrl)

  const [blockHeight, slotHeight, transactionsCount, rawPerfSample] = await Promise.all([
    solanaClient.getBlockHeight(),
    solanaClient.getSlot(),
    solanaClient.getTransactionCount(),
    solanaClient.getRecentPerformanceSamples(1),
  ])

  const normalizedStats = {
    blockHeight,
    slotHeight,
    transactionsCount,
    tps: Math.round(rawPerfSample[0].numTransactions / rawPerfSample[0].samplePeriodSecs),
  }

  await redisClient.connect()
  await redisClient.set('stats', JSON.stringify(normalizedStats))
  await redisClient.quit()

  if (workerParent) workerParent.postMessage('done')
  else process.exit(0)
})()
