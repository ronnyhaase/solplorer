require('dotenv').config()

const { parentPort: workerParent, workerData } = require('node:worker_threads')

const redis = require('@redis/client')
const solana = require('@solana/web3.js')

const SOL_PER_LAMPORT = 0.000000001

;(async function () {
  const redisUrl = workerParent
    ? workerData.data.redisUrl
    : process.env.REDIS_URL
  const solanaUrl = workerParent
    ? workerData.data.solanaUrl
    : process.env.SOLANA_API_URL

  const redisClient = redis.createClient({ url: redisUrl })
  const solanaClient = new solana.Connection(solanaUrl)

  const [rawSupplyData, rawValidatorsData] = await Promise.all([
    solanaClient.getSupply({ excludeNonCirculatingAccountsList: true }),
    solanaClient.getVoteAccounts(),
  ]).then(([rawSupplyData, rawValidatorsData]) => [rawSupplyData.value, rawValidatorsData])

  const activeStake = rawValidatorsData.current.reduce((total, v) => total + v.activatedStake, 0)
  const delinquentsStake = rawValidatorsData.delinquent.reduce((total, v) => total + v.activatedStake, 0)
  const normalizedSupplyData = {
    circulating: rawSupplyData.circulating * SOL_PER_LAMPORT,
    nonCirculating: rawSupplyData.nonCirculating * SOL_PER_LAMPORT,
    total: rawSupplyData.total * SOL_PER_LAMPORT,
    circulatingPercent: (rawSupplyData.circulating / rawSupplyData.total) * 100,
    activeStake: Math.round(activeStake * SOL_PER_LAMPORT),
    delinquentsStake: Math.round(delinquentsStake * SOL_PER_LAMPORT),
    activeStakePercent: (activeStake / rawSupplyData.total) * 100,
    delinquentsStakePercent: (delinquentsStake / rawSupplyData.total) * 100,
  }

  await redisClient.connect()
  await redisClient.set('supply', JSON.stringify(normalizedSupplyData))
  await redisClient.quit()

  if (workerParent) workerParent.postMessage('done')
  else process.exit(0)
})();
