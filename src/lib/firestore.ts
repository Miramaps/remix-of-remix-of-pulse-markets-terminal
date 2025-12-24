// Firestore service utilities for Pulse Markets
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  QueryConstraint,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { Market } from "./mockData";

// Collection names
export const COLLECTIONS = {
  MARKETS: "markets",
  TRADES: "trades",
  PORTFOLIOS: "portfolios",
  WATCHLISTS: "watchlists",
  USERS: "users",
  STATISTICS: "statistics",
} as const;

// Type conversions for Firestore
export const convertMarketToFirestore = (market: Market) => {
  return {
    question: market.question,
    category: market.category,
    yesPrice: market.yesPrice,
    noPrice: market.noPrice,
    volume: market.volume,
    traders: market.traders,
    createdAt: Timestamp.fromDate(market.createdAt),
    resolvesAt: Timestamp.fromDate(market.resolvesAt),
    status: market.status,
    shares: market.shares,
    isWatchlisted: market.isWatchlisted || false,
    priceChange: market.priceChange || 0,
    sentiment: market.sentiment || 50,
    sourceUrl: market.sourceUrl || null,
    liquidity: market.liquidity || 0,
  };
};

export const convertMarketFromFirestore = (
  docData: DocumentData,
  id: string
): Market => {
  const data = docData;
  return {
    id,
    question: data.question,
    category: data.category,
    yesPrice: data.yesPrice,
    noPrice: data.noPrice,
    volume: data.volume,
    traders: data.traders,
    createdAt: data.createdAt?.toDate() || new Date(),
    resolvesAt: data.resolvesAt?.toDate() || new Date(),
    status: data.status,
    shares: data.shares || 0,
    isWatchlisted: data.isWatchlisted || false,
    priceChange: data.priceChange || 0,
    sentiment: data.sentiment || 50,
    sourceUrl: data.sourceUrl,
    liquidity: data.liquidity,
  };
};

// Market operations
export const marketsService = {
  // Get all markets
  getAll: async (constraints: QueryConstraint[] = []) => {
    const marketsRef = collection(db, COLLECTIONS.MARKETS);
    const q = query(marketsRef, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) =>
      convertMarketFromFirestore(doc.data(), doc.id)
    );
  },

  // Get market by ID
  getById: async (marketId: string): Promise<Market | null> => {
    const marketRef = doc(db, COLLECTIONS.MARKETS, marketId);
    const snapshot = await getDoc(marketRef);
    if (!snapshot.exists()) return null;
    return convertMarketFromFirestore(snapshot.data(), snapshot.id);
  },

  // Create new market
  create: async (market: Omit<Market, "id">, userId: string) => {
    const marketsRef = collection(db, COLLECTIONS.MARKETS);
    const marketData = {
      ...convertMarketToFirestore(market as Market),
      createdBy: userId,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(marketsRef, marketData);
    return docRef.id;
  },

  // Update market
  update: async (marketId: string, updates: Partial<Market>) => {
    const marketRef = doc(db, COLLECTIONS.MARKETS, marketId);
    const updateData: any = {};
    
    if (updates.yesPrice !== undefined) updateData.yesPrice = updates.yesPrice;
    if (updates.noPrice !== undefined) updateData.noPrice = updates.noPrice;
    if (updates.volume !== undefined) updateData.volume = updates.volume;
    if (updates.traders !== undefined) updateData.traders = updates.traders;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.shares !== undefined) updateData.shares = updates.shares;
    if (updates.priceChange !== undefined) updateData.priceChange = updates.priceChange;
    if (updates.sentiment !== undefined) updateData.sentiment = updates.sentiment;
    if (updates.liquidity !== undefined) updateData.liquidity = updates.liquidity;
    
    await updateDoc(marketRef, updateData);
  },

  // Delete market
  delete: async (marketId: string) => {
    const marketRef = doc(db, COLLECTIONS.MARKETS, marketId);
    await deleteDoc(marketRef);
  },

  // Subscribe to markets (real-time)
  subscribe: (
    callback: (markets: Market[]) => void,
    constraints: QueryConstraint[] = []
  ) => {
    const marketsRef = collection(db, COLLECTIONS.MARKETS);
    const q = query(marketsRef, ...constraints);
    
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const markets = snapshot.docs.map((doc) =>
        convertMarketFromFirestore(doc.data(), doc.id)
      );
      callback(markets);
    });
  },

  // Subscribe to single market (real-time)
  subscribeById: (
    marketId: string,
    callback: (market: Market | null) => void
  ) => {
    const marketRef = doc(db, COLLECTIONS.MARKETS, marketId);
    
    return onSnapshot(marketRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback(convertMarketFromFirestore(snapshot.data(), snapshot.id));
    });
  },
};

// Trade operations
export const tradesService = {
  // Get user's trades
  getByUser: async (userId: string) => {
    const tradesRef = collection(db, COLLECTIONS.TRADES);
    const q = query(
      tradesRef,
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Create trade
  create: async (tradeData: {
    userId: string;
    marketId: string;
    side: "YES" | "NO";
    amount: number;
    price: number;
    shares: number;
  }) => {
    const tradesRef = collection(db, COLLECTIONS.TRADES);
    const trade = {
      ...tradeData,
      timestamp: Timestamp.now(),
    };
    const docRef = await addDoc(tradesRef, trade);
    return docRef.id;
  },
};

// Watchlist operations
export const watchlistService = {
  // Get user's watchlist
  getByUser: async (userId: string): Promise<string[]> => {
    const watchlistRef = doc(db, COLLECTIONS.WATCHLISTS, userId);
    const snapshot = await getDoc(watchlistRef);
    if (!snapshot.exists()) return [];
    return snapshot.data().marketIds || [];
  },

  // Add market to watchlist
  add: async (userId: string, marketId: string) => {
    const watchlistRef = doc(db, COLLECTIONS.WATCHLISTS, userId);
    const snapshot = await getDoc(watchlistRef);
    
    if (snapshot.exists()) {
      const currentIds = snapshot.data().marketIds || [];
      if (!currentIds.includes(marketId)) {
        await updateDoc(watchlistRef, {
          marketIds: [...currentIds, marketId],
        });
      }
    } else {
      await addDoc(collection(db, COLLECTIONS.WATCHLISTS), {
        userId,
        marketIds: [marketId],
      });
    }
  },

  // Remove market from watchlist
  remove: async (userId: string, marketId: string) => {
    const watchlistRef = doc(db, COLLECTIONS.WATCHLISTS, userId);
    const snapshot = await getDoc(watchlistRef);
    
    if (snapshot.exists()) {
      const currentIds = snapshot.data().marketIds || [];
      await updateDoc(watchlistRef, {
        marketIds: currentIds.filter((id: string) => id !== marketId),
      });
    }
  },

  // Subscribe to watchlist (real-time)
  subscribe: (userId: string, callback: (marketIds: string[]) => void) => {
    const watchlistRef = doc(db, COLLECTIONS.WATCHLISTS, userId);
    
    return onSnapshot(watchlistRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      callback(snapshot.data().marketIds || []);
    });
  },
};

// Portfolio operations
export const portfolioService = {
  // Get user's portfolio
  getByUser: async (userId: string) => {
    const portfolioRef = doc(db, COLLECTIONS.PORTFOLIOS, userId);
    const snapshot = await getDoc(portfolioRef);
    if (!snapshot.exists()) return null;
    return snapshot.data();
  },

  // Update portfolio
  update: async (userId: string, portfolioData: any) => {
    const portfolioRef = doc(db, COLLECTIONS.PORTFOLIOS, userId);
    const snapshot = await getDoc(portfolioRef);
    
    if (snapshot.exists()) {
      await updateDoc(portfolioRef, {
        ...portfolioData,
        lastUpdated: Timestamp.now(),
      });
    } else {
      await addDoc(collection(db, COLLECTIONS.PORTFOLIOS), {
        userId,
        ...portfolioData,
        lastUpdated: Timestamp.now(),
      });
    }
  },

  // Subscribe to portfolio (real-time)
  subscribe: (userId: string, callback: (portfolio: any) => void) => {
    const portfolioRef = doc(db, COLLECTIONS.PORTFOLIOS, userId);
    
    return onSnapshot(portfolioRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback(snapshot.data());
    });
  },
};

// User sign-up methods
export type SignUpMethod = 'wallet' | 'email' | 'google';

// User operations - unified service for all sign-up methods
export const userService = {
  // Get user by identifier (wallet address, email, or gmail)
  getByIdentifier: async (identifier: string) => {
    const userRef = doc(db, COLLECTIONS.USERS, identifier);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  },

  // Create or update user with sign-up method tracking
  upsert: async (
    identifier: string, // wallet address, email, or gmail
    signUpMethod: SignUpMethod,
    userData: {
      email?: string;
      name?: string;
      avatar?: string;
      walletAddress?: string; // For wallet sign-ups
      totalTrades?: number;
      totalVolume?: number;
      updateLastActive?: boolean;
    }
  ) => {
    const userRef = doc(db, COLLECTIONS.USERS, identifier);
    const snapshot = await getDoc(userRef);
    
    const updateData: any = {
      signUpMethod, // Track how user signed up
      ...userData,
    };

    // Add identifier based on sign-up method
    if (signUpMethod === 'wallet') {
      updateData.walletAddress = identifier;
    } else if (signUpMethod === 'email' || signUpMethod === 'google') {
      updateData.email = identifier;
    }

    // Only update lastActive if explicitly requested
    if (userData.updateLastActive) {
      updateData.lastActive = Timestamp.now();
    }

    if (snapshot.exists()) {
      // Update existing user - preserve existing signUpMethod (don't overwrite it)
      const existingData = snapshot.data();
      if (existingData.signUpMethod) {
        updateData.signUpMethod = existingData.signUpMethod;
      }
      
      // Remove updateLastActive from the update data (it's not a field in Firestore)
      const { updateLastActive, ...firestoreData } = updateData;
      await updateDoc(userRef, firestoreData);
    } else {
      // Create new user - always set signUpMethod on creation
      await setDoc(userRef, {
        ...updateData,
        signUpMethod, // Always set on creation
        createdAt: Timestamp.now(),
        lastActive: Timestamp.now(), // Always set on creation
        totalTrades: userData.totalTrades || 0,
        totalVolume: userData.totalVolume || 0,
      });
    }
  },

  // Update last active timestamp
  updateLastActive: async (identifier: string) => {
    const userRef = doc(db, COLLECTIONS.USERS, identifier);
    const snapshot = await getDoc(userRef);
    
    if (snapshot.exists()) {
      await updateDoc(userRef, {
        lastActive: Timestamp.now(),
      });
    }
  },

  // Subscribe to user data (real-time)
  subscribe: (identifier: string, callback: (user: any) => void) => {
    const userRef = doc(db, COLLECTIONS.USERS, identifier);
    
    return onSnapshot(userRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback({ id: snapshot.id, ...snapshot.data() });
    });
  },
};

// Legacy wallet service (for backward compatibility)
export const walletService = {
  // Get user by wallet address
  getByAddress: async (walletAddress: string) => {
    return userService.getByIdentifier(walletAddress);
  },

  // Create or update wallet user
  upsert: async (walletAddress: string, userData: {
    email?: string;
    name?: string;
    avatar?: string;
    totalTrades?: number;
    totalVolume?: number;
    updateLastActive?: boolean;
  }) => {
    return userService.upsert(walletAddress, 'wallet', {
      ...userData,
      walletAddress,
    });
  },

  // Update last active timestamp
  updateLastActive: async (walletAddress: string) => {
    return userService.updateLastActive(walletAddress);
  },

  // Subscribe to user data (real-time)
  subscribe: (walletAddress: string, callback: (user: any) => void) => {
    return userService.subscribe(walletAddress, callback);
  },
};

// Query helpers
export const queryHelpers = {
  // Get markets by status
  byStatus: (status: Market["status"]) => where("status", "==", status),
  
  // Get markets by category
  byCategory: (category: Market["category"]) => where("category", "==", category),
  
  // Order by volume
  orderByVolume: (direction: "asc" | "desc" = "desc") => orderBy("volume", direction),
  
  // Order by created date
  orderByCreated: (direction: "asc" | "desc" = "desc") => orderBy("createdAt", direction),
  
  // Order by resolves date
  orderByResolves: (direction: "asc" | "desc" = "asc") => orderBy("resolvesAt", direction),
  
  // Limit results
  limitResults: (count: number) => limit(count),
};

