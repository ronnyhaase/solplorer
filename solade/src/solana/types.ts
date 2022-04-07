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
