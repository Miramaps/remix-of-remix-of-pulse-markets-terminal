import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, ChevronUp, ChevronDown, Star, Bell, Share2, Users, Wallet, GripHorizontal, ExternalLink, Trophy } from 'lucide-react';
import { Market, formatVolume, formatTimeLeft } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { TopNav } from './TopNav';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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

// Generate mock wallet activity with tx hashes
const generateWalletActivity = () => {
  const wallets = [];
  for (let i = 0; i < 6; i++) {
    wallets.push({
      id: i,
      address: `${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`,
      txHash: `${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`,
      side: Math.random() > 0.5 ? 'yes' : 'no',
      amount: Math.floor(Math.random() * 5000) + 100,
      time: `${Math.floor(Math.random() * 60)}s ago`,
    });
  }
  return wallets;
};

// Generate mock top traders
const generateTopTraders = () => {
  return [
    { id: 1, address: 'whale.sol', pnl: 12500, winRate: 78, trades: 156 },
    { id: 2, address: 'degen.sol', pnl: 8200, winRate: 65, trades: 342 },
    { id: 3, address: 'alpha.sol', pnl: 5100, winRate: 71, trades: 89 },
    { id: 4, address: 'trader.sol', pnl: 3800, winRate: 62, trades: 201 },
    { id: 5, address: 'moon.sol', pnl: 2400, winRate: 58, trades: 124 },
  ];
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
  
  const [positions] = useState(generatePositions());
  const [walletActivity] = useState(generateWalletActivity());
  const [topTraders] = useState(generateTopTraders());
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
      <div className="h-11 border-b border-primary/20 flex items-center justify-between px-4 shrink-0 bg-row/50">
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
          
          <div className="h-5 w-px bg-primary/20" />
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden bg-row ring-1 ring-primary/20">
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

        {/* Center - Chart + Bottom Panels with Resizable */}
        <div className="flex-1 flex flex-col min-w-0">
          <ResizablePanelGroup direction="vertical" className="flex-1">
            {/* Top Panel - Price Header + Chart + Order Book */}
            <ResizablePanel defaultSize={65} minSize={40}>
              <div className="h-full flex flex-col">
                {/* Price Header */}
                <div className="h-10 border-b border-primary/20 bg-row/50 px-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold tabular-nums">{lastPrice.toFixed(4)}</span>
                    <span className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-row rounded-lg p-1 border border-primary/20">
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

                {/* Chart + Order Book side by side */}
                <div className="flex-1 flex min-h-0">
                  {/* Chart */}
                  <div className="flex-1 p-3 border-r border-primary/20">
                    {priceHistory.length > 0 && <PriceChart data={priceHistory} />}
                  </div>
                  
                  {/* Order Book beside chart */}
                  <div className="w-72 p-3 flex flex-col">
                    <div className="text-[10px] text-primary uppercase tracking-wider mb-2 font-medium">Order Book</div>
                    <div className="flex-1 flex gap-3">
                      {/* Bids (Green) */}
                      <div className="flex-1 space-y-0.5">
                        {orderBook.bids.slice(0, 6).map((bid, i) => (
                          <div key={i} className="relative flex items-center h-5">
                            <div 
                              className="absolute left-0 top-0 bottom-0 bg-emerald-500/20 rounded-sm" 
                              style={{ width: `${(bid.size / maxBidSize) * 100}%` }} 
                            />
                            <span className="relative z-10 text-[10px] text-emerald-400 font-medium tabular-nums w-10">{bid.price.toFixed(2)}</span>
                            <span className="relative z-10 text-[10px] text-light-muted tabular-nums ml-auto">{(bid.size / 1000).toFixed(1)}k</span>
                          </div>
                        ))}
                      </div>
                      {/* Asks (Red) */}
                      <div className="flex-1 space-y-0.5">
                        {orderBook.asks.slice(0, 6).map((ask, i) => (
                          <div key={i} className="relative flex items-center h-5">
                            <div 
                              className="absolute right-0 top-0 bottom-0 bg-rose-500/20 rounded-sm" 
                              style={{ width: `${(ask.size / maxAskSize) * 100}%` }} 
                            />
                            <span className="relative z-10 text-[10px] text-rose-400 font-medium tabular-nums w-10">{ask.price.toFixed(2)}</span>
                            <span className="relative z-10 text-[10px] text-light-muted tabular-nums ml-auto">{(ask.size / 1000).toFixed(1)}k</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Recent Trades */}
                    <div className="mt-3 pt-3 border-t border-primary/20">
                      <div className="text-[10px] text-primary uppercase tracking-wider mb-2 font-medium">Recent Trades</div>
                      <div className="space-y-0.5">
                        {recentTrades.slice(0, 4).map((trade) => (
                          <div key={trade.id} className="flex items-center justify-between h-4">
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
                </div>
              </div>
            </ResizablePanel>
            
            {/* Resizable Handle */}
            <ResizableHandle withHandle className="bg-primary/20 hover:bg-primary/40 transition-colors">
              <div className="flex items-center justify-center h-full">
                <GripHorizontal className="w-4 h-4 text-primary/50" />
              </div>
            </ResizableHandle>
            
            {/* Bottom Panel - Positions + Top Traders + Live Activity */}
            <ResizablePanel defaultSize={35} minSize={20} maxSize={50}>
              <div className="h-full border-t border-primary/20 bg-row/30 flex">
                {/* Column 1: Your Positions */}
                <div className="flex-1 flex flex-col border-r border-primary/20 min-w-0">
                  <div className="flex items-center gap-2 px-4 h-8 border-b border-primary/20 shrink-0">
                    <Wallet className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-medium text-primary">Your Positions</span>
                  </div>
                  <div className="flex-1 p-3 overflow-auto">
                    <div className="text-[10px]">
                      <div className="grid grid-cols-5 gap-4 pb-2 border-b border-primary/15 mb-2">
                        <div className="text-primary/70 uppercase tracking-wider font-medium">Side</div>
                        <div className="text-primary/70 uppercase tracking-wider font-medium">Shares</div>
                        <div className="text-primary/70 uppercase tracking-wider font-medium">Avg Price</div>
                        <div className="text-primary/70 uppercase tracking-wider font-medium">Current</div>
                        <div className="text-primary/70 uppercase tracking-wider font-medium text-right">P&L</div>
                      </div>
                      <div className="divide-y divide-primary/10">
                        {positions.map((pos) => (
                          <div key={pos.id} className="grid grid-cols-5 gap-4 py-2">
                            <div className={`font-semibold px-2 py-0.5 rounded w-fit ${
                              pos.side === 'yes' 
                                ? 'text-emerald-400 bg-emerald-500/10' 
                                : 'text-rose-400 bg-rose-500/10'
                            }`}>
                              {pos.side.toUpperCase()}
                            </div>
                            <div className="text-light tabular-nums font-medium">{pos.shares}</div>
                            <div className="text-light tabular-nums">${pos.avgPrice.toFixed(2)}</div>
                            <div className="text-light tabular-nums">${pos.currentPrice.toFixed(2)}</div>
                            <div className={`text-right font-semibold tabular-nums ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {pos.pnl >= 0 ? '+' : ''}${Math.abs(pos.pnl)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Top Traders */}
                <div className="w-96 flex flex-col border-r border-primary/20">
                  <div className="flex items-center gap-2 px-4 h-8 border-b border-primary/20 shrink-0">
                    <Trophy className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-medium text-primary">Top Traders</span>
                  </div>
                  <div className="flex-1 p-3 overflow-auto">
                    <div className="text-[10px]">
                      <div className="grid grid-cols-4 gap-4 pb-2 border-b border-primary/15 mb-2">
                        <div className="text-primary/70 uppercase tracking-wider font-medium">Rank</div>
                        <div className="text-primary/70 uppercase tracking-wider font-medium">Trader</div>
                        <div className="text-primary/70 uppercase tracking-wider font-medium">Win Rate</div>
                        <div className="text-primary/70 uppercase tracking-wider font-medium text-right">P&L</div>
                      </div>
                      <div className="divide-y divide-primary/10">
                        {topTraders.map((t, i) => (
                          <div key={t.id} className="grid grid-cols-4 gap-4 py-2 items-center">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              i === 0 ? 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30' :
                              i === 1 ? 'bg-gray-400/20 text-gray-300 ring-1 ring-gray-400/30' :
                              i === 2 ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30' :
                              'bg-row text-light-muted'
                            }`}>
                              {i + 1}
                            </span>
                            <a 
                              href={`https://solscan.io/account/${t.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-light font-mono hover:text-primary transition-colors flex items-center gap-1"
                            >
                              {t.address}
                              <ExternalLink className="w-2.5 h-2.5 text-primary/50" />
                            </a>
                            <span className="text-light-muted bg-row/50 px-2 py-0.5 rounded w-fit">{t.winRate}%</span>
                            <span className="text-emerald-400 font-semibold tabular-nums text-right">+${t.pnl.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Live Activity */}
                <div className="w-96 flex flex-col">
                  <div className="flex items-center gap-2 px-4 h-8 border-b border-primary/20 shrink-0">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-medium text-primary">Live Activity</span>
                  </div>
                  <div className="flex-1 p-3 overflow-auto">
                    <div className="divide-y divide-primary/10">
                      {walletActivity.map((w) => (
                        <div key={w.id} className="flex items-center justify-between text-[10px] py-2.5 first:pt-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <a 
                              href={`https://solscan.io/tx/${w.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-light font-mono hover:text-primary transition-colors flex items-center gap-1.5 bg-row/50 px-2 py-1 rounded shrink-0"
                            >
                              {w.address}
                              <ExternalLink className="w-2.5 h-2.5 text-primary/50" />
                            </a>
                            <span className={`font-semibold px-2 py-0.5 rounded ${
                              w.side === 'yes' 
                                ? 'text-emerald-400 bg-emerald-500/10' 
                                : 'text-rose-400 bg-rose-500/10'
                            }`}>
                              {w.side.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-light font-medium tabular-nums">${w.amount}</span>
                            <span className="text-light-muted text-[9px]">{w.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Right Sidebar - Trading Panel */}
        <div className="w-60 border-l border-primary/20 bg-row/30 flex flex-col shrink-0">
          {/* YES/NO Toggle */}
          <div className="p-3 border-b border-primary/20">
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
