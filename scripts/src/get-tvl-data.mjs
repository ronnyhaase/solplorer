import request from 'got'
import { pickAsWith } from './utils.mjs'

async function fetchData() {
  return Promise.all([
    request('https://api.llama.fi/charts/Solana').json(),
    request('https://api.llama.fi/protocols').json(),
  ])
}

function normalizeData([rawHistory, rawProtocols]) {
  const history = rawHistory.map(item => pickAsWith([
    ['date', 'ts'],
    ['totalLiquidityUSD', 'tvl'],
  ], item))
  const totalTvl = rawHistory[rawHistory.length-1].totalLiquidityUSD

  const protocols = rawProtocols
    .filter(protocol => protocol.chains.includes('Solana') && protocol.chainTvls && protocol.chainTvls['Solana'])
    .map(protocol => ({
      ...pickAsWith([
        'category',
        'change_1d',
        'change_1h',
        'change_7d',
        'description',
        'listedAt',
        ['logo', 'imageUrl'],
        ['mcap', 'marketCap'],
        'name',
        'symbol',
        'twitter',
        'url',
      ], protocol),
      dominancePercent: (protocol.chainTvls['Solana'] / totalTvl) * 100,
      tvl: protocol.chainTvls['Solana'],
    }))

  return {
    history,
    totalTvl,
    protocols,
    protocolsCount: protocols.length,
    updatedAt: Date.now(),
  }
}

;(async function main() {
  fetchData()
    .then(normalizeData)
    .then(JSON.stringify)
    .then(console.log)
})();
