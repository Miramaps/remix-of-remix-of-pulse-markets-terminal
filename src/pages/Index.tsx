import { useState, useEffect, useCallback } from 'react';
import { TopNav } from '@/components/TopNav';
import { BottomBar } from '@/components/BottomBar';
import { MarketsView } from '@/components/MarketsView';
import { CreateMarketModal } from '@/components/CreateMarketModal';
import { TradingPage } from '@/components/TradingPage';
import { initialMarkets, Market } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence } from 'framer-motion';

const Index = () => {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [tradingMarket, setTradingMarket] = useState<Market | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [priceFlashes, setPriceFlashes] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

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

  // If a trading market is selected, show the full-page trading terminal
  if (tradingMarket) {
    return (
      <AnimatePresence mode="wait">
        <TradingPage 
          key={tradingMarket.id}
          market={tradingMarket} 
          onBack={handleCloseTradingPage} 
        />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(220,15%,6%)]">
      <TopNav 
        onCreateMarket={() => setIsCreateModalOpen(true)}
        watchlistMarkets={markets.filter(m => m.isWatchlisted)}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onSelectMarket={handleSelectMarket}
      />

      {/* Markets View */}
      <MarketsView 
        markets={markets}
        onSelectMarket={handleSelectMarket}
        priceFlashes={priceFlashes}
      />

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
      />
    </div>
  );
};

export default Index;
