import { useState, useMemo } from 'react';
import { ArrowLeft, Search, TrendingUp, Flame, Sparkles, Clock, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Market, formatVolume } from '@/lib/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MarketsViewProps {
  markets: Market[];
  onSelectMarket: (market: Market) => void;
  priceFlashes: Record<string, boolean>;
}

const categories = ['Crypto', 'Politics', 'Sports', 'Pop', 'Memes'];
const filterTabs = [
  { id: 'all', label: 'All', icon: null },
  { id: 'new', label: 'New', icon: Sparkles },
  { id: 'ending', label: 'Ending', icon: Clock },
  { id: 'hot', label: 'Hot', icon: Flame },
];

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

export function MarketsView({ markets, onSelectMarket, priceFlashes }: MarketsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Top Gainers - sorted by price change
  const topGainers = useMemo(() => {
    return [...markets]
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
    let filtered = [...markets];
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'hot') {
        filtered = filtered.sort((a, b) => b.volume - a.volume);
      } else {
        filtered = filtered.filter(m => m.status === activeFilter);
      }
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(m => 
        m.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    return filtered.sort((a, b) => b.volume - a.volume);
  }, [markets, searchQuery, activeFilter, selectedCategory]);

  return (
    <div className="flex-1 px-4 md:px-6 2xl:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button className="w-8 h-8 rounded-lg bg-row hover:bg-row-hover flex items-center justify-center transition-colors">
          <ArrowLeft className="w-4 h-4 text-light-muted" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-light">Markets</h1>
          <p className="text-sm text-light-muted">Track all prediction markets in real-time</p>
        </div>
      </div>

      {/* Top Gainers & Trending Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Top Gainers */}
        <div className="bg-[hsl(220,15%,10%)] border border-stroke rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-light">Top Gainers</span>
            </div>
            <span className="text-xs text-light-muted">24h</span>
          </div>
          <div className="space-y-3">
            {topGainers.map((market, index) => (
              <div 
                key={market.id}
                onClick={() => onSelectMarket(market)}
                className="flex items-center gap-3 cursor-pointer hover:bg-row/50 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
              >
                <span className="text-xs text-light-muted w-4">{index + 1}</span>
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-row shrink-0">
                  <img src={getMarketImage(market)} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-light truncate">{market.question}</p>
                  <p className="text-xs text-light-muted">{formatVolume(market.volume)} vol</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-emerald-400">
                    +{Math.abs(market.priceChange ?? 0).toFixed(1)}%
                  </p>
                  <p className="text-xs text-light-muted">{market.yesPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="bg-[hsl(220,15%,10%)] border border-stroke rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <span className="text-sm font-medium text-light">Trending</span>
            </div>
            <span className="text-xs text-light-muted">by volume</span>
          </div>
          <div className="space-y-3">
            {trending.map((market, index) => (
              <div 
                key={market.id}
                onClick={() => onSelectMarket(market)}
                className="flex items-center gap-3 cursor-pointer hover:bg-row/50 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
              >
                <span className="text-xs text-light-muted w-4">{index + 1}</span>
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-row shrink-0">
                  <img src={getMarketImage(market)} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-light truncate">{market.question}</p>
                  <p className="text-xs">
                    <span className="text-emerald-400">YES {market.yesPrice.toFixed(2)}</span>
                    <span className="text-light-muted mx-1.5">·</span>
                    <span className="text-rose-400">NO {market.noPrice.toFixed(2)}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-light">{formatVolume(market.volume)}</p>
                  <p className="text-xs text-light-muted">{market.traders} traders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted" />
          <Input
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 bg-[hsl(220,15%,10%)] border-stroke rounded-lg text-sm text-light placeholder:text-light-muted"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[hsl(220,15%,10%)] rounded-lg p-1 border border-stroke">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeFilter === tab.id
                  ? 'bg-row text-light'
                  : 'text-light-muted hover:text-light'
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 ml-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat.toLowerCase() ? null : cat.toLowerCase())}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.toLowerCase()
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[hsl(220,15%,12%)] text-light-muted hover:text-light border border-stroke'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Markets Table */}
      <div className="bg-[hsl(220,15%,10%)] border border-stroke rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr,100px,80px,70px,70px,80px] gap-4 px-4 py-3 border-b border-stroke text-xs text-light-muted font-medium">
          <div>MARKET</div>
          <div className="text-right">VOLUME ↓</div>
          <div className="text-right">TRADERS</div>
          <div className="text-right">YES</div>
          <div className="text-right">NO</div>
          <div className="text-right">24H</div>
        </div>

        {/* Table Body */}
        <ScrollArea className="h-[400px]">
          {filteredMarkets.map((market) => (
            <div
              key={market.id}
              onClick={() => onSelectMarket(market)}
              className={`grid grid-cols-[1fr,100px,80px,70px,70px,80px] gap-4 px-4 py-3 border-b border-stroke/50 hover:bg-row/50 cursor-pointer transition-colors ${
                priceFlashes[market.id] ? 'bg-emerald-500/5' : ''
              }`}
            >
              {/* Market */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-row shrink-0">
                  <img src={getMarketImage(market)} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-light font-medium truncate">{market.question}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-light-muted capitalize">{market.category}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                      market.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                      market.status === 'ending' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {market.status === 'resolved' ? 'Resolved' : market.status === 'ending' ? 'Ending' : 'New'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Volume */}
              <div className="text-right self-center">
                <span className="text-sm text-light font-medium tabular-nums">{formatVolume(market.volume)}</span>
              </div>

              {/* Traders */}
              <div className="text-right self-center">
                <span className="text-sm text-light-muted tabular-nums">{market.traders}</span>
              </div>

              {/* YES */}
              <div className="text-right self-center">
                <span className={`text-sm font-semibold tabular-nums text-emerald-400 ${
                  priceFlashes[market.id] ? 'animate-pulse' : ''
                }`}>
                  {market.yesPrice.toFixed(2)}
                </span>
              </div>

              {/* NO */}
              <div className="text-right self-center">
                <span className={`text-sm font-semibold tabular-nums text-rose-400 ${
                  priceFlashes[market.id] ? 'animate-pulse' : ''
                }`}>
                  {market.noPrice.toFixed(2)}
                </span>
              </div>

              {/* 24H Change */}
              <div className="text-right self-center">
                <span className={`text-sm font-medium tabular-nums ${
                  (market.priceChange ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {(market.priceChange ?? 0) >= 0 ? '+' : ''}{(market.priceChange ?? 0).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
