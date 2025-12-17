import { useState } from 'react';
import { ChevronDown, Wallet, Plus, Star, TrendingUp, TrendingDown, Activity, Users } from 'lucide-react';
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
  watchlistMarkets?: Market[];
  onRemoveFromWatchlist?: (marketId: string) => void;
  onSelectMarket?: (market: Market) => void;
}


// Generate a deterministic placeholder image URL based on market id
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
  watchlistMarkets = [],
  onRemoveFromWatchlist,
  onSelectMarket,
}: TopNavProps) {
  const [chain, setChain] = useState<'SOL' | 'ETH'>('SOL');
  const [activeNav, setActiveNav] = useState('Markets');
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  const handleNavClick = (item: string) => {
    setActiveNav(item);
    if (item === 'Discover' && onDiscover) {
      onDiscover();
    }
  };

  const watchlistCount = watchlistMarkets.length;

  const leftNavItems = ['Discover', 'Markets'];
  const rightNavItems = ['Portfolio', 'Rewards'];

  return (
    <header className="sticky top-0 z-50 bg-[hsl(220,15%,8%)] border-b border-stroke shrink-0">
      <div className="h-14 px-4 md:px-6 2xl:px-8 flex items-center">
        {/* Left Section: Logo + Left Nav */}
        <div className="flex-1 flex items-center gap-6">
          <div 
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={onDiscover}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-[hsl(220,15%,8%)] font-display font-bold text-xs">P</span>
            </div>
            <span className="font-display font-semibold text-light tracking-tight text-sm hidden sm:block">
              PULSEMARKETS
            </span>
          </div>

          {/* Left Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {leftNavItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-md ${
                  activeNav === item 
                    ? 'text-light' 
                    : 'text-light-muted hover:text-light'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Large + Button (Divider) */}
        <div className="shrink-0 mx-4">
          <button
            onClick={onCreateMarket}
            className="w-12 h-12 rounded-full bg-[hsl(220,15%,18%)] hover:bg-[hsl(220,15%,22%)] border border-stroke flex items-center justify-center transition-all hover:scale-105 shadow-lg"
          >
            <Plus className="w-6 h-6 text-light" />
          </button>
        </div>

        {/* Right Section: Right Nav + Actions */}
        <div className="flex-1 flex items-center justify-end gap-6">
          {/* Right Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {rightNavItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-md ${
                  activeNav === item 
                    ? 'text-light' 
                    : 'text-light-muted hover:text-light'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Watchlist Button with Popover */}
          <Popover open={watchlistOpen} onOpenChange={setWatchlistOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1.5 text-light-muted hover:text-light hover:bg-transparent text-sm px-2 relative"
              >
                <Star className={`w-4 h-4 ${watchlistCount > 0 ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                <span className="hidden sm:inline">Watchlist</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              align="end" 
              className="w-96 p-0 bg-[hsl(220,15%,10%)] border-stroke rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-stroke bg-row/30">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-light">Your Watchlist</span>
                </div>
                <span className="text-xs text-light-muted bg-row px-2 py-0.5 rounded-full">
                  {watchlistCount} {watchlistCount === 1 ? 'market' : 'markets'}
                </span>
              </div>

              {/* Content */}
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
                          {/* Market Image */}
                          <div className="shrink-0">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-row/50 ring-1 ring-stroke/50">
                              <img 
                                src={getMarketImage(market)} 
                                alt={market.question}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          {/* Market Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-light line-clamp-2 leading-tight mb-2">
                              {market.question}
                            </p>

                            {/* Prices */}
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

                            {/* Meta */}
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

                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveFromWatchlist?.(market.id);
                            }}
                            className="shrink-0 self-start p-1.5 rounded-lg hover:bg-row text-yellow-400 hover:text-yellow-300 transition-all duration-200"
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

          {/* Chain */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1.5 text-light-muted hover:text-light hover:bg-transparent text-sm px-2"
              >
                {chain}
                <ChevronDown className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[hsl(220,15%,10%)] border-stroke rounded-lg min-w-[120px]">
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
            className="h-8 gap-1.5 text-light-muted hover:text-light hover:bg-transparent text-sm px-2"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Connect</span>
          </Button>
        </div>
        </div>
      </div>
    </header>
  );
}
