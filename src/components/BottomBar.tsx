import { useState } from 'react';
import { Market } from '@/lib/mockData';

interface BottomBarProps {
  selectedMarket: Market | null;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onClearSelection: () => void;
}

const timeFilters = ['24h', '7d', '30d'];

export function BottomBar({
  selectedMarket,
}: BottomBarProps) {
  const [activeTimeFilter, setActiveTimeFilter] = useState('24h');

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[hsl(220,15%,8%)] border-t border-stroke">
      <div className="h-12 px-4 md:px-6 2xl:px-8 flex items-center justify-between">
        {/* Left: Time filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-light-muted">All</span>
          <div className="flex items-center bg-row rounded-md p-0.5">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveTimeFilter(filter)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  activeTimeFilter === filter
                    ? 'bg-[hsl(220,15%,18%)] text-light'
                    : 'text-light-muted hover:text-light'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Selection info */}
        <div className="flex-1 flex justify-center">
          <span className="text-xs text-light-muted truncate max-w-md">
            {selectedMarket ? selectedMarket.question : 'Select a market to trade'}
          </span>
        </div>

        {/* Right: Live indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-light-muted">Live</span>
        </div>
      </div>
    </footer>
  );
}
