import { useState, useEffect, useCallback } from 'react';
import { TopNav } from '@/components/TopNav';
import { LeftSidebar } from '@/components/LeftSidebar';
import { MarketColumn } from '@/components/MarketColumn';
import { MarketCard } from '@/components/MarketCard';
import { CreateMarketModal } from '@/components/CreateMarketModal';
import { MobileTabs } from '@/components/MobileTabs';
import { initialMarkets, Market } from '@/lib/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence } from 'framer-motion';

const Index = () => {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [priceFlashes, setPriceFlashes] = useState<Record<string, 'yes' | 'no' | null>>({});
  const [positions, setPositions] = useState<Array<{ marketId: string; side: 'yes' | 'no'; amount: number }>>([]);
  const { toast } = useToast();

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) => {
        const updated = [...prev];
        // Randomly update 2-4 markets
        const numUpdates = Math.floor(Math.random() * 3) + 2;
        const indices = new Set<number>();
        
        while (indices.size < numUpdates) {
          indices.add(Math.floor(Math.random() * updated.length));
        }

        const newFlashes: Record<string, 'yes' | 'no' | null> = {};

        indices.forEach((idx) => {
          const market = updated[idx];
          const delta = (Math.random() - 0.5) * 0.04; // ±2%
          const newYesPrice = Math.max(0.01, Math.min(0.99, market.yesPrice + delta));
          
          updated[idx] = {
            ...market,
            yesPrice: Number(newYesPrice.toFixed(2)),
            noPrice: Number((1 - newYesPrice).toFixed(2)),
            volume: market.volume + Math.floor(Math.random() * 500),
          };

          newFlashes[market.id] = delta > 0 ? 'yes' : 'no';
        });

        setPriceFlashes(newFlashes);
        setTimeout(() => setPriceFlashes({}), 600);

        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleBuy = useCallback((marketId: string, side: 'yes' | 'no', amount: number) => {
    setPositions((prev) => [...prev, { marketId, side, amount }]);
  }, []);

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

  const newMarkets = markets.filter((m) => m.status === 'new');
  const endingMarkets = markets.filter((m) => m.status === 'ending');
  const resolvedMarkets = markets.filter((m) => m.status === 'resolved');

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <TopNav onCreateMarket={() => setIsCreateModalOpen(true)} />

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left Sidebar - Desktop only */}
        <LeftSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Desktop: 3 columns */}
          <div className="hidden lg:grid lg:grid-cols-3 h-full divide-x divide-border">
            <MarketColumn
              title="NEW MARKETS"
              subtitle="Just launched — trade YES/NO instantly"
              markets={newMarkets}
              onBuy={handleBuy}
              priceFlashes={priceFlashes}
              selectedCategory={selectedCategory}
            />
            <MarketColumn
              title="ENDING SOON"
              subtitle="Close to resolution — high attention"
              markets={endingMarkets}
              onBuy={handleBuy}
              priceFlashes={priceFlashes}
              selectedCategory={selectedCategory}
            />
            <MarketColumn
              title="RESOLVED / LEGENDS"
              subtitle="Finished markets — top callers & stats"
              markets={resolvedMarkets}
              onBuy={handleBuy}
              priceFlashes={priceFlashes}
              selectedCategory={selectedCategory}
            />
          </div>

          {/* Mobile: Tabs */}
          <div className="lg:hidden h-full">
            <MobileTabs
              labels={['New', 'Ending', 'Resolved']}
            >
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {newMarkets
                      .filter((m) => !selectedCategory || m.category === selectedCategory)
                      .map((market) => (
                        <MarketCard
                          key={market.id}
                          market={market}
                          onBuy={handleBuy}
                          priceFlash={priceFlashes[market.id]}
                        />
                      ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {endingMarkets
                      .filter((m) => !selectedCategory || m.category === selectedCategory)
                      .map((market) => (
                        <MarketCard
                          key={market.id}
                          market={market}
                          onBuy={handleBuy}
                          priceFlash={priceFlashes[market.id]}
                        />
                      ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {resolvedMarkets
                      .filter((m) => !selectedCategory || m.category === selectedCategory)
                      .map((market) => (
                        <MarketCard
                          key={market.id}
                          market={market}
                          onBuy={handleBuy}
                          priceFlash={priceFlashes[market.id]}
                        />
                      ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </MobileTabs>
          </div>
        </main>
      </div>

      <CreateMarketModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateMarket}
      />
    </div>
  );
};

export default Index;
