require('dotenv').config()

const path = require('path')

const Bree = require('bree')
const Graceful = require('@ladjs/graceful')

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
    createJob('stats', '10s'),
    createJob('epoch', '10m'),
    createJob('markets', '15m'),
    createJob('news', '60m'),
    createJob('supply', 'at 1:00 am'),
    createJob('tokens', 'at 1:05 am'),
    createJob('tvl', 'at 1:10 am'),
    // createJob('validators', 'at 12:00 am', {}, true),
  ],
  errorHandler: (error, meta) => {
    console.error(error, meta)
  },
})

const graceful = new Graceful({ brees: [jobScheduler] })
graceful.listen()
;(async () => {
  await jobScheduler.start()
})();
