import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Market } from '@/lib/mockData';
import { MarketRow } from './MarketRow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { AnimatePresence } from 'framer-motion';

interface MarketColumnProps {
  title: string;
  markets: Market[];
  selectedMarket: Market | null;
  onSelectMarket: (market: Market) => void;
  priceFlashes: Record<string, boolean>;
  selectedCategory: string | null;
}

type SortOption = 'newest' | 'volume' | 'ending';

export function MarketColumn({
  title,
  markets,
  selectedMarket,
  onSelectMarket,
  priceFlashes,
  selectedCategory,
}: MarketColumnProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredMarkets = useMemo(() => {
    let result = [...markets];

    if (selectedCategory) {
      result = result.filter((m) => m.category === selectedCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.question.toLowerCase().includes(q));
    }

    switch (sort) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'volume':
        result.sort((a, b) => b.volume - a.volume);
        break;
      case 'ending':
        result.sort((a, b) => a.resolvesAt.getTime() - b.resolvesAt.getTime());
        break;
    }

    return result;
  }, [markets, selectedCategory, search, sort]);

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest',
    volume: 'Volume',
    ending: 'Ending',
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-dark flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-panel">
            {title}
          </h2>
          <span className="text-xs font-medium text-panel/40 bg-panel/20 px-2 py-0.5 rounded-full">
            {filteredMarkets.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Search Popover */}
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-panel/50 hover:text-panel hover:bg-panel/10"
              >
                <Search className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 glass-panel rounded-xl" align="end">
              <div className="relative">
                <Input
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 bg-transparent border-dark text-panel placeholder:text-panel/40 text-sm"
                  autoFocus
                />
                {search && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-panel/40"
                    onClick={() => setSearch('')}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-panel/50 hover:text-panel hover:bg-panel/10"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel rounded-xl min-w-[120px]">
              {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => setSort(opt)}
                  className={`text-sm ${sort === opt ? 'text-accent-blue' : 'text-panel'}`}
                >
                  {sortLabels[opt]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 inset-scroll-shadow">
        <div className="p-3 space-y-2 pb-24">
          <AnimatePresence mode="popLayout">
            {filteredMarkets.map((market) => (
              <MarketRow
                key={market.id}
                market={market}
                isSelected={selectedMarket?.id === market.id}
                onSelect={onSelectMarket}
                priceFlash={priceFlashes[market.id]}
              />
            ))}
          </AnimatePresence>
          {filteredMarkets.length === 0 && (
            <div className="text-center py-12 text-panel/40 text-sm">
              No markets found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
