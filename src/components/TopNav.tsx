import { useState } from 'react';
import { ChevronDown, Plus, Star, TrendingUp, TrendingDown, Activity, Users, LogOut, Copy, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Market, formatVolume } from '@/lib/mockData';

// Google icon SVG component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export interface User {
  email: string;
  name: string;
  avatar: string;
}

interface TopNavProps {
  onCreateMarket: () => void;
  onDiscover?: () => void;
  onNavigate?: (view: string) => void;
  activeView?: string;
  watchlistMarkets?: Market[];
  onRemoveFromWatchlist?: (marketId: string) => void;
  onSelectMarket?: (market: Market) => void;
  user?: User | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
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
  user,
  onLoginClick,
  onLogout,
}: TopNavProps) {
  const [chain, setChain] = useState<'SOL' | 'ETH'>('SOL');
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock custodial wallet data
  const walletAddress = user ? '0x7a2d...8f3e' : '';
  const walletBalance = user ? '$1,247.32' : '$0.00';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('0x7a2d4c6e9b1f3a8d2c5e7b0f4a9d8c6e3f2a1b8f3e');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[384px] max-w-[calc(100vw-2rem)] h-[50vh] -translate-x-1/2 -translate-y-1/2 p-0 bg-panel-glass border border-stroke rounded-xl shadow-2xl flex flex-col overflow-hidden min-h-0">
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
                  <ScrollArea className="flex-1 min-h-0">
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

          {/* Login / User Wallet */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 gap-2 text-light hover:bg-row text-sm px-2 pr-3"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-6 h-6 rounded-full ring-1 ring-white/20"
                  />
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-xs font-medium text-light leading-none">{walletBalance}</span>
                    <span className="text-[10px] text-light-muted leading-none mt-0.5">{walletAddress}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-light-muted ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-panel backdrop-blur-xl border-stroke rounded-xl p-0 overflow-hidden">
                {/* Wallet Header */}
                <div className="px-4 py-3 bg-row/30 border-b border-stroke">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full ring-2 ring-primary/30"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-light truncate">{user.name}</p>
                      <p className="text-xs text-light-muted truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Balance Section */}
                <div className="px-4 py-3 border-b border-stroke">
                  <p className="text-[10px] uppercase tracking-wider text-light-muted mb-1">Custodial Wallet</p>
                  <p className="text-xl font-display font-bold text-light">{walletBalance}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="text-xs text-light-muted bg-row px-2 py-1 rounded font-mono">
                      {walletAddress}
                    </code>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1 rounded hover:bg-row text-light-muted hover:text-light transition-colors"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button className="p-1 rounded hover:bg-row text-light-muted hover:text-light transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2">
                  <DropdownMenuItem className="text-light text-sm rounded-lg px-3 py-2 hover:bg-row">
                    <TrendingUp className="w-4 h-4 mr-2 text-light-muted" />
                    Deposit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-light text-sm rounded-lg px-3 py-2 hover:bg-row">
                    <TrendingDown className="w-4 h-4 mr-2 text-light-muted" />
                    Withdraw
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-stroke my-1" />
                  <DropdownMenuItem 
                    onClick={onLogout}
                    className="text-rose-400 text-sm rounded-lg px-3 py-2 hover:bg-rose-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-2 text-light-muted hover:text-light hover:bg-row text-sm px-3 group"
              onClick={onLoginClick}
            >
              <GoogleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Sign in</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
