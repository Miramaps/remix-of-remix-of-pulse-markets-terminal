import { useState } from 'react';
import { ChevronDown, Wallet, Plus, Star, TrendingUp, TrendingDown, Activity, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
    <header className="sticky top-0 z-50 bg-transparent pt-3 px-4 md:px-6 2xl:px-8 shrink-0">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Section: Logo + Nav Links */}
        <div className="flex items-center gap-3 h-11 px-4 rounded-full bg-[hsl(220_20%_12%)] border border-primary/20 shadow-lg shadow-primary/5">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={onDiscover}
          >
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-[10px]">P</span>
            </div>
            <span className="font-display font-semibold text-light tracking-tight text-xs hidden sm:block">
              PULSE
            </span>
          </div>

          <div className="w-px h-5 bg-primary/20 hidden lg:block" />

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`px-2.5 py-1 text-xs font-medium transition-all rounded-full ${
                  activeView === item 
                    ? 'text-primary-foreground bg-primary' 
                    : 'text-light-muted hover:text-light'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Create Button - standalone */}
        <motion.button
          id="create-market-btn"
          onClick={onCreateMarket}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/40 flex items-center justify-center relative"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 50px hsl(210 100% 50% / 0.5)"
          }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/50"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.button>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 h-11 px-4 rounded-full bg-[hsl(220_20%_12%)] border border-primary/20 shadow-lg shadow-primary/5">
          {/* Watchlist Button with Popover */}
          <Popover open={watchlistOpen} onOpenChange={setWatchlistOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 gap-1 text-light-muted hover:text-light hover:bg-primary/10 text-xs px-2 relative rounded-full"
              >
                <Star className={`w-3.5 h-3.5 ${watchlistCount > 0 ? 'fill-primary text-primary' : ''}`} />
                <span className="hidden sm:inline">Watchlist</span>
                {watchlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 px-0.5 flex items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {watchlistCount > 99 ? '99+' : watchlistCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              align="end" 
              className="w-96 p-0 bg-panel border-stroke rounded-xl shadow-2xl overflow-hidden"
            >
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
                <ScrollArea className="max-h-[400px]">
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
                            <p className="text-sm font-medium text-light line-clamp-2 leading-tight mb-2 hover:text-accent transition-colors">
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
            </PopoverContent>
          </Popover>

          <div className="w-px h-5 bg-primary/20" />

          {/* Chain */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 gap-1 text-light-muted hover:text-light hover:bg-primary/10 text-xs px-2 rounded-full"
              >
                {chain}
                <ChevronDown className="w-3 h-3" />
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
            className="h-7 gap-1 text-xs px-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Connect</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
