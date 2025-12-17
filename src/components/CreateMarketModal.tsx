import { useState } from 'react';
import { X, Settings, ImagePlus, Calendar, Plus } from 'lucide-react';
import { Market } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  onCreate: (market: Omit<
    Market,
    'id' | 'yesPrice' | 'noPrice' | 'volume' | 'traders' | 'createdAt' | 'status'
  >) => void;
  // kept for compatibility with existing callers (not required for layoutId morph)
  buttonPosition?: { x: number; y: number };
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
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />

            {/* Modal container morphs FROM the + button via layoutId */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                layoutId="create-market-fab"
                className="bg-[hsl(220_15%_10%)] border border-[hsl(0_0%_100%/0.15)] rounded-xl max-w-sm w-full mx-4 overflow-hidden shadow-2xl shadow-primary/30 relative"
                transition={{ type: 'spring', stiffness: 520, damping: 26, mass: 0.9 }}
              >
                {/* The + icon visibly morphs into the container then vanishes */}
                <motion.div
                  layoutId="create-market-plus"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  initial={false}
                  animate={{ scale: 10, rotate: 135, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Plus className="w-10 h-10 text-primary-foreground" strokeWidth={2.5} />
                </motion.div>

                {/* Shockwave / flash */}
                <motion.div
                  className="absolute inset-0 bg-primary/25"
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />

                <motion.div
                  className="absolute -inset-10 rounded-full border-2 border-primary/50"
                  initial={{ scale: 0.2, opacity: 0.7 }}
                  animate={{ scale: 1.1, opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Content wrapper */}
                <div className="relative">
                  {/* Header */}
                  <DialogHeader className="px-4 py-3 border-b border-[hsl(0_0%_100%/0.1)] relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ rotate: -180, scale: 0, opacity: 0 }}
                          animate={{ rotate: 0, scale: 1, opacity: 1 }}
                          transition={{ delay: 0.12, type: 'spring', stiffness: 260 }}
                        >
                          <Settings className="w-4 h-4 text-[hsl(0_0%_100%/0.5)]" />
                        </motion.div>
                        <motion.div
                          initial={{ x: -16, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.14, duration: 0.25 }}
                        >
                          <DialogTitle className="font-semibold text-sm text-[hsl(0_0%_96%)]">
                            Create Market
                          </DialogTitle>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ rotate: 90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.16, type: 'spring' }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-[hsl(0_0%_100%/0.5)] hover:text-[hsl(0_0%_96%)] hover:bg-[hsl(0_0%_100%/0.1)]"
                          onClick={onClose}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Add Image + Question Row */}
                    <motion.div
                      className="flex gap-3"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12, duration: 0.22 }}
                    >
                      <motion.button
                        type="button"
                        className="shrink-0 w-16 h-16 rounded-lg border border-dashed border-[hsl(0_0%_100%/0.2)] bg-[hsl(0_0%_100%/0.03)] flex flex-col items-center justify-center gap-1 text-[hsl(0_0%_100%/0.4)] hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ImagePlus className="w-5 h-5" />
                        <span className="text-[10px]">Add Image</span>
                      </motion.button>

                      <div className="flex-1 space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider text-[hsl(0_0%_100%/0.4)]">
                          Question
                        </Label>
                        <Input
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="Will X happen by Y date?"
                          className="h-10 bg-[hsl(0_0%_100%/0.05)] border-[hsl(0_0%_100%/0.1)] text-sm text-[hsl(0_0%_96%)] placeholder:text-[hsl(0_0%_100%/0.3)] focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Category + Resolve Date */}
                    <motion.div
                      className="grid grid-cols-2 gap-3"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16, duration: 0.22 }}
                    >
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider text-[hsl(0_0%_100%/0.4)]">
                          Category
                        </Label>
                        <Select value={category} onValueChange={(v) => setCategory(v as Market['category'])}>
                          <SelectTrigger className="h-10 bg-[hsl(0_0%_100%/0.05)] border-[hsl(0_0%_100%/0.1)] text-sm text-[hsl(0_0%_96%)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[hsl(220_15%_12%)] border-[hsl(0_0%_100%/0.15)]">
                            {categories.map((cat) => (
                              <SelectItem
                                key={cat}
                                value={cat}
                                className="text-sm text-[hsl(0_0%_96%)] capitalize hover:bg-[hsl(0_0%_100%/0.1)]"
                              >
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider text-[hsl(0_0%_100%/0.4)]">
                          Resolve Date
                        </Label>
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

                    {/* Liquidity */}
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.22 }}
                    >
                      <Label className="text-[10px] uppercase tracking-wider text-[hsl(0_0%_100%/0.4)]">
                        Initial Liquidity (USD)
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative w-24">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(0_0%_100%/0.4)] text-sm">
                            $
                          </span>
                          <Input
                            type="number"
                            value={liquidity}
                            onChange={(e) => setLiquidity(Number(e.target.value))}
                            className="h-9 bg-[hsl(0_0%_100%/0.05)] border-[hsl(0_0%_100%/0.1)] text-sm text-[hsl(0_0%_96%)] pl-7"
                            min={10}
                          />
                        </div>

                        <div className="flex gap-1 flex-1">
                          {liquidityPresets.map((preset) => (
                            <motion.button
                              key={preset}
                              type="button"
                              onClick={() => setLiquidity(preset)}
                              className={`flex-1 h-9 rounded-md text-xs font-medium transition-all duration-200 ${
                                liquidity === preset
                                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                  : 'bg-[hsl(0_0%_100%/0.05)] text-[hsl(0_0%_100%/0.6)] border border-[hsl(0_0%_100%/0.1)] hover:bg-[hsl(0_0%_100%/0.1)] hover:text-[hsl(0_0%_96%)]'
                              }`}
                              whileHover={{ scale: 1.06 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              ${preset}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                      className="flex gap-2 pt-2"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.24, duration: 0.22 }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="w-full h-10 bg-[hsl(0_0%_100%/0.05)] border border-[hsl(0_0%_100%/0.1)] text-[hsl(0_0%_100%/0.6)] hover:bg-[hsl(0_0%_100%/0.1)] hover:text-[hsl(0_0%_96%)] text-sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30"
                      >
                        Create Market
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
