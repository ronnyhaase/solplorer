import {
  epochByBlock,
  getProgramFromLog,
  getTransactionMainProgram,
  isVoteTransaction,
  lamportToSol
} from '../helpers';



export const buildBlockTransaction = (tx) => ({
  signature: tx.transaction.signatures[0],
  sender: tx.transaction.message.accountKeys[0],
  mainProgram: getTransactionMainProgram(tx),
  error: !!tx.meta?.err || false,
  fee: lamportToSol(tx.meta?.fee),
});

export const getBlockTransactionsAggregation = (rawTransactions) => {
  let transactionsCountFailed = 0, transactionsCountSuccess = 0;
  let transactionsCountVote = 0, transactionsCountNonVote = 0;
  let programAggregation: Object = {};

  rawTransactions.map((tx) => {
    if (tx.meta?.err) transactionsCountFailed += 1
    else transactionsCountSuccess += 1;

    if (isVoteTransaction(tx)) transactionsCountVote += 1
    else transactionsCountNonVote += 1;

    const program = getTransactionMainProgram(tx);
    if (Array.isArray(tx.meta?.logMessages)) {
      tx.meta.logMessages.map(msg => {
        const program = getProgramFromLog(msg);
        if (program) {
          if (!program) {}
          else if (programAggregation.hasOwnProperty(program)) programAggregation[program] += 1
          else programAggregation[program] = 1;
        }
      })
    }

  });

  return [
    programAggregation,
    transactionsCountFailed,
    transactionsCountSuccess,
    transactionsCountVote,
    transactionsCountNonVote,
  ];
}

export function buildBlock (blockNo, rawBlock) {
  const [
    programAggregation = {},
    transactionsCountFailed = 0,
    transactionsCountSuccess = 0,
    transactionsCountVote = 0,
    transactionsCountNonVote = 0,
  ] = getBlockTransactionsAggregation(rawBlock.transactions);

  return {
    _raw: rawBlock,
    baseData: {
      blockNo,
      epoch: epochByBlock(blockNo),
      ts: rawBlock.blockTime * 1000,
      blockHash: rawBlock.blockhash,
      prevBlockHash: rawBlock.previousBlockhash,
      leader: rawBlock.rewards[0]?.pubkey || null,
      leaderReward: lamportToSol(rawBlock.rewards[0]?.lamports),
      transactionsCount: rawBlock.transactions.length,
    },
    programAggregation,
    transactions: rawBlock.transactions.map(buildBlockTransaction),
    transactionsCount: rawBlock.transactions.length,
    transactionsCountFailed,
    transactionsCountSuccess,
    transactionsCountVote,
    transactionsCountNonVote
  }
};
