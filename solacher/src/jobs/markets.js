require('dotenv').config()

const { parentPort: workerParent, workerData } = require('node:worker_threads')

const redis = require('@redis/client')
const request = require('got-cjs').got

function calculateChange(oldVal, newVal) {
  if (newVal === oldVal || oldVal === 0) return 0;
  else return -(((oldVal - newVal) / oldVal) * 100);
}

;(async function () {
  const redisUrl = workerParent
    ? workerData.data.redisUrl
    : process.env.REDIS_URL

  const [rawPriceData, rawHistoryData, rawTvlData] = await Promise.all([
    request('https://api.coingecko.com/api/v3/simple/price', {
      searchParams: {
        ids: 'solana',
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_vol: true,
        include_24hr_change: true,
      },
    }).json(),
    request('https://api.coingecko.com/api/v3/coins/solana/market_chart', {
      searchParams: {
        vs_currency: 'usd',
        days: 13,
        interval: 'daily',
      },
    }).json(),
    request('https://api.llama.fi/charts/Solana').json(),
  ])

  const normalizedMarketsData = {
    data: {
      price: parseFloat(rawPriceData.solana.usd.toFixed(2)),
      tvl: rawTvlData[rawTvlData.length - 1].totalLiquidityUSD,
      tvlChange: parseFloat(
        calculateChange(
          rawTvlData[rawTvlData.length - 2].totalLiquidityUSD,
          rawTvlData[rawTvlData.length - 1].totalLiquidityUSD,
        ).toFixed(2),
      ),
      volume: Math.round(rawPriceData.solana.usd_24h_vol),
      change: parseFloat(rawPriceData.solana.usd_24h_change.toFixed(1)),
      marketCap: Math.round(rawPriceData.solana.usd_market_cap),
      history: rawHistoryData.prices.map((_, n) => ({
        ts: rawHistoryData.prices[n][0],
        price: rawHistoryData.prices[n][1],
        volume: rawHistoryData.total_volumes[n][1],
      })),
      tvlHistory: rawTvlData.map((item) => ({
        ts: parseInt(item.date) * 1000,
        tvl: item.totalLiquidityUSD,
      })),
    },
    count: null,
    type: 'object',
    updatedAt: Date.now(),
  }

  const redisClient = redis.createClient({ url: redisUrl })
  await redisClient.connect()
  await redisClient.set('markets', JSON.stringify(normalizedMarketsData))
  await redisClient.quit()

  if (workerParent) workerParent.postMessage('done')
  else process.exit(0)
})();
