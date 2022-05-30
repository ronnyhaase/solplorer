const { parentPort: workerParent, workerData } = require('node:worker_threads')

const redis = require('@redis/client')
const solana = require('@solana/web3.js')


;(async function () {
  const redisClient = redis.createClient({ url: workerData.data.redisUrl })
  const solanaClient = new solana.Connection(workerData.data.solanaUrl)

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
