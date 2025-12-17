import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Percent, LayoutGrid, Clock, ArrowUpRight, ArrowDownRight, PieChart, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

interface Position {
  id: string;
  category: string;
  question: string;
  side: 'YES' | 'NO';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface Trade {
  id: string;
  question: string;
  side: 'YES' | 'NO';
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  total: number;
  time: string;
}

const mockPositions: Position[] = [
  {
    id: '1',
    category: 'Crypto',
    question: 'Will BTC reach $150k by EOY?',
    side: 'YES',
    shares: 50,
    avgPrice: 0.42,
    currentPrice: 0.58,
    pnl: 8.00,
    pnlPercent: 38.1,
  },
  {
    id: '2',
    category: 'Crypto',
    question: 'Will ETH flip BTC market cap?',
    side: 'NO',
    shares: 100,
    avgPrice: 0.75,
    currentPrice: 0.82,
    pnl: 7.00,
    pnlPercent: 9.3,
  },
  {
    id: '3',
    category: 'Politics',
    question: 'Trump wins 2024 election?',
    side: 'YES',
    shares: 25,
    avgPrice: 0.55,
    currentPrice: 0.48,
    pnl: -1.75,
    pnlPercent: -12.7,
  },
  {
    id: '4',
    category: 'Sports',
    question: 'Lakers win NBA Championship?',
    side: 'YES',
    shares: 40,
    avgPrice: 0.32,
    currentPrice: 0.45,
    pnl: 5.20,
    pnlPercent: 40.6,
  },
];

const mockTrades: Trade[] = [
  { id: '1', question: 'Will BTC reach $150k by EOY?', side: 'YES', type: 'BUY', shares: 25, price: 0.40, total: 10.00, time: '2 hours ago' },
  { id: '2', question: 'Will ETH flip BTC market cap?', side: 'NO', type: 'BUY', shares: 50, price: 0.72, total: 36.00, time: '5 hours ago' },
  { id: '3', question: 'Trump wins 2024 election?', side: 'YES', type: 'BUY', shares: 25, price: 0.55, total: 13.75, time: '1 day ago' },
  { id: '4', question: 'Will BTC reach $150k by EOY?', side: 'YES', type: 'BUY', shares: 25, price: 0.44, total: 11.00, time: '2 days ago' },
  { id: '5', question: 'Lakers win NBA Championship?', side: 'YES', type: 'BUY', shares: 40, price: 0.32, total: 12.80, time: '3 days ago' },
];

const portfolioStats = {
  portfolioValue: 156.45,
  totalPnL: 18.45,
  returnPercent: 13.4,
  openPositions: 4,
  winRate: 75,
  totalTrades: 12,
};

const allocation = [
  { category: 'Crypto', percent: 58, color: 'bg-orange-500' },
  { category: 'Politics', percent: 22, color: 'bg-sky-500' },
  { category: 'Sports', percent: 20, color: 'bg-emerald-500' },
];

export function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('positions');

  return (
    <main className="flex-1 px-4 md:px-6 2xl:px-8 py-4 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Top Row - Stats & Allocation */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          {/* Main Stats */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
              <div className="flex items-center gap-2 text-light-muted text-xs mb-2">
                <Wallet className="w-3.5 h-3.5" />
                <span>Portfolio Value</span>
              </div>
              <div className="text-2xl font-bold text-light tabular-nums">
                ${portfolioStats.portfolioValue.toFixed(2)}
              </div>
            </div>

            <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
              <div className="flex items-center gap-2 text-light-muted text-xs mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Total P&L</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                  +${portfolioStats.totalPnL.toFixed(2)}
                </span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
              <div className="flex items-center gap-2 text-light-muted text-xs mb-2">
                <Percent className="w-3.5 h-3.5" />
                <span>Return</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                  +{portfolioStats.returnPercent}%
                </span>
              </div>
            </div>

            <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
              <div className="flex items-center gap-2 text-light-muted text-xs mb-2">
                <Activity className="w-3.5 h-3.5" />
                <span>Win Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-light tabular-nums">
                  {portfolioStats.winRate}%
                </span>
                <span className="text-xs text-light-muted">({portfolioStats.totalTrades} trades)</span>
              </div>
            </div>
          </div>

          {/* Allocation */}
          <div className="col-span-12 lg:col-span-4 bg-panel2 border border-primary/15 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-light-muted text-xs">
                <PieChart className="w-3.5 h-3.5" />
                <span>Allocation</span>
              </div>
              <span className="text-xs text-light-muted">{portfolioStats.openPositions} positions</span>
            </div>
            <div className="space-y-2">
              {allocation.map((item) => (
                <div key={item.category} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-light flex-1">{item.category}</span>
                  <span className="text-xs text-light-muted tabular-nums">{item.percent}%</span>
                  <div className="w-20 h-1.5 bg-row rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs and Table */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-primary/15 rounded-none w-full justify-start gap-0 h-auto p-0 mb-0">
            <TabsTrigger 
              value="positions" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2.5 text-light-muted data-[state=active]:text-light text-sm"
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Positions ({mockPositions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2.5 text-light-muted data-[state=active]:text-light text-sm"
            >
              <Clock className="w-4 h-4 mr-2" />
              Trade History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="mt-0">
            <div className="bg-panel2 border border-primary/15 border-t-0 rounded-b-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/15 hover:bg-transparent">
                    <TableHead className="text-light-muted text-xs font-medium">Market</TableHead>
                    <TableHead className="text-light-muted text-xs font-medium text-center">Side</TableHead>
                    <TableHead className="text-light-muted text-xs font-medium text-right">Shares</TableHead>
                    <TableHead className="text-light-muted text-xs font-medium text-right">Avg</TableHead>
                    <TableHead className="text-light-muted text-xs font-medium text-right">Current</TableHead>
                    <TableHead className="text-light-muted text-xs font-medium text-right">P&L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPositions.map((position) => (
                    <TableRow key={position.id} className="border-primary/15 hover:bg-row/50 cursor-pointer">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-light-muted bg-row px-1.5 py-0.5 rounded uppercase">
                            {position.category}
                          </span>
                          <span className="text-sm text-light">{position.question}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded ${
                          position.side === 'YES' 
                            ? 'bg-emerald-500/15 text-emerald-400' 
                            : 'bg-rose-500/15 text-rose-400'
                        }`}>
                          {position.side}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm text-light tabular-nums">{position.shares}</TableCell>
                      <TableCell className="text-right text-sm text-light-muted tabular-nums">
                        {position.avgPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-light tabular-nums">
                        {position.currentPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {position.pnl >= 0 ? (
                            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-rose-400" />
                          )}
                          <span className={`text-sm font-medium tabular-nums ${
                            position.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                          </span>
                          <span className={`text-[10px] ${
                            position.pnlPercent >= 0 ? 'text-emerald-400/70' : 'text-rose-400/70'
                          }`}>
                            ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent}%)
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <div className="bg-panel2 border border-primary/15 border-t-0 rounded-b-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/15 hover:bg-transparent">
                    <TableHead className="text-light-muted text-xs font-medium">Market</TableHead>
                    <TableHead className="text-light-muted text-xs font-medium text-center">Type</TableHead>
                    <TableHead className="text-light-muted text-xs font-medium text-center">Side</TableHead>
                    <TableHead className="text-light-muted text-xs font-medium text-right">Shares</TableHead>
                    <TableHead className="text-light-muted text-xs font-medium text-right">Price</TableHead>
                    <TableHead className="text-light-muted text-xs font-medium text-right">Total</TableHead>
                    <TableHead className="text-light-muted text-xs font-medium text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTrades.map((trade) => (
                    <TableRow key={trade.id} className="border-primary/15 hover:bg-row/50">
                      <TableCell className="py-3">
                        <span className="text-sm text-light line-clamp-1">{trade.question}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded ${
                          trade.type === 'BUY' 
                            ? 'bg-primary/15 text-primary' 
                            : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          {trade.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded ${
                          trade.side === 'YES' 
                            ? 'bg-emerald-500/15 text-emerald-400' 
                            : 'bg-rose-500/15 text-rose-400'
                        }`}>
                          {trade.side}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm text-light tabular-nums">{trade.shares}</TableCell>
                      <TableCell className="text-right text-sm text-light-muted tabular-nums">
                        {trade.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-light tabular-nums">
                        ${trade.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-light-muted">
                        {trade.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
