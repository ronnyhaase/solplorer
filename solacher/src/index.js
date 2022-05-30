require('dotenv').config()

const path = require('path')

const Bree = require('bree')

const redisUrl = process.env.REDIS_URL
const solanaUrl = process.env.SOLANA_API_URL

const createJob = (name, interval = 0, data = {}, runOnStart = false) => ({
  name,
  interval,
  worker: { workerData: { data: { redisUrl, solanaUrl, ...data } } },
  timeout: runOnStart ? 0 : false,
})

const jobScheduler = new Bree({
  root: path.resolve('src/jobs'),
  jobs: [
    createJob('stats', '5s'),
    createJob('epoch', '10m'),
    createJob('markets', '15m'),
    // createJob('validators', 'at 12:00 am', {}, false),
    createJob('supply', 'at 1:00 am'),
  ]
})

jobScheduler.start()
