import { SOL_PER_LAMPORT } from "../constants";

export const getProgramName = (address) => {
  switch (address.toString()) {
    case            '11111111111111111111111111111111': return 'System Program';
    case 'NativeLoader1111111111111111111111111111111': return 'Native Loader';
    case 'Vote111111111111111111111111111111111111111': return 'Vote Program';
    case 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': return 'Token Program';
    case 'BPFLoader2111111111111111111111111111111111': return 'BPF Loader';
    default: return 'Unknown';
  }
};

export const buildBaseData = (address, rawAccount) => ({
  address: {
    address,
    name:  getProgramName(address)
  },
  balance: rawAccount.lamports * SOL_PER_LAMPORT,
  dataSize:  rawAccount.data.space || 0,
  executable: rawAccount.executable,
  owner: {
    address: rawAccount.owner,
    name: getProgramName(rawAccount.owner),
  },
  rentEpoch: rawAccount.rentEpoch,
});

export const buildStandardAccount = (address, rawAccount) => ({
  _raw: rawAccount,
  base: buildBaseData(address, rawAccount),
  type: 'Account',
});

export const buildTokenAccount = (address, rawAccount) => ({
  _raw: rawAccount,
  base: buildBaseData(address, rawAccount),
  type: 'Token Account'
});

export const buildVoteAccount = (address, rawAccount) => ({
  _raw: rawAccount,
  base: buildBaseData(address, rawAccount),
  details: {
    commission: rawAccount.data.parsed.info.commission,
    epochCredits: rawAccount.data.parsed.info.epochCredits,
    epochs: rawAccount.data.parsed.info.epochCredits.length - 1,
    lastTimestamp: {
      slot: rawAccount.data.parsed.info.lastTimestamp.slot,
      ts: rawAccount.data.parsed.info.lastTimestamp.timestamp * 1000,
    },
    nodePubkey: rawAccount.data.parsed.info.nodePubkey,
    rootSlot: rawAccount.data.parsed.info.rootSlot,
    // TODO: Needs validation if total vote credts = sum(epochCredits)
    // voteCredits: rawAccount.data.parsed.info.epochCredits
    //   .reduce((prev, curr) => parseInt(prev) + parseInt(curr.credits), 0),
    voter: rawAccount.data.parsed.info.authorizedVoters[0].authorizedVoter,
    votes: rawAccount.data.parsed.info.votes,
    withdrawer: rawAccount.data.parsed.info.authorizedWithdrawer,
  },
  type: 'Vote Account'
});
