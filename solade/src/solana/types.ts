export type Epoch = {
  currentEpoch: number;
  nextEpoch: number;
  epochSlotCurrent: number;
  epochSlotTarget: number;
  epochETA: number;
  epochProgress: number;
  slotHeightTotal: number;
  transactionsTotal: number;
};

export type Supply = {
  activeStake: number;
  activeStakePercent: number;
  circulating: number;
  circulatingPercent: number;
  delinquentsStake: number;
  delinquentsStakePercent: number;
  nonCirculating: number;
  total: number;
};

export type TvlData = {
  protocols: Array<{
    category: string;
    change_1d: number;
    change_1h: number;
    change_7d: number;
    description: string;
    listedAt: number;
    logo: string;
    mcap: number;
    name: string;
    symbol: string;
    twitter: string;
    url: string;
  }>;
  history: Array<{
    ts: number;
    tvl: number;
  }>;
  protocolsCount: number;
  totalTvl: number;
  updatedAt: number;
};

export type Validator = {
  activatedStake: number;
  commission: number;
  epochCredits: Array<Array<number>>;
  epochVoteAccount: boolean;
  lastVote: number;
  nodePubkey: string;
  rootSlot: number;
  votePubkey: string;
  delinquent: boolean;
  info: {
    details: string;
    keybaseUsername: string;
    name: string;
    website: string;
    imageUrl: string;
  };
};
