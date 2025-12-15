import { useState } from 'react';
import { ChevronDown, Minus, Plus, X } from 'lucide-react';
import { Market } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface BottomBarProps {
  selectedMarket: Market | null;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onClearSelection: () => void;
  onBuy: (marketId: string, side: 'yes' | 'no', amount: number) => void;
}

const categories = [
  { id: null, label: 'All' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'politics', label: 'Politics' },
  { id: 'sports', label: 'Sports' },
  { id: 'pop', label: 'Pop' },
  { id: 'memes', label: 'Memes' },
];

const timeFilters = ['24h', '7d', '30d'];
const presets = [5, 10, 25, 50];

export function BottomBar({ 
  selectedMarket, 
  selectedCategory, 
  onCategorySelect, 
  onClearSelection,
  onBuy 
}: BottomBarProps) {
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState(10);
  const [timeFilter, setTimeFilter] = useState('24h');
  const { toast } = useToast();

  const handleBuy = () => {
    if (!selectedMarket) return;
    onBuy(selectedMarket.id, side, amount);
    toast({
      title: `Bought ${side.toUpperCase()}`,
      description: `${amount} shares of "${selectedMarket.question.slice(0, 40)}…"`,
    });
    onClearSelection();
  };

  const currentCategory = categories.find(c => c.id === selectedCategory)?.label || 'All';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <motion.div 
        className="max-w-6xl mx-auto glass-panel rounded-2xl shadow-2xl"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="px-5 py-4 flex items-center gap-6">
          {/* Left: Filters */}
          <div className="flex items-center gap-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 gap-2 text-panel/70 hover:text-panel hover:bg-panel/10 rounded-xl"
                >
                  {currentCategory}
                  <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-panel rounded-xl">
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat.id ?? 'all'}
                    onClick={() => onCategorySelect(cat.id)}
                    className={`text-sm ${selectedCategory === cat.id ? 'text-accent-blue' : 'text-panel'}`}
                  >
                    {cat.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center bg-panel/20 rounded-lg p-0.5">
              {timeFilters.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    timeFilter === t
                      ? 'bg-panel/30 text-panel'
                      : 'text-panel/50 hover:text-panel'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Selected Market or placeholder */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {selectedMarket ? (
                <motion.div
                  key={selectedMarket.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-4"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-panel/50 hover:text-panel hover:bg-panel/10 shrink-0"
                    onClick={onClearSelection}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <p className="text-sm text-panel font-medium truncate max-w-md">
                    {selectedMarket.question}
                  </p>
                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <span className="text-accent-blue font-semibold">
                      YES {selectedMarket.yesPrice.toFixed(2)}
                    </span>
                    <span className="text-panel/30">•</span>
                    <span className="text-accent-coral font-semibold">
                      NO {selectedMarket.noPrice.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-panel/40"
                >
                  Select a market to trade
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Trade UI */}
          <div className="flex items-center gap-3 shrink-0">
            {/* YES/NO Toggle */}
            <div className="flex items-center bg-panel/20 rounded-xl p-1">
              <button
                onClick={() => setSide('yes')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  side === 'yes'
                    ? 'bg-accent-blue text-white shadow-lg'
                    : 'text-panel/60 hover:text-panel'
                }`}
              >
                YES
              </button>
              <button
                onClick={() => setSide('no')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  side === 'no'
                    ? 'bg-accent-coral text-white shadow-lg'
                    : 'text-panel/60 hover:text-panel'
                }`}
              >
                NO
              </button>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-panel/50 hover:text-panel hover:bg-panel/10 rounded-lg"
                onClick={() => setAmount(Math.max(1, amount - 5))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="w-16 text-center">
                <span className="text-lg font-semibold text-panel">${amount}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-panel/50 hover:text-panel hover:bg-panel/10 rounded-lg"
                onClick={() => setAmount(amount + 5)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Presets */}
            <div className="hidden lg:flex items-center gap-1">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    amount === p
                      ? 'bg-gold/20 text-gold'
                      : 'text-panel/40 hover:text-panel hover:bg-panel/10'
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>

            {/* Action Button */}
            <Button
              onClick={handleBuy}
              disabled={!selectedMarket}
              className={`h-11 px-6 font-semibold rounded-xl transition-all ${
                side === 'yes'
                  ? 'bg-gradient-to-r from-accent-blue to-blue-600 hover:from-blue-600 hover:to-accent-blue text-white shadow-lg shadow-accent-blue/25'
                  : 'bg-gradient-to-r from-accent-coral to-orange-500 hover:from-orange-500 hover:to-accent-coral text-white shadow-lg shadow-accent-coral/25'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Buy {side.toUpperCase()}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
