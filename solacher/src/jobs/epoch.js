require('dotenv').config()

const { parentPort: workerParent, workerData } = require('node:worker_threads')

const redis = require('@redis/client')
const solana = require('@solana/web3.js');
const { normalizeEpoch } = require('../lib/normalizers');

;(async function () {
  const redisUrl = workerParent
    ? workerData.data.redisUrl
    : process.env.REDIS_URL
  const solanaUrl = workerParent
    ? workerData.data.solanaUrl
    : process.env.SOLANA_API_URL

  const solanaClient = new solana.Connection(solanaUrl)

  let rawEpochInfo = null
  try {
    rawEpochInfo = await solanaClient.getEpochInfo()
  } catch (error) {
    console.error('Request(s) failed for job "epoch"', error)
    if (workerParent) workerParent.postMessage('error')
    else process.exit(1)
  }

  const normalizedEpochInfo = {
    data: normalizeEpoch(rawEpochInfo),
    count: null,
    type: 'object',
    updatedAt: Date.now(),
  }

  const redisClient = redis.createClient({ url: redisUrl })
  await redisClient.connect()
  await redisClient.set('epoch', JSON.stringify(normalizedEpochInfo))
  await redisClient.quit()

  if (workerParent) workerParent.postMessage('done')
  else process.exit(0)
})();
