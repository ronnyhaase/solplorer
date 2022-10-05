require('dotenv').config()

const { parentPort: workerParent, workerData } = require('node:worker_threads')

const redis = require('@redis/client')
const request = require('got-cjs').got

const { pickAsWith } = require('../lib/utils')

async function fetchData() {
  let page = 1
  let done = false
  let data = []

  while (!done) {
    let response = null
    try {
      response = await request('https://api.coingecko.com/api/v3/coins/markets', {
        searchParams: {
          category: 'solana-ecosystem',
          page,
          per_page: 250,
          vs_currency: 'usd',
        },
      }).json()
    } catch (error) {
      console.error('Request(s) failed for job "tokens"', error)
      if (workerParent) workerParent.postMessage('error')
      else process.exit(1)
    }

    if (response.length === 0) {
      done = true
    } else {
      data = [...data, ...response]
      page += 1
    }
  }

  return data
}

function normalizeData (rawData) {
  return {
    data: rawData.map(coin => pickAsWith([
        'id',
        'symbol',
        'name',
        ['image', 'imageUrl'],
        ['current_price', 'price'],
        ['high_24h', 'priceHigh_24h'],
        ['low_24h', 'priceLow_24h'],
        ['price_change_24h', 'priceChange_24h'],
        ['price_change_percentage_24h', 'priceChangePercent_24h'],
        ['market_cap', 'marketCap'],
        ['market_cap_change_24h', 'marketCapChange_24h'],
        ['market_cap_change_percentage_24h', 'marketCapChangePercent_24h'],
        ['total_volume', 'volume'],
        ['circulating_supply', 'supplyCirculating'],
        ['total_supply', 'supplyTotal'],
        ['max_supply', 'supplyMax'],
    ], coin)),
    count: rawData.length,
    type: 'list',
    updatedAt: Date.now(),
  }
}

;(async function main() {
  const redisUrl = workerParent
    ? workerData.data.redisUrl
    : process.env.REDIS_URL

  const data = await fetchData()
    .then(normalizeData)
    .then(JSON.stringify)

  const redisClient = redis.createClient({ url: redisUrl })
  await redisClient.connect()
  await redisClient.set('tokens', data)
  await redisClient.quit()

  if (workerParent) workerParent.postMessage('done')
  else process.exit(0)
})();
