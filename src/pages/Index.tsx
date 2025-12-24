import { useState, useEffect, useCallback } from 'react';
import { TopNav, User } from '@/components/TopNav';
import { BottomBar } from '@/components/BottomBar';
import { MarketColumn } from '@/components/MarketColumn';
import { CreateMarketModal } from '@/components/CreateMarketModal';
import { LoginPage } from '@/components/LoginPage';
import { TradingPage } from '@/components/TradingPage';
import { MobileTabs } from '@/components/MobileTabs';
import { MarketsPage } from '@/components/MarketsPage';
import { PortfolioPage } from '@/components/PortfolioPage';
import { RewardsPage } from '@/components/RewardsPage';
import { initialMarkets, Market } from '@/lib/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarketRow } from '@/components/MarketRow';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { useWallet } from '@/hooks/useWallet';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Index = () => {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [tradingMarket, setTradingMarket] = useState<Market | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number } | undefined>();

  const handleOpenCreateModal = () => {
    const btn = document.getElementById('create-market-btn');
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setButtonPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    setIsCreateModalOpen(true);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowLoginPage(false);
    setShouldAutoLogin(true); // Re-enable auto-login after manual login
    toast({
      title: 'Welcome!',
      description: `Signed in as ${userData.email}`,
    });
  };

  const { disconnect, connected, publicKey, walletUser, updateLastActive } = useWallet();
  const [shouldAutoLogin, setShouldAutoLogin] = useState(true);
  const { toast } = useToast();

  // Handle wallet connection auto-login (separate from Firebase Auth)
  useEffect(() => {
    if (shouldAutoLogin && connected && publicKey && walletUser && !user) {
      // Wallet is connected and user data is available
      const walletUserData: User = {
        email: walletUser.email || '',
        name: walletUser.name || `Wallet ${publicKey.toBase58().slice(0, 4)}`,
        avatar: walletUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${publicKey.toBase58()}&backgroundColor=b6e3f4`,
      };
      setUser(walletUserData);
      setShowLoginPage(false);
      toast({
        title: 'Wallet Connected',
        description: `Signed in with wallet ${publicKey.toBase58().slice(0, 4)}...`,
      });
    }
  }, [shouldAutoLogin, connected, publicKey, walletUser?.walletAddress, user, toast]);

  // Listen for Firebase Auth state changes (auto-login for authenticated users)
  // Only handle Firebase Auth users (email/Google), not wallet users
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Only handle Firebase Auth users, not wallet-only users
      if (firebaseUser && shouldAutoLogin && !user && !publicKey) {
        // User is authenticated with Firebase, auto-login
        const userData: User = {
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}&backgroundColor=b6e3f4`,
        };
        
        // Determine sign-up method and save to Firestore
        if (firebaseUser.email) {
          try {
            const { userService } = await import('@/lib/firestore');
            // Check provider to determine sign-up method
            const providerId = firebaseUser.providerData[0]?.providerId;
            const signUpMethod = providerId === 'google.com' ? 'google' : 'email';
            
            await userService.upsert(firebaseUser.email, signUpMethod, {
              email: userData.email,
              name: userData.name,
              avatar: userData.avatar,
              updateLastActive: false,
            });
          } catch (error) {
            console.error('Error updating Firestore user on auth state change:', error);
          }
        }
        
        setUser(userData);
        setShowLoginPage(false);
      } else if (!firebaseUser && user && !publicKey) {
        // User logged out from Firebase, clear local state (only if not wallet user)
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [shouldAutoLogin, user, publicKey]);

  const handleLogout = async () => {
      // Update lastActive timestamp before disconnecting
    // Check if user is logged in via wallet, email, or Google
    if (publicKey && walletUser) {
      // Wallet user
      try {
        await updateLastActive();
      } catch (error) {
        console.error('Error updating last active:', error);
      }
    } else if (user?.email) {
      // Email or Google user
      try {
        const { userService } = await import('@/lib/firestore');
        await userService.updateLastActive(user.email);
      } catch (error) {
        console.error('Error updating last active:', error);
      }
    }

    // Sign out from Firebase Auth
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    }

    // Disconnect wallet
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
    
    // Clear user state and prevent auto-login
    setUser(null);
    setShouldAutoLogin(false);
    
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
  };

  const [priceFlashes, setPriceFlashes] = useState<Record<string, boolean>>({});
  const [activeView, setActiveView] = useState<string>('Discover');

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) => {
        const updated = [...prev];
        const numUpdates = Math.floor(Math.random() * 3) + 2;
        const indices = new Set<number>();
        
        while (indices.size < numUpdates) {
          indices.add(Math.floor(Math.random() * updated.length));
        }

        const newFlashes: Record<string, boolean> = {};

        indices.forEach((idx) => {
          const market = updated[idx];
          const delta = (Math.random() - 0.5) * 0.04;
          const newYesPrice = Math.max(0.01, Math.min(0.99, market.yesPrice + delta));
          
          updated[idx] = {
            ...market,
            yesPrice: Number(newYesPrice.toFixed(2)),
            noPrice: Number((1 - newYesPrice).toFixed(2)),
            volume: market.volume + Math.floor(Math.random() * 500),
          };

          newFlashes[market.id] = true;
        });

        setPriceFlashes(newFlashes);
        setTimeout(() => setPriceFlashes({}), 150);

        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Update selected market when prices change
  useEffect(() => {
    if (selectedMarket) {
      const updated = markets.find(m => m.id === selectedMarket.id);
      if (updated) setSelectedMarket(updated);
    }
    if (tradingMarket) {
      const updated = markets.find(m => m.id === tradingMarket.id);
      if (updated) setTradingMarket(updated);
    }
  }, [markets, selectedMarket?.id, tradingMarket?.id]);

  const handleCreateMarket = useCallback((marketData: Omit<Market, 'id' | 'yesPrice' | 'noPrice' | 'volume' | 'traders' | 'createdAt' | 'status'>) => {
    const newMarket: Market = {
      id: `market-new-${Date.now()}`,
      yesPrice: 0.5,
      noPrice: 0.5,
      volume: 0,
      traders: 0,
      createdAt: new Date(),
      status: 'new',
      ...marketData,
    };

    setMarkets((prev) => [newMarket, ...prev]);
    
    toast({
      title: 'Market Created',
      description: 'Your market is now live!',
    });
  }, [toast]);

  const handleSelectMarket = (market: Market) => {
    setSelectedMarket(market);
    setTradingMarket(market);
  };

  const handleToggleWatchlist = useCallback((marketId: string) => {
    setMarkets((prev) =>
      prev.map((m) =>
        m.id === marketId ? { ...m, isWatchlisted: !m.isWatchlisted } : m
      )
    );
  }, []);

  const handleCloseTradingPage = () => {
    setTradingMarket(null);
  };

  const handleNavigate = (view: string) => {
    setActiveView(view);
  };

  const newMarkets = markets.filter((m) => m.status === 'new');
  const endingMarkets = markets.filter((m) => m.status === 'ending');
  const resolvedMarkets = markets.filter((m) => m.status === 'resolved');

  // Show full-page login
  if (showLoginPage) {
    return (
      <AnimatePresence mode="wait">
        <LoginPage 
          onLogin={handleLogin}
          onBack={() => {
            setShowLoginPage(false);
            setShouldAutoLogin(true); // Re-enable auto-login when closing login page
          }}
          shouldAutoLogin={shouldAutoLogin}
        />
      </AnimatePresence>
    );
  }

  // If a trading market is selected, show the full-page trading terminal
  if (tradingMarket) {
    return (
      <AnimatePresence mode="wait">
        <TradingPage 
          key={tradingMarket.id}
          market={tradingMarket} 
          onBack={handleCloseTradingPage}
          onNavigate={(view) => {
            setActiveView(view);
            setTradingMarket(null);
          }}
          activeView="Discover"
          watchlistMarkets={markets.filter(m => m.isWatchlisted)}
          onRemoveFromWatchlist={handleToggleWatchlist}
          onSelectMarket={handleSelectMarket}
          onCreateMarket={handleOpenCreateModal}
          user={user}
          onLoginClick={() => {
            setShowLoginPage(true);
            setShouldAutoLogin(true);
          }}
          onLogout={handleLogout}
        />
        <CreateMarketModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateMarket}
          buttonPosition={buttonPosition}
        />
      </AnimatePresence>
    );
  }

  // Markets Page View
  if (activeView === 'Markets') {
    return (
      <LayoutGroup>
        <div className="min-h-screen flex flex-col">
        <TopNav 
          onCreateMarket={handleOpenCreateModal}
          onDiscover={() => setActiveView('Discover')}
          onNavigate={handleNavigate}
          activeView={activeView}
          watchlistMarkets={markets.filter(m => m.isWatchlisted)}
          onRemoveFromWatchlist={handleToggleWatchlist}
          onSelectMarket={handleSelectMarket}
          user={user}
          onLoginClick={() => {
            setShowLoginPage(true);
            setShouldAutoLogin(true);
          }}
          onLogout={handleLogout}
        />
        <MarketsPage 
          markets={markets}
          onBack={() => setActiveView('Discover')}
          onSelectMarket={handleSelectMarket}
        />
        <CreateMarketModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateMarket}
          buttonPosition={buttonPosition}
        />
        </div>
      </LayoutGroup>
    );
  }

  // Portfolio Page View
  if (activeView === 'Portfolio') {
    return (
      <LayoutGroup>
        <div className="min-h-screen flex flex-col">
        <TopNav 
          onCreateMarket={handleOpenCreateModal}
          onDiscover={() => setActiveView('Discover')}
          onNavigate={handleNavigate}
          activeView={activeView}
          watchlistMarkets={markets.filter(m => m.isWatchlisted)}
          onRemoveFromWatchlist={handleToggleWatchlist}
          onSelectMarket={handleSelectMarket}
          user={user}
          onLoginClick={() => {
            setShowLoginPage(true);
            setShouldAutoLogin(true);
          }}
          onLogout={handleLogout}
        />
        <PortfolioPage onSelectMarket={handleSelectMarket} />
        <CreateMarketModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateMarket}
          buttonPosition={buttonPosition}
        />
        </div>
      </LayoutGroup>
    );
  }

  // Rewards Page View
  if (activeView === 'Rewards') {
    return (
      <LayoutGroup>
        <div className="min-h-screen flex flex-col">
        <TopNav 
          onCreateMarket={handleOpenCreateModal}
          onDiscover={() => setActiveView('Discover')}
          onNavigate={handleNavigate}
          activeView={activeView}
          watchlistMarkets={markets.filter(m => m.isWatchlisted)}
          onRemoveFromWatchlist={handleToggleWatchlist}
          onSelectMarket={handleSelectMarket}
          user={user}
          onLoginClick={() => {
            setShowLoginPage(true);
            setShouldAutoLogin(true);
          }}
          onLogout={handleLogout}
        />
        <RewardsPage />
        <CreateMarketModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateMarket}
          buttonPosition={buttonPosition}
        />
        </div>
      </LayoutGroup>
    );
  }

  // Discover View (default)
  return (
    <LayoutGroup>
      <div className="min-h-screen flex flex-col">
      <TopNav 
        onCreateMarket={handleOpenCreateModal}
        onDiscover={() => setActiveView('Discover')}
        onNavigate={handleNavigate}
        activeView={activeView}
        watchlistMarkets={markets.filter(m => m.isWatchlisted)}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onSelectMarket={handleSelectMarket}
        user={user}
        onLoginClick={() => setShowLoginPage(true)}
        onLogout={handleLogout}
      />

      {/* Main Content - Full Width */}
      <main className="flex-1 px-4 md:px-6 2xl:px-8 py-4 pb-20">
        {/* Desktop: 3 columns - with more space at bottom */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-3 h-[calc(100vh-8.5rem)]">
          <MarketColumn
            title="NEW"
            markets={newMarkets}
            selectedMarketId={selectedMarket?.id ?? null}
            onSelectMarket={handleSelectMarket}
            priceFlashes={priceFlashes}
            selectedCategory={selectedCategory}
            onToggleWatchlist={handleToggleWatchlist}
          />
          <MarketColumn
            title="ENDING"
            markets={endingMarkets}
            selectedMarketId={selectedMarket?.id ?? null}
            onSelectMarket={handleSelectMarket}
            priceFlashes={priceFlashes}
            selectedCategory={selectedCategory}
            onToggleWatchlist={handleToggleWatchlist}
          />
          <MarketColumn
            title="RESOLVED"
            markets={resolvedMarkets}
            selectedMarketId={selectedMarket?.id ?? null}
            onSelectMarket={handleSelectMarket}
            priceFlashes={priceFlashes}
            selectedCategory={selectedCategory}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </div>

        {/* Mobile: Tabs */}
        <div className="lg:hidden h-[calc(100vh-8.5rem)]">
          <MobileTabs labels={['New', 'Ending', 'Resolved']}>
            <ScrollArea className="h-full">
              <div className="bg-panel2 rounded-lg border border-stroke">
                <AnimatePresence mode="popLayout">
                  {newMarkets
                    .filter((m) => !selectedCategory || m.category === selectedCategory)
                    .map((market) => (
                      <motion.div
                        key={market.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <MarketRow
                          market={market}
                          isSelected={selectedMarket?.id === market.id}
                          onSelect={() => handleSelectMarket(market)}
                          priceFlash={priceFlashes[market.id]}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <ScrollArea className="h-full">
              <div className="bg-panel2 rounded-lg border border-stroke">
                <AnimatePresence mode="popLayout">
                  {endingMarkets
                    .filter((m) => !selectedCategory || m.category === selectedCategory)
                    .map((market) => (
                      <motion.div
                        key={market.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <MarketRow
                          market={market}
                          isSelected={selectedMarket?.id === market.id}
                          onSelect={() => handleSelectMarket(market)}
                          priceFlash={priceFlashes[market.id]}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <ScrollArea className="h-full">
              <div className="bg-panel2 rounded-lg border border-stroke">
                <AnimatePresence mode="popLayout">
                  {resolvedMarkets
                    .filter((m) => !selectedCategory || m.category === selectedCategory)
                    .map((market) => (
                      <motion.div
                        key={market.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <MarketRow
                          market={market}
                          isSelected={selectedMarket?.id === market.id}
                          onSelect={() => handleSelectMarket(market)}
                          priceFlash={priceFlashes[market.id]}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </MobileTabs>
        </div>
      </main>

      <BottomBar
        selectedMarket={selectedMarket}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onClearSelection={() => setSelectedMarket(null)}
      />

      <CreateMarketModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateMarket}
        buttonPosition={buttonPosition}
      />
      </div>
    </LayoutGroup>
  );
};

export default Index;
