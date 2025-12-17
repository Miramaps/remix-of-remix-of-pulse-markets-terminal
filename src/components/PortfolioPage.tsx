import { useState } from 'react';
import { Wallet, TrendingUp, Percent, LayoutGrid } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Position {
  id: string;
  category: string;
  question: string;
  side: 'YES' | 'NO';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
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
  },
];

const portfolioStats = {
  portfolioValue: 123.00,
  totalPnL: 13.25,
  returnPercent: 12.1,
  openPositions: 3,
};

export function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('positions');

  return (
    <main className="flex-1 px-4 md:px-6 2xl:px-8 py-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto mb-6">
        <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Wallet className="w-4 h-4" />
            <span>Portfolio Value</span>
          </div>
          <div className="text-xl font-semibold text-foreground">
            ${portfolioStats.portfolioValue.toFixed(2)}
          </div>
        </div>

        <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Total P&L</span>
          </div>
          <div className="text-xl font-semibold text-success">
            +${portfolioStats.totalPnL.toFixed(2)}
          </div>
        </div>

        <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Percent className="w-4 h-4" />
            <span>Return</span>
          </div>
          <div className="text-xl font-semibold text-success">
            +{portfolioStats.returnPercent}%
          </div>
        </div>

        <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <LayoutGrid className="w-4 h-4" />
            <span>Open Positions</span>
          </div>
          <div className="text-xl font-semibold text-foreground">
            {portfolioStats.openPositions}
          </div>
        </div>
      </div>

      {/* Tabs and Table */}
      <div className="max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-primary/15 rounded-none w-full justify-start gap-0 h-auto p-0">
            <TabsTrigger 
              value="positions" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-muted-foreground data-[state=active]:text-foreground"
            >
              Positions
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-muted-foreground data-[state=active]:text-foreground"
            >
              Trade History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="mt-4">
            <div className="bg-panel2 border border-primary/15 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/15 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-normal">Market</TableHead>
                    <TableHead className="text-muted-foreground font-normal text-center">Side</TableHead>
                    <TableHead className="text-muted-foreground font-normal text-right">Shares</TableHead>
                    <TableHead className="text-muted-foreground font-normal text-right">Avg Price</TableHead>
                    <TableHead className="text-muted-foreground font-normal text-right">Current</TableHead>
                    <TableHead className="text-muted-foreground font-normal text-right">P&L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPositions.map((position) => (
                    <TableRow key={position.id} className="border-primary/15 hover:bg-panel">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground bg-panel px-2 py-0.5 rounded">
                            {position.category}
                          </span>
                          <span className="text-foreground">{position.question}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          position.side === 'YES' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-error/20 text-error'
                        }`}>
                          {position.side}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-foreground">{position.shares}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ${position.avgPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-foreground">
                        ${position.currentPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        position.pnl >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="bg-panel2 border border-primary/15 rounded-lg p-8 text-center text-muted-foreground">
              No trade history yet
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
