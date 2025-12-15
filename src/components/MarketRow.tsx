import { useEffect, useState } from 'react';
import { TrendingUp, Users, Clock } from 'lucide-react';
import { Market, formatVolume, formatTimeLeft, formatTimeAgo } from '@/lib/mockData';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface MarketRowProps {
  market: Market;
  isSelected: boolean;
  onSelect: (market: Market) => void;
  priceFlash?: boolean;
}

const gradients = [
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-600',
  'from-blue-500 to-indigo-600',
];

export function MarketRow({ market, isSelected, onSelect, priceFlash }: MarketRowProps) {
  const [flashYes, setFlashYes] = useState(false);
  const [flashNo, setFlashNo] = useState(false);

  const gradientIndex = parseInt(market.id.replace(/\D/g, '')) % gradients.length;

  useEffect(() => {
    if (priceFlash) {
      setFlashYes(true);
      setFlashNo(true);
      setTimeout(() => {
        setFlashYes(false);
        setFlashNo(false);
      }, 500);
    }
  }, [priceFlash]);

  // Simple sparkline data (mock)
  const sparkline = Array.from({ length: 12 }, () => Math.random() * 0.4 + 0.3);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      whileHover={{ y: -1 }}
      onClick={() => onSelect(market)}
      className={`relative w-full text-left glass-card rounded-2xl p-5 cursor-pointer transition-all duration-200 group ${
        isSelected
          ? 'border-accent-blue glow-blue'
          : 'hover:border-gold/50 hover:glow-gold'
      }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute left-0 top-5 bottom-5 w-1 bg-accent-blue rounded-r-full" />
      )}

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradients[gradientIndex]} flex items-center justify-center shrink-0 shadow-lg`}>
          <span className="text-white font-display font-semibold text-sm">
            {market.question.charAt(0)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[15px] font-medium text-panel leading-snug line-clamp-2 mb-2.5 group-hover:text-canvas transition-colors">
            {market.question}
          </h4>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs text-panel/50">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="font-medium">{formatVolume(market.volume)}</span>
              </TooltipTrigger>
              <TooltipContent>Volume</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium">{market.traders}</span>
              </TooltipTrigger>
              <TooltipContent>Traders</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-medium">
                  {market.status === 'resolved' 
                    ? 'Ended' 
                    : market.status === 'ending' 
                      ? formatTimeLeft(market.resolvesAt)
                      : formatTimeAgo(market.createdAt)
                  }
                </span>
              </TooltipTrigger>
              <TooltipContent>Time</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Right: Prices + Sparkline */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Mini Sparkline (shown on hover for ENDING markets) */}
          {market.status === 'ending' && (
            <div className="w-12 h-6 flex items-end gap-px opacity-0 group-hover:opacity-100 transition-opacity">
              {sparkline.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 bg-panel/30 rounded-sm"
                  style={{ height: `${v * 100}%` }}
                />
              ))}
            </div>
          )}

          {/* Prices */}
          <div className="text-right space-y-1">
            <div className={`text-sm font-semibold transition-colors ${flashYes ? 'text-accent-blue' : 'text-accent-blue/80'}`}>
              YES {market.yesPrice.toFixed(2)}
            </div>
            <div className={`text-sm font-semibold transition-colors ${flashNo ? 'text-accent-coral' : 'text-accent-coral/80'}`}>
              NO {market.noPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
