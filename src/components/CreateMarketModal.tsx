import { useState } from 'react';
import { X, Settings, ImagePlus, Calendar } from 'lucide-react';
import { Market } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateMarketModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (market: Omit<Market, 'id' | 'yesPrice' | 'noPrice' | 'volume' | 'traders' | 'createdAt' | 'status'>) => void;
}

const categories: Market['category'][] = ['crypto', 'politics', 'sports', 'pop', 'memes'];
const liquidityPresets = [50, 100, 250, 500];

export function CreateMarketModal({ open, onClose, onCreate }: CreateMarketModalProps) {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<Market['category']>('crypto');
  const [resolveDate, setResolveDate] = useState('');
  const [liquidity, setLiquidity] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !resolveDate) return;

    onCreate({
      question,
      category,
      resolvesAt: new Date(resolveDate),
      shares: 0,
    });

    setQuestion('');
    setResolveDate('');
    setLiquidity(100);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[hsl(220_15%_10%)] border border-[hsl(0_0%_100%/0.15)] rounded-xl max-w-sm p-0 gap-0 overflow-hidden">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            >
              {/* Header */}
              <DialogHeader className="px-4 py-3 border-b border-[hsl(0_0%_100%/0.1)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <Settings className="w-4 h-4 text-[hsl(0_0%_100%/0.5)]" />
                    </motion.div>
                    <DialogTitle className="font-semibold text-sm text-[hsl(0_0%_96%)]">
                      Create Market
                    </DialogTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-[hsl(0_0%_100%/0.5)] hover:text-[hsl(0_0%_96%)] hover:bg-[hsl(0_0%_100%/0.1)]"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Add Image + Question Row */}
                <motion.div 
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  {/* Add Image Button */}
                  <button
                    type="button"
                    className="shrink-0 w-16 h-16 rounded-lg border border-dashed border-[hsl(0_0%_100%/0.2)] bg-[hsl(0_0%_100%/0.03)] flex flex-col items-center justify-center gap-1 text-[hsl(0_0%_100%/0.4)] hover:border-[hsl(0_0%_100%/0.3)] hover:bg-[hsl(0_0%_100%/0.05)] hover:text-[hsl(0_0%_100%/0.6)] transition-all duration-200"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[10px]">Add Image</span>
                  </button>

                  {/* Question Input */}
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-wider text-[hsl(0_0%_100%/0.4)]">Question</Label>
                    <Input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Will X happen by Y date?"
                      className="h-10 bg-[hsl(0_0%_100%/0.05)] border-[hsl(0_0%_100%/0.1)] text-sm text-[hsl(0_0%_96%)] placeholder:text-[hsl(0_0%_100%/0.3)] focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                {/* Category + Resolve Date Row */}
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-wider text-[hsl(0_0%_100%/0.4)]">Category</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as Market['category'])}>
                      <SelectTrigger className="h-10 bg-[hsl(0_0%_100%/0.05)] border-[hsl(0_0%_100%/0.1)] text-sm text-[hsl(0_0%_96%)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(220_15%_12%)] border-[hsl(0_0%_100%/0.15)]">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-sm text-[hsl(0_0%_96%)] capitalize hover:bg-[hsl(0_0%_100%/0.1)]">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-wider text-[hsl(0_0%_100%/0.4)]">Resolve Date</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={resolveDate}
                        onChange={(e) => setResolveDate(e.target.value)}
                        className="h-10 bg-[hsl(0_0%_100%/0.05)] border-[hsl(0_0%_100%/0.1)] text-sm text-[hsl(0_0%_96%)] pr-10"
                        required
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(0_0%_100%/0.4)] pointer-events-none" />
                    </div>
                  </div>
                </motion.div>

                {/* Initial Liquidity */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <Label className="text-[10px] uppercase tracking-wider text-[hsl(0_0%_100%/0.4)]">Initial Liquidity (USD)</Label>
                  <div className="flex gap-2">
                    {/* Custom Input */}
                    <div className="relative w-24">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(0_0%_100%/0.4)] text-sm">$</span>
                      <Input
                        type="number"
                        value={liquidity}
                        onChange={(e) => setLiquidity(Number(e.target.value))}
                        className="h-9 bg-[hsl(0_0%_100%/0.05)] border-[hsl(0_0%_100%/0.1)] text-sm text-[hsl(0_0%_96%)] pl-7"
                        min={10}
                      />
                    </div>

                    {/* Preset Buttons */}
                    <div className="flex gap-1 flex-1">
                      {liquidityPresets.map((preset) => (
                        <motion.button
                          key={preset}
                          type="button"
                          onClick={() => setLiquidity(preset)}
                          className={`flex-1 h-9 rounded-md text-xs font-medium transition-all duration-200 ${
                            liquidity === preset
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-[hsl(0_0%_100%/0.05)] text-[hsl(0_0%_100%/0.6)] border border-[hsl(0_0%_100%/0.1)] hover:bg-[hsl(0_0%_100%/0.1)] hover:text-[hsl(0_0%_96%)]'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          ${preset}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex gap-2 pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="flex-1 h-10 bg-[hsl(0_0%_100%/0.05)] border border-[hsl(0_0%_100%/0.1)] text-[hsl(0_0%_100%/0.6)] hover:bg-[hsl(0_0%_100%/0.1)] hover:text-[hsl(0_0%_96%)] text-sm"
                  >
                    Cancel
                  </Button>
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/25"
                    >
                      Create Market
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
