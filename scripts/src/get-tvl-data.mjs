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
    ['date', 'ts', x => parseInt(x) * 1000],
    ['totalLiquidityUSD', 'tvl'],
  ], item))
  const totalTvl = rawHistory[rawHistory.length-1].totalLiquidityUSD

  const protocols = rawProtocols
    .filter(protocol => protocol.chains.includes('Solana') && protocol.chainTvls && protocol.chainTvls['Solana'])
    .map(protocol => ({
      ...pickAsWith([
        ['category', 'category', x => x === 'Dexes' ? 'DEX' : x],
        'change_1h',
        'change_7d',
        ['change_1d', 'change_24h'],
        'description',
        ['listedAt', 'listedAt', x => parseInt(x) * 1000],
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
    .sort((a, b) => (b.tvl || -1) - (a.tvl|| -1))

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
