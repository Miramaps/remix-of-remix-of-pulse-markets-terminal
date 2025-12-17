import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, TrendingUp, Flame, Clock, Zap } from 'lucide-react';
import { Market, formatVolume } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MarketsPageProps {
  markets: Market[];
  onBack: () => void;
  onSelectMarket: (market: Market) => void;
}

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

const filterTabs = [
  { id: 'all', label: 'All', icon: null },
  { id: 'new', label: 'New', icon: Zap },
  { id: 'ending', label: 'Ending', icon: Clock },
  { id: 'hot', label: 'Hot', icon: Flame },
];

const categoryFilters = ['Crypto', 'Politics', 'Sports', 'Pop', 'Memes'];

export function MarketsPage({ markets, onBack, onSelectMarket }: MarketsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Top Gainers - sorted by positive price change
  const topGainers = useMemo(() => {
    return [...markets]
      .filter(m => (m.priceChange ?? 0) > 0)
      .sort((a, b) => (b.priceChange ?? 0) - (a.priceChange ?? 0))
      .slice(0, 5);
  }, [markets]);

  // Trending - sorted by volume
  const trending = useMemo(() => {
    return [...markets]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
  }, [markets]);

  // Filtered markets for table
  const filteredMarkets = useMemo(() => {
    let result = [...markets];
    
    if (searchQuery) {
      result = result.filter(m => 
        m.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeFilter !== 'all') {
      if (activeFilter === 'hot') {
        result = result.sort((a, b) => b.volume - a.volume);
      } else {
        result = result.filter(m => m.status === activeFilter);
      }
    }
    
    if (activeCategory) {
      result = result.filter(m => 
        m.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    return result.sort((a, b) => b.volume - a.volume);
  }, [markets, searchQuery, activeFilter, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {/* Header */}
      <div className="px-6 py-4 border-b border-primary/15">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-row transition-colors text-light-muted hover:text-light"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-light">Markets</h1>
            <p className="text-xs text-light-muted">Track all prediction markets in real-time</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-4">
          {/* Top Gainers & Trending Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Gainers */}
            <div className="bg-panel border border-primary/15 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-sm font-semibold text-light">Top Gainers</span>
                </div>
                <span className="text-xs text-light-muted">24h</span>
              </div>
              <div className="space-y-2">
                {topGainers.map((market, idx) => (
                  <div 
                    key={market.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-row cursor-pointer transition-colors"
                    onClick={() => onSelectMarket(market)}
                  >
                    <span className="text-xs text-light-muted w-4">{idx + 1}</span>
                    <img 
                      src={getMarketImage(market)} 
                      alt="" 
                      className="w-8 h-8 rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-light truncate">{market.question}</p>
                      <p className="text-xs text-light-muted">{formatVolume(market.volume)} vol</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-400">
                        +{(market.priceChange ?? 0).toFixed(1)}%
                      </p>
                      <p className="text-xs text-light-muted">{market.yesPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="bg-panel border border-primary/15 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-sm font-semibold text-light">Trending</span>
                </div>
                <span className="text-xs text-light-muted">by volume</span>
              </div>
              <div className="space-y-2">
                {trending.map((market, idx) => (
                  <div 
                    key={market.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-row cursor-pointer transition-colors"
                    onClick={() => onSelectMarket(market)}
                  >
                    <span className="text-xs text-light-muted w-4">{idx + 1}</span>
                    <img 
                      src={getMarketImage(market)} 
                      alt="" 
                      className="w-8 h-8 rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-light truncate">{market.question}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-emerald-400">YES {market.yesPrice.toFixed(2)}</span>
                        <span className="text-rose-400">NO {market.noPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-light">{formatVolume(market.volume)}</p>
                      <p className="text-xs text-light-muted">{market.traders} traders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted" />
              <Input
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-row border-primary/15 rounded-lg text-sm text-light placeholder:text-light-muted"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-row rounded-lg p-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeFilter === tab.id
                      ? 'bg-panel text-light'
                      : 'text-light-muted hover:text-light'
                  }`}
                >
                  {tab.icon && <tab.icon className="w-3 h-3" />}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 ml-auto">
              {categoryFilters.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activeCategory === cat
                      ? 'bg-accent-blue text-white'
                      : 'bg-row text-light-muted hover:text-light hover:bg-row-hover'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Markets Table */}
          <div className="bg-panel border border-primary/15 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-primary/15 text-xs font-medium text-light-muted uppercase tracking-wide">
              <div className="col-span-5">Market</div>
              <div className="col-span-1 text-right">Volume</div>
              <div className="col-span-1 text-right">Traders</div>
              <div className="col-span-2 text-right">Yes</div>
              <div className="col-span-2 text-right">No</div>
              <div className="col-span-1 text-right">24H</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-primary/10">
              {filteredMarkets.map((market) => (
                <div
                  key={market.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-row cursor-pointer transition-colors items-center"
                  onClick={() => onSelectMarket(market)}
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <img 
                      src={getMarketImage(market)} 
                      alt="" 
                      className="w-9 h-9 rounded-lg"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-light truncate">{market.question}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-row text-light-muted capitalize">
                          {market.category}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-row text-light-muted capitalize">
                          {market.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className="text-sm font-medium text-light tabular-nums">
                      {formatVolume(market.volume)}
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className="text-sm text-light-muted tabular-nums">
                      {market.traders}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-semibold text-emerald-400 tabular-nums">
                      {market.yesPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-semibold text-rose-400 tabular-nums">
                      {market.noPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className={`text-sm font-medium tabular-nums ${
                      (market.priceChange ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {(market.priceChange ?? 0) >= 0 ? '+' : ''}{(market.priceChange ?? 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Bar */}
      <div className="sticky bottom-0 bg-panel border-t border-primary/15 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-light-muted">All</span>
            <div className="flex items-center gap-1 bg-row rounded-lg p-0.5">
              {(['24h', '7d', '30d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    timeRange === range
                      ? 'bg-panel text-light'
                      : 'text-light-muted hover:text-light'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <span className="text-xs text-light-muted ml-4">Select a market to trade</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-light-muted">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
