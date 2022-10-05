require('dotenv').config()

const { parentPort: workerParent, workerData } = require('node:worker_threads')

const redis = require('@redis/client')
const request = require('got-cjs').got

;(async function main() {
  const redisUrl = workerParent
    ? workerData.data.redisUrl
    : process.env.REDIS_URL
  const cryptopanicToken = workerParent
    ? workerData.data.cryptopanicToken
    : process.env.CRYPTOPANIC_TOKEN

  let normalizedNews = null
  try {
    normalizedNews = await request('https://cryptopanic.com/api/v1/posts/', { searchParams: {
      'auth_token': cryptopanicToken,
      'public': 'true',
      'currencies': 'SOL',
      'kind': 'news',
      'filter': 'important',
    }})
      .json()
      .then(response => ({
        count: response.results.length,
        data: response.results
          // Filter Twitter news
          // .filter(newsItem => newsItem.source.domain !== 'twitter.com')
          .map(newsItem => ({
            publishedAt: new Date(newsItem.published_at).valueOf(),
            source: newsItem.source.title,
            title: newsItem.title,
            url: newsItem.url,
          })),
        type: 'list',
        updatedAt: Date.now(),
      }))
  } catch (error) {
    console.error('Request(s) / processing failed for job "news"', error)
    if (workerParent) workerParent.postMessage('error')
    else process.exit(1)
  }

  const redisClient = redis.createClient({ url: redisUrl })
  await redisClient.connect()
  await redisClient.set('news', JSON.stringify(normalizedNews))
  await redisClient.quit()

  if (workerParent) workerParent.postMessage('done')
  else process.exit(0)
})();
