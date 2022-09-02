import { lamportToSol } from '../helpers';

export const buildBlockTransaction = (tx) => ({
  signature: tx.transaction.signatures[0],
  sender: tx.transaction.message.accountKeys[0],
  error: !!tx.meta?.err || false,
  fee: lamportToSol(tx.meta?.fee),
});

export const buildBlock = (blockNo, rawBlock) => ({
  _raw: rawBlock,
  base: {
    blockNo,
    ts: rawBlock.blockTime * 1000,
    blockHash: rawBlock.blockhash,
    prevBlockHash: rawBlock.previousBlockhash,
    leader: rawBlock.rewards[0]?.pubkey || null,
    leaderReward: lamportToSol(rawBlock.rewards[0]?.lamports),
    transactionsCount: rawBlock.transactions.length,
  },
  transactions: rawBlock.transactions.map(buildBlockTransaction),
  transactionsCount: rawBlock.transactions.length,
});
