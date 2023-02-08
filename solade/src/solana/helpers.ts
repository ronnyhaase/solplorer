import {
  BLOCKS_PER_EPOCH,
  RE_PROGRAM_INVOCATION,
  SOL_PER_LAMPORT
} from './constants';

export const epochByBlock = (block) => Math.floor(block / BLOCKS_PER_EPOCH);
export const lamportToSol = (lamport) => lamport * SOL_PER_LAMPORT;

export const getTransactionMainProgram = (tx) => Array.isArray(tx.meta?.logMessages)
    ? tx.meta.logMessages[0].split(' ')[1]
    : null;
export const isProgramInvocation = (logMessage) => !!logMessage.match(RE_PROGRAM_INVOCATION);
export const getProgramFromLog = (logMessage) => {
  const match = logMessage.match(RE_PROGRAM_INVOCATION);
  if (match && match[1]) return match[1]
  else return null;
}
export const isVoteTransaction = (tx) => getTransactionMainProgram(tx) === 'Vote111111111111111111111111111111111111111'
