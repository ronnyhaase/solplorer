export type MarketData = {
  price: number;
  tvl: number;
  tvlChange: number;
  volume: number;
  change: number;
  marketCap: number;
  history: Array<{ ts: number; price: number; volume: number }>;
  tvlHistory: Array<{ ts: number; tvl: number }>;
};
