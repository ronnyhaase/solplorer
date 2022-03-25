/**
 * Fetches all validators, their respective validator info and image URL
 */
import * as solana from '@solana/web3.js'
import ky from 'ky-universal'

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

    const keybaseResponse = await ky(`https://keybase.io/_/api/1.0/user/lookup.json?usernames=${info.keybaseUsername}&fields=pictures`).json()

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
  const client = new solana.Connection(solana.clusterApiUrl('mainnet-beta'), 'finalized')

  const validators = await getValidators(client)
  const validatorInfos = await getValidatorInfos(client)
  const validatorImageUrls = await getValidatorImageUrls(validatorInfos)

  const result = mergeData(validators, validatorInfos, validatorImageUrls)
  console.log(JSON.stringify(result))
})();
