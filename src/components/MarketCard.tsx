import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Users, DollarSign, Clock, Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { Market, formatVolume, formatTimeAgo, formatTimeLeft } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface MarketCardProps {
  market: Market;
  onBuy: (marketId: string, side: 'yes' | 'no', amount: number) => void;
  priceFlash?: 'yes' | 'no' | null;
}

const categoryColors: Record<string, string> = {
  crypto: 'bg-amber-500/20 text-amber-400',
  politics: 'bg-blue-500/20 text-blue-400',
  sports: 'bg-green-500/20 text-green-400',
  pop: 'bg-pink-500/20 text-pink-400',
  memes: 'bg-purple-500/20 text-purple-400',
};

const gradients = [
  'from-amber-600 to-orange-700',
  'from-emerald-600 to-teal-700',
  'from-violet-600 to-purple-700',
  'from-rose-600 to-pink-700',
  'from-blue-600 to-indigo-700',
];

export function MarketCard({ market, onBuy, priceFlash }: MarketCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [amount, setAmount] = useState(10);
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no' | null>(null);
  const { toast } = useToast();

  const gradientIndex = parseInt(market.id.replace(/\D/g, '')) % gradients.length;

  const handleQuickBuy = useCallback((side: 'yes' | 'no') => {
    if (isExpanded && selectedSide === side) {
      // Confirm buy
      onBuy(market.id, side, amount);
      toast({
        title: `Bought ${side.toUpperCase()}`,
        description: `${amount} shares at ${side === 'yes' ? market.yesPrice : market.noPrice}`,
      });
      setIsExpanded(false);
      setSelectedSide(null);
    } else {
      setSelectedSide(side);
      setIsExpanded(true);
    }
  }, [isExpanded, selectedSide, amount, market, onBuy, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.closest(`[data-market-id="${market.id}"]`)) {
        if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          handleQuickBuy('yes');
        } else if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          handleQuickBuy('no');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleQuickBuy, market.id]);

  const presets = [5, 10, 25, 50];

  return (
    <motion.div
      data-market-id={market.id}
      tabIndex={0}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`glass-card p-3 cursor-pointer transition-all duration-200 hover:border-border-hover focus:border-border-hover focus:outline-none group ${
        priceFlash ? 'animate-price-flash' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${gradients[gradientIndex]} shrink-0 flex items-center justify-center overflow-hidden`}>
          {market.thumbnail ? (
            <img src={market.thumbnail} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-white/80">
              {market.question.charAt(0)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-accent-gold transition-colors">
              {market.question}
            </h4>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(market.sourceUrl, '_blank');
                  }}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View source</TooltipContent>
            </Tooltip>
          </div>

          {/* Meta Row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${categoryColors[market.category]}`}>
              {market.category}
            </span>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span className="font-mono">{formatVolume(market.volume)}</span>
              </TooltipTrigger>
              <TooltipContent>Volume</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span className="font-mono">{market.traders}</span>
              </TooltipTrigger>
              <TooltipContent>Traders</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span className="font-mono">{formatVolume(market.liquidity)}</span>
              </TooltipTrigger>
              <TooltipContent>Liquidity</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-mono">
                  {market.status === 'new' 
                    ? formatTimeAgo(market.createdAt)
                    : formatTimeLeft(market.resolvesAt)
                  }
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {market.status === 'new' ? 'Created' : 'Resolves'}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Probability Bar */}
          <div className="probability-bar mb-2">
            <div 
              className="probability-yes" 
              style={{ width: `${market.yesPrice * 100}%` }} 
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                handleQuickBuy('yes');
              }}
              className={`yes-button flex-1 flex items-center justify-center gap-1 ${
                selectedSide === 'yes' ? 'ring-1 ring-emerald-400' : ''
              }`}
            >
              YES <span className="opacity-70">{market.yesPrice.toFixed(2)}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                handleQuickBuy('no');
              }}
              className={`no-button flex-1 flex items-center justify-center gap-1 ${
                selectedSide === 'no' ? 'ring-1 ring-red-400' : ''
              }`}
            >
              NO <span className="opacity-70">{market.noPrice.toFixed(2)}</span>
            </motion.button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Quick Buy Drawer */}
          <AnimatePresence>
            {isExpanded && selectedSide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-3 border-t border-border space-y-3">
                  <div className="flex gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAmount(preset);
                        }}
                        className={`flex-1 py-1.5 text-xs font-mono rounded-md transition-colors ${
                          amount === preset
                            ? 'bg-accent-gold text-background'
                            : 'bg-panel2 text-foreground hover:bg-panel2/80'
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                  <div className="px-1">
                    <Slider
                      value={[amount]}
                      onValueChange={([v]) => setAmount(v)}
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Amount: ${amount}</span>
                    <span className="text-muted-foreground">
                      Shares: ~{(amount / (selectedSide === 'yes' ? market.yesPrice : market.noPrice)).toFixed(1)}
                    </span>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickBuy(selectedSide);
                    }}
                    className={`w-full ${
                      selectedSide === 'yes'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-red-600 hover:bg-red-700'
                    } text-white`}
                  >
                    Buy {selectedSide.toUpperCase()} - ${amount}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Caller (for resolved markets) */}
          {market.topCaller && (
            <div className="mt-2 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Top caller: <span className="text-accent-gold">{market.topCaller}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
