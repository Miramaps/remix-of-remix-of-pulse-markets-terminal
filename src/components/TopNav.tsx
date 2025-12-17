import { useState } from 'react';
import { ChevronDown, Wallet, Plus, Star, TrendingUp, TrendingDown, Activity, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Market, formatVolume } from '@/lib/mockData';

interface TopNavProps {
  onCreateMarket: () => void;
  onDiscover?: () => void;
  onNavigate?: (view: string) => void;
  activeView?: string;
  watchlistMarkets?: Market[];
  onRemoveFromWatchlist?: (marketId: string) => void;
  onSelectMarket?: (market: Market) => void;
}

const navItems = ['Discover', 'Markets', 'Portfolio', 'Rewards'];

const getMarketImage = (market: Market): string => {
  const categoryImages: Record<Market['category'], string> = {
    crypto: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=1a1a2e,16213e,0f3460`,
    politics: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=2d132c,801336,c72c41`,
    sports: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=1b4332,2d6a4f,40916c`,
    pop: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=3c096c,5a189a,7b2cbf`,
    memes: `https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}&backgroundColor=ff6d00,ff8500,ff9100`,
  };
  return categoryImages[market.category];
};

export function TopNav({ 
  onCreateMarket, 
  onDiscover, 
  onNavigate,
  activeView = 'Discover',
  watchlistMarkets = [],
  onRemoveFromWatchlist,
  onSelectMarket,
}: TopNavProps) {
  const [chain, setChain] = useState<'SOL' | 'ETH'>('SOL');
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  const handleNavClick = (item: string) => {
    if (onNavigate) {
      onNavigate(item);
    }
    if (item === 'Discover' && onDiscover) {
      onDiscover();
    }
  };

  const watchlistCount = watchlistMarkets.length;

  return (
    <header className="sticky top-0 z-50 shrink-0">
      <div className="h-14 grid grid-cols-[1fr_auto_1fr] items-stretch">
        
        {/* Left Cluster - anchored to top-left */}
        <div className="justify-self-start w-fit bg-panel border-b border-r border-primary/20 rounded-br-2xl flex items-center gap-6 pl-4 md:pl-6 pr-2">
          <button
            className="text-light font-display font-bold text-base tracking-tight"
            onClick={onDiscover}
          >
            PULSEMARKETS
          </button>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeView === item;
              return (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={
                    "h-8 px-3.5 rounded-lg text-sm font-medium transition-all duration-200 " +
                    (isActive
                      ? "text-primary"
                      : "text-light-muted hover:text-light")
                  }
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center: + button floating with more space */}
        <div className="flex items-center justify-center px-10">
          <button
            id="create-market-btn"
            onClick={onCreateMarket}
            className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_28px_hsl(var(--primary)/0.65)] transition-shadow duration-300"
            aria-label="Create market"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Right Cluster - anchored to top-right */}
        <div className="justify-self-end w-fit bg-panel border-b border-l border-primary/20 rounded-bl-2xl flex items-center justify-end gap-2 pr-4 md:pr-6 pl-2">
          <DialogPrimitive.Root open={watchlistOpen} onOpenChange={setWatchlistOpen}>
            <DialogPrimitive.Trigger asChild>
              <Button
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1.5 text-light-muted hover:text-light hover:bg-row text-sm px-2.5 relative"
              >
                <Star className={`w-4 h-4 ${watchlistCount > 0 ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                <span className="hidden sm:inline">Watchlist</span>
                {watchlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-panel">
                    {watchlistCount > 99 ? '99+' : watchlistCount}
                  </span>
                )}
              </Button>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
              <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[384px] max-w-[calc(100vw-2rem)] h-[80vh] -translate-x-1/2 -translate-y-1/2 p-0 bg-panel-glass border border-stroke rounded-xl shadow-2xl flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-stroke bg-row/30">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-light">Your Watchlist</span>
                  </div>
                  <span className="text-xs text-light-muted bg-row px-2 py-0.5 rounded-full">
                    {watchlistCount} {watchlistCount === 1 ? 'market' : 'markets'}
                  </span>
                </div>

                {watchlistCount === 0 ? (
                  <div className="py-12 px-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-row/50 flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-light-muted/30" />
                    </div>
                    <p className="text-sm font-medium text-light mb-1">No markets yet</p>
                    <p className="text-xs text-light-muted">
                      Click the ⭐ on any market to track it here
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="flex-1">
                    <div className="divide-y divide-stroke/50">
                      {watchlistMarkets.map((market) => (
                        <div
                          key={market.id}
                          className="p-3 hover:bg-row/50 cursor-pointer transition-all duration-200"
                          onClick={() => {
                            onSelectMarket?.(market);
                            setWatchlistOpen(false);
                          }}
                        >
                          <div className="flex gap-3">
                            <div className="shrink-0">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-row/50 ring-1 ring-stroke/50">
                                <img 
                                  src={getMarketImage(market)} 
                                  alt={market.question}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-light line-clamp-2 leading-tight mb-2 hover:text-primary transition-colors">
                                {market.question}
                              </p>

                              <div className="flex items-center gap-3 mb-1.5">
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10">
                                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                                  <span className="text-xs font-semibold text-emerald-400 tabular-nums">
                                    YES {market.yesPrice.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10">
                                  <TrendingDown className="w-3 h-3 text-rose-400" />
                                  <span className="text-xs font-semibold text-rose-400 tabular-nums">
                                    NO {market.noPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-[10px] text-light-muted">
                                <span className="flex items-center gap-1">
                                  <Activity className="w-3 h-3" />
                                  {formatVolume(market.volume)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {market.traders}
                                </span>
                                <span className="capitalize px-1.5 py-0.5 rounded bg-row text-[9px] font-medium">
                                  {market.category}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFromWatchlist?.(market.id);
                              }}
                              className="shrink-0 self-start p-1.5 rounded-lg hover:bg-row text-yellow-400 hover:text-yellow-300 transition-all duration-200 hover:scale-110"
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>

          {/* Chain */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1.5 text-light-muted hover:text-light hover:bg-row text-sm px-2.5"
              >
                {chain}
                <ChevronDown className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-panel border-stroke rounded-lg min-w-[120px]">
              <DropdownMenuItem onClick={() => setChain('SOL')} className="text-light text-sm">
                <span className="mr-2 text-light-muted">◎</span> Solana
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChain('ETH')} className="text-light text-sm">
                <span className="mr-2 text-light-muted">Ξ</span> Ethereum
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Connect */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1.5 text-light-muted hover:text-light hover:bg-row text-sm px-3"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Connect</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
