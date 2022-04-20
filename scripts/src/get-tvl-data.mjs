import request from 'got'
import pick from 'lodash.pick'

async function getTvlData() {
  const rawHistory = await request('https://api.llama.fi/charts/Solana').json()
  const history = rawHistory.map(item => ({
    ts: parseInt(item.date),
    tvl: item.totalLiquidityUSD,
  }))
  const totalTvl = rawHistory[rawHistory.length-1].totalLiquidityUSD

  const unfilteredProtocols = await request('https://api.llama.fi/protocols').json()
  const relevantProtocolFields = [
    'category',
    'change_1d',
    'change_1h',
    'change_7d',
    'description',
    'listedAt',
    'logo',
    'mcap',
    'name',
    'symbol',
    'twitter',
    'url',
  ]
  const protocols = unfilteredProtocols
    .filter(protocol => protocol.chains.includes('Solana') && protocol.chainTvls && protocol.chainTvls['Solana'])
    .map(protocol => ({
      ...pick(protocol, relevantProtocolFields),
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
  getTvlData()
    .then(JSON.stringify)
    .then(console.log)
})();
