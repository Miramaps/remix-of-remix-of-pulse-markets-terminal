import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, ChevronUp, ChevronDown, Star, Bell, Share2, Users, Wallet } from 'lucide-react';
import { Market, formatVolume, formatTimeLeft } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { TopNav } from './TopNav';

interface TradingPageProps {
  market: Market;
  onBack: () => void;
}

// Generate mock price history
const generatePriceHistory = (currentPrice: number, points: number = 100) => {
  const history: { time: number; price: number }[] = [];
  let price = currentPrice - 0.15 + Math.random() * 0.3;
  
  for (let i = 0; i < points; i++) {
    price = Math.max(0.01, Math.min(0.99, price + (Math.random() - 0.5) * 0.025));
    history.push({ time: Date.now() - (points - i) * 60000, price });
  }
  history.push({ time: Date.now(), price: currentPrice });
  return history;
};

// Generate mock order book
const generateOrderBook = (yesPrice: number) => {
  const bids: { price: number; size: number }[] = [];
  const asks: { price: number; size: number }[] = [];
  
  for (let i = 0; i < 6; i++) {
    bids.push({
      price: Math.max(0.01, yesPrice - 0.01 * (i + 1)),
      size: Math.floor(Math.random() * 8000) + 1000,
    });
    asks.push({
      price: Math.min(0.99, yesPrice + 0.01 * (i + 1)),
      size: Math.floor(Math.random() * 8000) + 1000,
    });
  }
  
  return { bids, asks };
};

// Generate recent trades
const generateRecentTrades = () => {
  const trades = [];
  for (let i = 0; i < 8; i++) {
    trades.push({
      id: i,
      side: Math.random() > 0.5 ? 'yes' : 'no',
      price: 0.5 + (Math.random() - 0.5) * 0.4,
      size: Math.floor(Math.random() * 5000) + 100,
      time: new Date(Date.now() - i * 15000),
    });
  }
  return trades;
};

// Generate mock positions
const generatePositions = () => {
  return [
    { id: 1, side: 'yes', shares: 500, avgPrice: 0.45, currentPrice: 0.52, pnl: 35 },
    { id: 2, side: 'no', shares: 200, avgPrice: 0.55, currentPrice: 0.48, pnl: -14 },
  ];
};

// Generate mock wallet activity
const generateWalletActivity = () => {
  const wallets = [];
  for (let i = 0; i < 6; i++) {
    wallets.push({
      id: i,
      address: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`,
      side: Math.random() > 0.5 ? 'yes' : 'no',
      amount: Math.floor(Math.random() * 5000) + 100,
      time: `${Math.floor(Math.random() * 60)}s ago`,
    });
  }
  return wallets;
};

// Chart component
function PriceChart({ data }: { data: { time: number; price: number }[] }) {
  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const range = maxPrice - minPrice || 0.1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.price - minPrice) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const lastPoint = data[data.length - 1];
  const firstPoint = data[0];
  const isUp = lastPoint.price >= firstPoint.price;

  return (
    <div className="w-full h-full relative">
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-light-muted/50 font-mono pr-2">
        <span>{maxPrice.toFixed(2)}</span>
        <span>{((maxPrice + minPrice) / 2).toFixed(2)}</span>
        <span>{minPrice.toFixed(2)}</span>
      </div>
      
      <div className="ml-8 h-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${points} 100,100`} fill="url(#chartGradient)" />
          <polyline points={points} fill="none" stroke={isUp ? '#22c55e' : '#ef4444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function TradingPage({ market, onBack }: TradingPageProps) {
  const [activeTab, setActiveTab] = useState<'yes' | 'no'>('yes');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [amount, setAmount] = useState('100');
  const [priceHistory, setPriceHistory] = useState<{ time: number; price: number }[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: { price: number; size: number }[]; asks: { price: number; size: number }[] }>({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState('1H');
  const [bottomTab, setBottomTab] = useState<'positions' | 'activity'>('positions');
  const [positions] = useState(generatePositions());
  const [walletActivity] = useState(generateWalletActivity());
  const { toast } = useToast();

  useEffect(() => {
    setPriceHistory(generatePriceHistory(market.yesPrice));
    setOrderBook(generateOrderBook(market.yesPrice));
    setRecentTrades(generateRecentTrades());
  }, [market.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPriceHistory(prev => {
        if (prev.length === 0) return prev;
        const newPrice = Math.max(0.01, Math.min(0.99, prev[prev.length - 1].price + (Math.random() - 0.5) * 0.015));
        return [...prev.slice(1), { time: Date.now(), price: newPrice }];
      });
      setOrderBook(generateOrderBook(market.yesPrice));
    }, 3000);
    return () => clearInterval(interval);
  }, [market]);

  const currentPrice = activeTab === 'yes' ? market.yesPrice : market.noPrice;
  const shares = amount && currentPrice ? Math.floor(Number(amount) / currentPrice) : 0;
  const potential = shares * 1;
  const lastPrice = priceHistory[priceHistory.length - 1]?.price || market.yesPrice;
  const firstPrice = priceHistory[0]?.price || market.yesPrice;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = (priceChange / firstPrice) * 100;
  const isUp = priceChange >= 0;

  const handleTrade = () => {
    toast({
      title: 'Order Placed',
      description: `Bought ${shares} ${activeTab.toUpperCase()} shares at ${currentPrice?.toFixed(2)}`,
    });
  };

  const maxBidSize = Math.max(...orderBook.bids.map(b => b.size));
  const maxAskSize = Math.max(...orderBook.asks.map(a => a.size));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col bg-panel text-light overflow-hidden"
    >
      {/* Top Nav */}
      <TopNav onCreateMarket={() => {}} onDiscover={onBack} />

      {/* Market Header Bar */}
      <div className="h-11 border-b border-stroke flex items-center justify-between px-4 shrink-0 bg-row/50">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-7 px-2 text-light-muted hover:text-light hover:bg-row rounded-lg gap-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>
          
          <div className="h-5 w-px bg-stroke" />
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden bg-row ring-1 ring-stroke">
              <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${market.id}`} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="font-medium text-sm truncate max-w-[300px]">{market.question}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-row text-light-muted font-medium uppercase">
              {market.status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-light-muted hover:text-light hover:bg-row">
            <Star className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-light-muted hover:text-light hover:bg-row">
            <Bell className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-light-muted hover:text-light hover:bg-row">
            <Share2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">

        {/* Center - Chart + Bottom Panels */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Price Header */}
          <div className="h-10 border-b border-stroke bg-row/50 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold tabular-nums">{lastPrice.toFixed(4)}</span>
              <span className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </span>
            </div>
            
            <div className="flex items-center gap-1 bg-row rounded-lg p-1">
              {['1m', '5m', '1H', '1D'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all ${
                    timeframe === tf ? 'bg-primary text-primary-foreground' : 'text-light-muted hover:text-light hover:bg-row/80'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Area */}
          <div className="flex-1 flex min-h-0">
            {/* Chart */}
            <div className="flex-1 p-4">
              {priceHistory.length > 0 && <PriceChart data={priceHistory} />}
            </div>
          </div>

          {/* Bottom Section - Order Book + Recent Trades */}
          <div className="h-36 border-t border-stroke flex shrink-0">
            {/* Order Book */}
            <div className="flex-1 p-3 border-r border-stroke">
              <div className="text-[10px] text-light-muted uppercase tracking-wider mb-2 font-medium">Order Book</div>
              <div className="flex gap-4 h-[calc(100%-20px)]">
                {/* Bids (Green) */}
                <div className="flex-1 space-y-0.5">
                  {orderBook.bids.slice(0, 5).map((bid, i) => (
                    <div key={i} className="relative flex items-center h-5">
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-emerald-500/20 rounded-sm" 
                        style={{ width: `${(bid.size / maxBidSize) * 100}%` }} 
                      />
                      <span className="relative z-10 text-[10px] text-emerald-400 font-medium tabular-nums w-12">{bid.price.toFixed(2)}</span>
                      <span className="relative z-10 text-[10px] text-light-muted tabular-nums ml-auto">{(bid.size / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
                {/* Asks (Red) */}
                <div className="flex-1 space-y-0.5">
                  {orderBook.asks.slice(0, 5).map((ask, i) => (
                    <div key={i} className="relative flex items-center h-5">
                      <div 
                        className="absolute right-0 top-0 bottom-0 bg-rose-500/20 rounded-sm" 
                        style={{ width: `${(ask.size / maxAskSize) * 100}%` }} 
                      />
                      <span className="relative z-10 text-[10px] text-rose-400 font-medium tabular-nums w-12">{ask.price.toFixed(2)}</span>
                      <span className="relative z-10 text-[10px] text-light-muted tabular-nums ml-auto">{(ask.size / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recent Trades */}
            <div className="w-56 p-3">
              <div className="text-[10px] text-light-muted uppercase tracking-wider mb-2 font-medium">Recent Trades</div>
              <div className="space-y-0.5 overflow-hidden">
                {recentTrades.slice(0, 5).map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between h-5">
                    <div className="flex items-center gap-1.5">
                      {trade.side === 'yes' ? (
                        <ChevronUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-rose-400" />
                      )}
                      <span className={`text-[10px] font-medium ${trade.side === 'yes' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.price.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[10px] text-light-muted tabular-nums">{trade.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Positions / Activity Tabs */}
          <div className="h-32 border-t border-stroke bg-row/30 shrink-0">
            <div className="flex items-center gap-4 px-4 h-8 border-b border-stroke">
              <button
                onClick={() => setBottomTab('positions')}
                className={`text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                  bottomTab === 'positions' ? 'text-light' : 'text-light-muted hover:text-light'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                Your Positions
              </button>
              <button
                onClick={() => setBottomTab('activity')}
                className={`text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                  bottomTab === 'activity' ? 'text-light' : 'text-light-muted hover:text-light'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Live Activity
              </button>
            </div>
            
            <div className="p-3 overflow-hidden">
              {bottomTab === 'positions' ? (
                <div className="grid grid-cols-5 gap-4 text-[10px]">
                  <div className="text-light-muted uppercase tracking-wider">Side</div>
                  <div className="text-light-muted uppercase tracking-wider">Shares</div>
                  <div className="text-light-muted uppercase tracking-wider">Avg Price</div>
                  <div className="text-light-muted uppercase tracking-wider">Current</div>
                  <div className="text-light-muted uppercase tracking-wider text-right">P&L</div>
                  {positions.map((pos) => (
                    <>
                      <div key={`${pos.id}-side`} className={`font-medium ${pos.side === 'yes' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pos.side.toUpperCase()}
                      </div>
                      <div key={`${pos.id}-shares`} className="text-light tabular-nums">{pos.shares}</div>
                      <div key={`${pos.id}-avg`} className="text-light tabular-nums">${pos.avgPrice.toFixed(2)}</div>
                      <div key={`${pos.id}-curr`} className="text-light tabular-nums">${pos.currentPrice.toFixed(2)}</div>
                      <div key={`${pos.id}-pnl`} className={`text-right font-medium tabular-nums ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pos.pnl >= 0 ? '+' : ''}{pos.pnl}
                      </div>
                    </>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 text-[10px]">
                  <div className="text-light-muted uppercase tracking-wider">Wallet</div>
                  <div className="text-light-muted uppercase tracking-wider">Side</div>
                  <div className="text-light-muted uppercase tracking-wider">Amount</div>
                  <div className="text-light-muted uppercase tracking-wider text-right">Time</div>
                  {walletActivity.slice(0, 3).map((w) => (
                    <>
                      <div key={`${w.id}-addr`} className="text-light font-mono">{w.address}</div>
                      <div key={`${w.id}-side`} className={`font-medium ${w.side === 'yes' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {w.side.toUpperCase()}
                      </div>
                      <div key={`${w.id}-amt`} className="text-light tabular-nums">${w.amount}</div>
                      <div key={`${w.id}-time`} className="text-light-muted text-right">{w.time}</div>
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Trading Panel */}
        <div className="w-60 border-l border-stroke bg-row/30 flex flex-col shrink-0">
          {/* YES/NO Toggle */}
          <div className="p-3 border-b border-stroke">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('yes')}
                className={`py-3 rounded-lg text-center transition-all ${
                  activeTab === 'yes' 
                    ? 'bg-emerald-500 text-white ring-1 ring-emerald-500/50' 
                    : 'bg-row hover:bg-row/80 text-light-muted'
                }`}
              >
                <div className="text-lg font-bold tabular-nums">{market.yesPrice.toFixed(2)}</div>
                <div className="text-[10px] uppercase font-medium opacity-70">YES</div>
              </button>
              <button
                onClick={() => setActiveTab('no')}
                className={`py-3 rounded-lg text-center transition-all ${
                  activeTab === 'no' 
                    ? 'bg-rose-500 text-white ring-2 ring-rose-500/50' 
                    : 'bg-row hover:bg-row/80 text-light-muted'
                }`}
              >
                <div className="text-lg font-bold tabular-nums">{market.noPrice.toFixed(2)}</div>
                <div className="text-[10px] uppercase font-medium opacity-70">NO</div>
              </button>
            </div>
          </div>

          {/* Order Type */}
          <div className="px-3 pt-3">
            <div className="flex gap-1 bg-row rounded-lg p-1">
              <button 
                onClick={() => setOrderType('market')} 
                className={`flex-1 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                  orderType === 'market' ? 'bg-primary text-primary-foreground' : 'text-light-muted hover:text-light'
                }`}
              >
                Market
              </button>
              <button 
                onClick={() => setOrderType('limit')} 
                className={`flex-1 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                  orderType === 'limit' ? 'bg-primary text-primary-foreground' : 'text-light-muted hover:text-light'
                }`}
              >
                Limit
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="p-3 space-y-3 flex-1">
            <div>
              <label className="text-[10px] text-light-muted uppercase tracking-wider mb-1.5 block font-medium">Amount (USDC)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10 bg-row border-stroke text-light text-sm font-semibold rounded-lg"
                placeholder="0"
              />
              <div className="flex gap-1 mt-2">
                {[10, 50, 100, 500].map((val) => (
                  <button 
                    key={val} 
                    onClick={() => setAmount(String(val))} 
                    className="flex-1 py-1.5 text-[10px] font-medium text-light-muted bg-row hover:bg-row/80 hover:text-light rounded-md transition-colors border border-stroke"
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-row rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-light-muted">Price</span>
                <span className="text-light font-medium tabular-nums">${currentPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-light-muted">Shares</span>
                <span className="text-light font-medium tabular-nums">{shares.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] pt-2 border-t border-stroke">
                <span className="text-light-muted">Return</span>
                <span className={`font-semibold ${activeTab === 'yes' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${potential.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Buy Button */}
            <button
              onClick={handleTrade}
              className={`w-full py-3.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'yes' 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                  : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
            >
              Buy {activeTab.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
