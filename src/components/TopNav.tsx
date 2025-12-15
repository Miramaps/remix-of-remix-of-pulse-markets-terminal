import { useState } from 'react';
import { Search, ChevronDown, Wallet, Plus, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface TopNavProps {
  onCreateMarket: () => void;
}

export function TopNav({ onCreateMarket }: TopNavProps) {
  const [activeNav, setActiveNav] = useState('Pulse');
  const [chain, setChain] = useState<'SOL' | 'ETH'>('SOL');

  const navItems = ['Discover', 'Pulse', 'Trackers', 'Markets', 'Portfolio', 'Rewards'];

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-panel/95 backdrop-blur-md noise-overlay">
      <div className="flex h-full items-center justify-between px-4 gap-4">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-7 h-7 rounded-lg bg-accent-gold flex items-center justify-center">
              <span className="text-background font-bold text-sm">P</span>
            </div>
            <span className="text-accent-gold font-semibold tracking-tight hidden sm:inline">
              PULSEMARKETS
            </span>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                  activeNav === item
                    ? 'text-accent-gold bg-panel2'
                    : 'text-muted-foreground hover:text-foreground hover:bg-panel2/50'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search markets, topics…"
              className="pl-9 h-9 bg-panel2 border-border text-sm placeholder:text-muted-foreground focus:border-border-hover focus:ring-accent-gold/20"
            />
          </div>
        </div>

        {/* Right: Chain, Wallet, Actions */}
        <div className="flex items-center gap-3">
          {/* Chain Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5 bg-panel2 border-border hover:border-border-hover hover:bg-panel2"
              >
                <span className="font-mono text-xs">{chain}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-panel border-border">
              <DropdownMenuItem onClick={() => setChain('SOL')} className="text-sm">
                <span className="mr-2">◎</span> Solana
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChain('ETH')} className="text-sm">
                <span className="mr-2">Ξ</span> Ethereum
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Balance Pill */}
          <Badge variant="secondary" className="h-8 px-3 bg-panel2 border border-border text-xs font-mono">
            0.033 {chain}
          </Badge>

          {/* Wallet Connect */}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1.5 bg-panel2 border-border hover:border-border-hover hover:bg-panel2"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Connect</span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-panel2"
          >
            <Bell className="w-4 h-4" />
          </Button>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-panel2 hidden sm:flex"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Create Market */}
          <Button 
            onClick={onCreateMarket}
            size="sm"
            className="h-8 gap-1.5 bg-accent-gold text-background hover:bg-accent-gold-muted font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
