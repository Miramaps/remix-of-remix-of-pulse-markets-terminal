import { useState } from 'react';
import { Search, ChevronDown, Wallet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { NavLink } from './NavLink';

interface TopNavProps {
  onCreateMarket: () => void;
}

export function TopNav({ onCreateMarket }: TopNavProps) {
  const [chain, setChain] = useState<'SOL' | 'ETH'>('SOL');

  const navItems = ['Discover', 'Pulse', 'Trackers', 'Markets', 'Portfolio', 'Rewards'];

  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-md border-b border-light">
      <div className="h-16 px-6 flex items-center justify-between gap-8">
        {/* Left: Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.01 }}
        >
          <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center">
            <span className="text-canvas font-display font-bold text-sm">P</span>
          </div>
          <span className="font-display font-semibold text-ink tracking-tight text-lg hidden sm:block">
            PULSEMARKETS
          </span>
        </motion.div>

        {/* Center: Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink key={item} href="#">{item}</NavLink>
          ))}
        </nav>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-ink" />
            <Input
              placeholder="Search markets…"
              className="pl-11 h-10 w-64 bg-canvas2 border-border-light rounded-full text-sm placeholder:text-muted-ink focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
            />
          </div>

          {/* Chain Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 gap-2 bg-canvas2 border-border-light hover:border-gold hover:bg-canvas2 rounded-xl text-ink"
              >
                <span className="font-medium text-sm">{chain}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-ink" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel rounded-xl">
              <DropdownMenuItem onClick={() => setChain('SOL')} className="text-panel">
                <span className="mr-2">◎</span> Solana
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChain('ETH')} className="text-panel">
                <span className="mr-2">Ξ</span> Ethereum
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Balance */}
          <div className="hidden sm:flex items-center gap-2 px-3 h-9 bg-canvas2 border border-border-light rounded-xl">
            <div className="w-2 h-2 rounded-full bg-accent-lime animate-pulse" />
            <span className="text-sm font-medium text-ink">0.033 {chain}</span>
          </div>

          {/* Connect */}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-2 bg-canvas2 border-border-light hover:border-gold hover:bg-canvas2 rounded-xl text-ink"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Connect</span>
          </Button>

          {/* Create */}
          <Button 
            onClick={onCreateMarket}
            size="sm"
            className="h-9 gap-2 bg-ink text-canvas hover:bg-ink/90 rounded-xl font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
