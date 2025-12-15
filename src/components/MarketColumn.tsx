import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Market } from '@/lib/mockData';
import { MarketCard } from './MarketCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnimatePresence } from 'framer-motion';

interface MarketColumnProps {
  title: string;
  subtitle: string;
  markets: Market[];
  onBuy: (marketId: string, side: 'yes' | 'no', amount: number) => void;
  priceFlashes: Record<string, 'yes' | 'no' | null>;
  selectedCategory: string | null;
}

type SortOption = 'newest' | 'volume' | 'volatility' | 'ending';

const filterPills = ['All', 'Crypto', 'Politics', 'Sports', 'Pop', 'Memes'];

export function MarketColumn({
  title,
  subtitle,
  markets,
  onBuy,
  priceFlashes,
  selectedCategory,
}: MarketColumnProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [filter, setFilter] = useState('All');

  const filteredMarkets = useMemo(() => {
    let result = [...markets];

    // Apply category filter from sidebar
    if (selectedCategory) {
      result = result.filter((m) => m.category === selectedCategory);
    }

    // Apply local filter
    if (filter !== 'All') {
      result = result.filter(
        (m) => m.category.toLowerCase() === filter.toLowerCase()
      );
    }

    // Apply search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.question.toLowerCase().includes(q));
    }

    // Apply sort
    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'volume':
        result.sort((a, b) => b.volume - a.volume);
        break;
      case 'volatility':
        result.sort((a, b) => Math.abs(b.yesPrice - 0.5) - Math.abs(a.yesPrice - 0.5));
        break;
      case 'ending':
        result.sort((a, b) => a.resolvesAt.getTime() - b.resolvesAt.getTime());
        break;
    }

    return result;
  }, [markets, selectedCategory, filter, search, sort]);

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest',
    volume: 'Volume',
    volatility: 'Volatility',
    ending: 'Ending soon',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-panel border-b border-border p-3 space-y-3">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <Badge variant="secondary" className="bg-panel2 text-accent-gold font-mono text-xs">
            {filteredMarkets.length}
          </Badge>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-panel2 border-border placeholder:text-muted-foreground"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 bg-panel2 border-border hover:border-border-hover text-xs"
              >
                <SlidersHorizontal className="w-3 h-3" />
                {sortLabels[sort]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-panel border-border">
              {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => setSort(opt)}
                  className={`text-xs ${sort === opt ? 'text-accent-gold' : ''}`}
                >
                  {sortLabels[opt]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1">
          {filterPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setFilter(pill)}
              className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                filter === pill
                  ? 'bg-accent-gold text-background font-medium'
                  : 'bg-panel2 text-muted-foreground hover:text-foreground'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredMarkets.map((market) => (
              <MarketCard
                key={market.id}
                market={market}
                onBuy={onBuy}
                priceFlash={priceFlashes[market.id]}
              />
            ))}
          </AnimatePresence>
          {filteredMarkets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No markets found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
