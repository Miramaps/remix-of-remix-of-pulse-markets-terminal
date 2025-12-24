// Solana configuration and connection setup
import { Connection, clusterApiUrl, Commitment } from '@solana/web3.js';

// Network configuration
export const SOLANA_NETWORK = import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
export const COMMITMENT_LEVEL: Commitment = 'confirmed';

// Create RPC connection
export const getConnection = () => {
  const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK as 'devnet' | 'mainnet-beta' | 'testnet');
  return new Connection(rpcUrl, COMMITMENT_LEVEL);
};

// Default connection instance
export const connection = getConnection();

// Helper to format wallet address
export const formatWalletAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

// Helper to validate Solana address
export const isValidSolanaAddress = (address: string): boolean => {
  try {
    // Basic validation - Solana addresses are base58 encoded, 32-44 chars
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  } catch {
    return false;
  }
};

