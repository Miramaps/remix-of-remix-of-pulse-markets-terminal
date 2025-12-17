import { useState } from 'react';
import { X, Settings, ImagePlus, Calendar } from 'lucide-react';
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
  buttonPosition?: { x: number; y: number };
}

const categories: Market['category'][] = ['crypto', 'politics', 'sports', 'pop', 'memes'];
const liquidityPresets = [50, 100, 250, 500];

export function CreateMarketModal({ open, onClose, onCreate, buttonPosition }: CreateMarketModalProps) {
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

  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
  const startX = buttonPosition?.x ?? centerX;
  const startY = buttonPosition?.y ?? 56;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <>
            {/* Dark overlay */}
            <motion.div
              className="fixed inset-0 bg-black/80 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />

            <div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              style={{ perspective: 1200 }}
            >
              {/* THE PLUS SIGN — cinematic flip + dissolve into the modal */}
              <motion.div
                className="absolute z-[60]"
                style={{ left: startX, top: startY, x: '-50%', y: '-50%' }}
                initial={{ scale: 1, opacity: 1, rotateZ: 0, rotateX: 0, rotateY: 0, filter: 'blur(0px)' }}
                animate={{
                  left: [startX, centerX, centerX],
                  top: [startY, centerY, centerY],
                  scale: [1, 7, 18],
                  rotateZ: [0, 110, 180],
                  rotateX: [0, 55, 90],
                  rotateY: [0, -25, -60],
                  opacity: [1, 1, 0],
                  filter: ['blur(0px)', 'blur(0px)', 'blur(12px)'],
                }}
                transition={{
                  duration: 0.48,
                  ease: [0.22, 1, 0.36, 1],
                  times: [0, 0.55, 1],
                }}
              >
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="28" fill="hsl(var(--primary))" />
                  <path
                    d="M28 16V40M16 28H40"
                    stroke="hsl(var(--primary-foreground))"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              {/* Shockwave rings from button */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border-2 border-primary"
                  style={{ left: startX, top: startY, x: '-50%', y: '-50%' }}
                  initial={{ width: 56, height: 56, opacity: 0.7 }}
                  animate={{ width: 900 + i * 180, height: 900 + i * 180, opacity: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}

              {/* Modal — crisp flip-in (no spring wobble) */}
              <motion.div
                className="bg-[hsl(220_15%_10%)] border border-[hsl(0_0%_100%/0.12)] rounded-xl max-w-sm w-full mx-4 overflow-hidden shadow-2xl shadow-primary/20 relative pointer-events-auto"
                initial={{
                  opacity: 0,
                  scale: 0.92,
                  y: 26,
                  rotateX: 70,
                  rotateY: -18,
                  filter: 'blur(12px)',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  rotateX: 0,
                  rotateY: 0,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  y: 16,
                  rotateX: 20,
                  filter: 'blur(10px)',
                  transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
                }}
                transition={{
                  delay: 0.16,
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Blue flash overlay */}
                <motion.div
                  className="absolute inset-0 bg-primary/30 z-10 pointer-events-none"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.3, ease: 'easeOut' }}
                />

                {/* Content */}
                <div className="relative">
                  <DialogHeader className="px-4 py-3 border-b border-[hsl(0_0%_100%/0.1)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.35, duration: 0.2, ease: 'easeOut' }}
                        >
                          <Settings className="w-4 h-4 text-[hsl(0_0%_100%/0.5)]" />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.38, duration: 0.2 }}
                        >
                          <DialogTitle className="font-semibold text-sm text-[hsl(0_0%_96%)]">
                            Create Market
                          </DialogTitle>
                        </motion.div>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.15, ease: 'easeOut' }}
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
                    <motion.div
                      className="flex gap-3"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32, duration: 0.2, ease: 'easeOut' }}
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
                          className="h-10 bg-[hsl(0_0%_100%/0.05)] border-[hsl(0_0%_100%/0.1)] text-sm text-[hsl(0_0%_96%)] placeholder:text-[hsl(0_0%_100%/0.3)] focus:border-primary focus:ring-1 focus:ring-primary/30"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-2 gap-3"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.36, duration: 0.2, ease: 'easeOut' }}
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

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.2, ease: 'easeOut' }}
                    >
                      <Label className="text-[10px] uppercase tracking-wider text-[hsl(0_0%_100%/0.4)]">
                        Initial Liquidity (USD)
                      </Label>
                      <div className="flex gap-2">
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
                        <div className="flex gap-1 flex-1">
                          {liquidityPresets.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setLiquidity(preset)}
                              className={`flex-1 h-9 rounded-md text-xs font-medium transition-all duration-150 ${
                                liquidity === preset
                                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                  : 'bg-[hsl(0_0%_100%/0.05)] text-[hsl(0_0%_100%/0.6)] border border-[hsl(0_0%_100%/0.1)] hover:bg-[hsl(0_0%_100%/0.1)]'
                              }`}
                            >
                              ${preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex gap-2 pt-2"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.44, duration: 0.2, ease: 'easeOut' }}
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
