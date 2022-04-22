import request from 'got'

import { pickAsWith } from './utils.mjs'

async function fetchData() {
  let page = 1
  let done = false
  let data = []

  while (!done) {
    const response = await request('https://api.coingecko.com/api/v3/coins/markets', {
      searchParams: {
        category: 'solana-ecosystem',
        page,
        per_page: 250,
        vs_currency: 'usd',
      },
    }).json()

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
    coins: rawData.map(coin => pickAsWith([
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
        ['market_cap_change_24h', 'marketCapChange24h'],
        ['market_cap_change_percentage_24h', 'marketCapChangePercent24h'],
        ['total_volume', 'volume'],
        ['circulating_supply', 'supplyCirculating'],
        ['total_supply', 'supplyTotal'],
        ['max_supply', 'supplyMax'],
    ], coin)),
    count: rawData.length,
    updatedAt: Date.now(),
  }
}

;(async function main() {
  fetchData()
    .then(normalizeData)
    .then(JSON.stringify)
    .then(console.log)
})();
