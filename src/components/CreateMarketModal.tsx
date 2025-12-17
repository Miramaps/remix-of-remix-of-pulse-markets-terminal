import { useState, useEffect } from 'react';
import { X, Settings, ImagePlus, Calendar, Plus } from 'lucide-react';
import { Market } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
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
  buttonPosition?: { x: number; y: number };
}

const categories: Market['category'][] = ['crypto', 'politics', 'sports', 'pop', 'memes'];
const liquidityPresets = [50, 100, 250, 500];

export function CreateMarketModal({ open, onClose, onCreate, buttonPosition }: CreateMarketModalProps) {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<Market['category']>('crypto');
  const [resolveDate, setResolveDate] = useState('');
  const [liquidity, setLiquidity] = useState(100);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'expanding' | 'morphing' | 'done'>('idle');

  useEffect(() => {
    if (open) {
      setAnimationPhase('expanding');
      const t1 = setTimeout(() => setAnimationPhase('morphing'), 150);
      const t2 = setTimeout(() => setAnimationPhase('done'), 400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setAnimationPhase('idle');
    }
  }, [open]);

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
  const startY = buttonPosition?.y ?? centerY - 200;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay with quick fade */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Explosion rings */}
            <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border-2 border-primary"
                  style={{
                    left: startX,
                    top: startY,
                    x: '-50%',
                    y: '-50%',
                  }}
                  initial={{ width: 56, height: 56, opacity: 0.8 }}
                  animate={{ 
                    width: [56, 600 + i * 200], 
                    height: [56, 600 + i * 200], 
                    opacity: [0.8, 0] 
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: i * 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                />
              ))}
            </div>

            {/* The expanding + button that morphs into modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              {/* Giant expanding button phase */}
              <motion.div
                className="absolute bg-primary rounded-full flex items-center justify-center"
                style={{
                  left: startX,
                  top: startY,
                  x: '-50%',
                  y: '-50%',
                }}
                initial={{ width: 56, height: 56, scale: 1 }}
                animate={animationPhase === 'expanding' || animationPhase === 'morphing' || animationPhase === 'done' 
                  ? { 
                      width: animationPhase === 'expanding' ? 200 : 0,
                      height: animationPhase === 'expanding' ? 200 : 0,
                      scale: animationPhase === 'expanding' ? 1.5 : 0,
                      opacity: animationPhase === 'done' ? 0 : 1,
                      left: animationPhase === 'expanding' ? startX : centerX,
                      top: animationPhase === 'expanding' ? startY : centerY,
                    } 
                  : {}
                }
                transition={{ 
                  duration: 0.15, 
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <motion.div
                  initial={{ scale: 1, rotate: 0 }}
                  animate={{ scale: [1, 2, 0], rotate: [0, 180, 360] }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Plus className="w-12 h-12 text-primary-foreground" />
                </motion.div>
              </motion.div>

              {/* Modal container - bursts in */}
              <motion.div
                className="bg-[hsl(220_15%_10%)] border border-[hsl(0_0%_100%/0.15)] rounded-xl max-w-sm w-full mx-4 overflow-hidden shadow-2xl shadow-primary/30 relative pointer-events-auto"
                initial={{ 
                  scale: 0,
                  borderRadius: '50%',
                  opacity: 0,
                }}
                animate={{ 
                  scale: 1,
                  borderRadius: '12px',
                  opacity: 1,
                }}
                exit={{ 
                  scale: 0.8,
                  opacity: 0,
                  transition: { duration: 0.15 }
                }}
                transition={{ 
                  delay: 0.12,
                  duration: 0.35,
                  type: "spring",
                  stiffness: 300,
                  damping: 22
                }}
              >
                {/* Blue glow burst */}
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                />

                {/* Glow line at top */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-1 bg-primary rounded-full blur-sm"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 120, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                />

                {/* Content */}
                <div className="relative">
                  {/* Header */}
                  <DialogHeader className="px-4 py-3 border-b border-[hsl(0_0%_100%/0.1)] relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ rotate: -180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ delay: 0.25, type: "spring", stiffness: 300 }}
                        >
                          <Settings className="w-4 h-4 text-[hsl(0_0%_100%/0.5)]" />
                        </motion.div>
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.28, duration: 0.25 }}
                        >
                          <DialogTitle className="font-semibold text-sm text-[hsl(0_0%_96%)]">
                            Create Market
                          </DialogTitle>
                        </motion.div>
                      </div>
                      <motion.div
                        initial={{ rotate: 90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
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
                      initial={{ opacity: 0, y: 40, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.32, type: "spring", stiffness: 250 }}
                    >
                      {/* Add Image Button */}
                      <motion.button
                        type="button"
                        className="shrink-0 w-16 h-16 rounded-lg border border-dashed border-[hsl(0_0%_100%/0.2)] bg-[hsl(0_0%_100%/0.03)] flex flex-col items-center justify-center gap-1 text-[hsl(0_0%_100%/0.4)] hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ImagePlus className="w-5 h-5" />
                        <span className="text-[10px]">Add Image</span>
                      </motion.button>

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
                      initial={{ opacity: 0, y: 40, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.38, type: "spring", stiffness: 250 }}
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
                      initial={{ opacity: 0, y: 40, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.44, type: "spring", stiffness: 250 }}
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
                          {liquidityPresets.map((preset, index) => (
                            <motion.button
                              key={preset}
                              type="button"
                              onClick={() => setLiquidity(preset)}
                              className={`flex-1 h-9 rounded-md text-xs font-medium transition-all duration-200 ${
                                liquidity === preset
                                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                  : 'bg-[hsl(0_0%_100%/0.05)] text-[hsl(0_0%_100%/0.6)] border border-[hsl(0_0%_100%/0.1)] hover:bg-[hsl(0_0%_100%/0.1)] hover:text-[hsl(0_0%_96%)]'
                              }`}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.48 + index * 0.04, type: "spring", stiffness: 400 }}
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.95 }}
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
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, type: "spring", stiffness: 250 }}
                    >
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={onClose}
                          className="w-full h-10 bg-[hsl(0_0%_100%/0.05)] border border-[hsl(0_0%_100%/0.1)] text-[hsl(0_0%_100%/0.6)] hover:bg-[hsl(0_0%_100%/0.1)] hover:text-[hsl(0_0%_96%)] text-sm"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                      <motion.div 
                        className="flex-1" 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30"
                        >
                          Create Market
                        </Button>
                      </motion.div>
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
