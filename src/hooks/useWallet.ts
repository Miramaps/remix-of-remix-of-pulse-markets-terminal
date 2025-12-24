// Custom hook for wallet operations with Firestore tracking
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { walletService } from '@/lib/firestore';

export interface WalletUser {
  walletAddress: string;
  email?: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  lastActive: Date;
  totalTrades?: number;
  totalVolume?: number;
}

export const useWallet = () => {
  const solanaWallet = useSolanaWallet();
  const [walletUser, setWalletUser] = useState<WalletUser | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Track wallet in Firestore when connected
  useEffect(() => {
    const trackWallet = async () => {
      if (!solanaWallet.publicKey || isTracking) return;

      setIsTracking(true);
      const walletAddress = solanaWallet.publicKey.toBase58();

      try {
        // Use walletService to get or create wallet user
        const existingUser = await walletService.getByAddress(walletAddress);
        
        if (existingUser) {
          // Don't update lastActive on initial connection - only read existing data
          setWalletUser({
            walletAddress,
            email: existingUser.email,
            name: existingUser.name,
            avatar: existingUser.avatar,
            createdAt: existingUser.createdAt?.toDate() || new Date(),
            lastActive: existingUser.lastActive?.toDate() || new Date(),
            totalTrades: existingUser.totalTrades || 0,
            totalVolume: existingUser.totalVolume || 0,
          });
        } else {
          // Create new wallet user (lastActive will be set on creation)
          // Use userService to specify sign-up method
          const { userService } = await import('@/lib/firestore');
          await userService.upsert(walletAddress, 'wallet', {
            walletAddress,
            totalTrades: 0,
            totalVolume: 0,
          });

          // Fetch the newly created user to get all fields (including timestamps from Firestore)
          const createdUser = await userService.getByIdentifier(walletAddress);
          
          if (createdUser) {
            setWalletUser({
              walletAddress,
              email: createdUser.email,
              name: createdUser.name,
              avatar: createdUser.avatar,
              createdAt: createdUser.createdAt?.toDate() || new Date(),
              lastActive: createdUser.lastActive?.toDate() || new Date(),
              totalTrades: createdUser.totalTrades || 0,
              totalVolume: createdUser.totalVolume || 0,
            });
          } else {
            // Fallback if fetch fails
            const newUser: WalletUser = {
              walletAddress,
              createdAt: new Date(),
              lastActive: new Date(),
              totalTrades: 0,
              totalVolume: 0,
            };
            setWalletUser(newUser);
          }
        }
      } catch (error) {
        console.error('Error tracking wallet:', error);
      } finally {
        setIsTracking(false);
      }
    };

    if (solanaWallet.connected && solanaWallet.publicKey) {
      trackWallet();
    } else {
      setWalletUser(null);
      setIsTracking(false);
    }
  }, [solanaWallet.connected, solanaWallet.publicKey, isTracking]);

  // Update wallet user profile
  const updateWalletProfile = async (updates: {
    email?: string;
    name?: string;
    avatar?: string;
  }) => {
    if (!solanaWallet.publicKey) return;

    const walletAddress = solanaWallet.publicKey.toBase58();

    try {
      // Don't update lastActive when updating profile
      await walletService.upsert(walletAddress, {
        ...updates,
        updateLastActive: false,
      });
      setWalletUser((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (error) {
      console.error('Error updating wallet profile:', error);
      throw error;
    }
  };

  // Update last active timestamp (call this explicitly when needed)
  const updateLastActive = async () => {
    if (!solanaWallet.publicKey) return;
    const walletAddress = solanaWallet.publicKey.toBase58();
    try {
      await walletService.updateLastActive(walletAddress);
    } catch (error) {
      console.error('Error updating last active:', error);
    }
  };

  return {
    ...solanaWallet,
    walletUser,
    updateWalletProfile,
    updateLastActive,
    isTracking,
  };
};

