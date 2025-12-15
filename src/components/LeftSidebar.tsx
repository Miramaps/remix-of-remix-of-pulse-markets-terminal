import { Star, TrendingUp, Flame, User } from 'lucide-react';
import { watchlistItems, trendingCreators, hotCategories } from '@/lib/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface LeftSidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function LeftSidebar({ selectedCategory, onCategorySelect }: LeftSidebarProps) {
  return (
    <aside className="w-56 border-r border-border bg-panel shrink-0 hidden lg:block">
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="p-3 space-y-6">
          {/* Watchlist */}
          <section>
            <div className="flex items-center gap-2 px-2 mb-3">
              <Star className="w-3.5 h-3.5 text-accent-gold" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Watchlist
              </h3>
            </div>
            <div className="space-y-0.5">
              {watchlistItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-panel2 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-sm text-foreground group-hover:text-accent-gold transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <span className={`text-xs font-mono ${
                    item.pnl.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {item.pnl}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Trending Creators */}
          <section>
            <div className="flex items-center gap-2 px-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-accent-gold" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Trending Creators
              </h3>
            </div>
            <div className="space-y-0.5">
              {trendingCreators.map((creator, i) => (
                <motion.button
                  key={creator.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-panel2 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-panel2 flex items-center justify-center">
                      <User className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground group-hover:text-accent-gold transition-colors">
                      {creator.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {creator.volume}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Hot Categories */}
          <section>
            <div className="flex items-center gap-2 px-2 mb-3">
              <Flame className="w-3.5 h-3.5 text-accent-gold" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hot Categories
              </h3>
            </div>
            <div className="space-y-0.5">
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => onCategorySelect(null)}
                className={`w-full flex items-center justify-between px-2 py-2 rounded-lg transition-colors ${
                  selectedCategory === null
                    ? 'bg-panel2 text-accent-gold'
                    : 'hover:bg-panel2 text-foreground'
                }`}
              >
                <span className="text-sm">All</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {hotCategories.reduce((a, b) => a + b.count, 0)}
                </span>
              </motion.button>
              {hotCategories.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  onClick={() => onCategorySelect(cat.id)}
                  className={`w-full flex items-center justify-between px-2 py-2 rounded-lg transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-panel2 text-accent-gold'
                      : 'hover:bg-panel2 text-foreground'
                  }`}
                >
                  <span className="text-sm">{cat.name}</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {cat.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}
