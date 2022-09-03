import { epochByBlock, lamportToSol } from '../helpers';

export const buildBlockTransaction = (tx) => ({
  signature: tx.transaction.signatures[0],
  sender: tx.transaction.message.accountKeys[0],
  error: !!tx.meta?.err || false,
  fee: lamportToSol(tx.meta?.fee),
});

export function buildBlock (blockNo, rawBlock) {
  let transactionsCountFailed = 0, transactionsCountSuccess = 0
  rawBlock.transactions.map((tx) => {
    if (tx.meta?.err) transactionsCountFailed += 1
    else transactionsCountSuccess += 1
  })

  return {
    _raw: rawBlock,
    base: {
      blockNo,
      epoch: epochByBlock(blockNo),
      ts: rawBlock.blockTime * 1000,
      blockHash: rawBlock.blockhash,
      prevBlockHash: rawBlock.previousBlockhash,
      leader: rawBlock.rewards[0]?.pubkey || null,
      leaderReward: lamportToSol(rawBlock.rewards[0]?.lamports),
      transactionsCount: rawBlock.transactions.length,
    },
    transactions: rawBlock.transactions.map(buildBlockTransaction),
    transactionsCount: rawBlock.transactions.length,
    transactionsCountFailed,
    transactionsCountSuccess,
  }
};
