import { BLOCKS_PER_EPOCH, SOL_PER_LAMPORT } from './constants';

export const epochByBlock = (block) => Math.floor(block / BLOCKS_PER_EPOCH);
export const lamportToSol = (lamport) => lamport * SOL_PER_LAMPORT;
