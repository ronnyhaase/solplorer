export type MarketData = {
  price: number;
  volume: number;
  change: number;
  marketCap: number;
  history: Array<{ ts: number; price: number; volume: number }>;
};
