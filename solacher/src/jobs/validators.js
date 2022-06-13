require('dotenv').config()

/**
 * Fetches all validators, their respective validator info and image URL via Keybase
 */

const { parentPort: workerParent, workerData } = require('node:worker_threads')

const redis = require('@redis/client')
const solana = require('@solana/web3.js')
const request = require('got-cjs').got

async function getValidators(connection) {
  const setDelinquent = val => validator => ({ ...validator, delinquent: val })

  const validators = new Map()
  const validatorAccounts = await connection.getVoteAccounts()
  validatorAccounts.current.map(setDelinquent(false))
    .concat(
      validatorAccounts.delinquent.map(setDelinquent(true)),
    )
    .map(validator => validators.set(validator.nodePubkey, validator))

  return validators
}

async function getValidatorInfos(connection) {
  const validatorInfos = new Map()
  const configAccounts = await connection.getProgramAccounts(
    new solana.PublicKey('Config1111111111111111111111111111111111111')
  )
  configAccounts
    .map(configAccount => solana.ValidatorInfo.fromConfigData(configAccount.account.data))
    .filter(info => info !== null)
    .map(info => validatorInfos.set(info.key.toString(), info.info))
  return validatorInfos
}

// TODO: Optimize - Userbase supports requesting for multiple users per request
async function getValidatorImageUrls(validatorInfos) {
  const validatorImageUrls = new Map()
  for (const [key, info] of validatorInfos.entries()) {
    if (!info.keybaseUsername) continue

    const keybaseResponse = await request(`https://keybase.io/_/api/1.0/user/lookup.json?usernames=${info.keybaseUsername}&fields=pictures`).json()

    if (keybaseResponse.them[0].pictures && keybaseResponse.them[0].pictures.primary) {
      validatorImageUrls.set(key, keybaseResponse.them[0].pictures.primary.url)
    } else {
      validatorImageUrls.set(key, null)
    }
  }

  return validatorImageUrls
}

function mergeData (validators, validatorInfos, validatorImageUrls) {
  const result = []

  validators.forEach((val, key) => {
    const validator = val
    const validatorInfo = validatorInfos.get(key) || null
    const imageUrl = validatorImageUrls.get(key) || null

    result.push({
      ...validator,
      info: {
        ...validatorInfo,
        imageUrl,
      },
    })

    return result
  })

  return result
}

;(async function main() {
  const redisUrl = workerParent
    ? workerData.data.redisUrl
    : process.env.REDIS_URL
  const solanaUrl = workerParent
    ? workerData.data.solanaUrl
    : process.env.SOLANA_API_URL

  const redisClient = redis.createClient({ url: redisUrl })
  const solanaClient = new solana.Connection(solanaUrl)

  const validators = await getValidators(solanaClient)
  const validatorInfos = await getValidatorInfos(solanaClient)
  const validatorImageUrls = await getValidatorImageUrls(validatorInfos)

  const normalizedValidators = mergeData(validators, validatorInfos, validatorImageUrls)
  const data = JSON.stringify({
    count: normalizedValidators.length,
    updatedAt: Date.now(),
    validators: normalizedValidators,
  })

  await redisClient.connect()
  await redisClient.set('validators', data)
  await redisClient.quit()

  if (workerParent) workerParent.postMessage('done')
  else process.exit(0)
})();
