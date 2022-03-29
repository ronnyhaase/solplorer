import { Commitment, Connection, clusterApiUrl, ConnectionConfig } from "@solana/web3.js";

function createSolanaConnection (
  url: string = process.env.API_URL || clusterApiUrl('mainnet-beta'),
  commitment: Commitment = undefined
): Connection {
  let config: ConnectionConfig = {}
  if (commitment) config.commitment = commitment
  if (process.env.API_KEY) config.httpHeaders = { 'Authorization': process.env.API_KEY }

  return new Connection(url, config)
}

export default createSolanaConnection
