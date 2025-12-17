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

  // Generate random particles for explosion effect
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 24 + Math.random() * 15,
    distance: 150 + Math.random() * 200,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 0.1,
    duration: 0.4 + Math.random() * 0.2,
  }));

  // Spark particles
  const sparks = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 12 + Math.random() * 30,
    distance: 80 + Math.random() * 120,
    delay: 0.05 + Math.random() * 0.1,
  }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <>
            {/* Dark overlay with subtle radial gradient */}
            <motion.div
              className="fixed inset-0 bg-black/85 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />

            <div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              style={{ perspective: 1200 }}
            >
              {/* Initial flash at button position */}
              <motion.div
                className="absolute rounded-full"
                style={{ 
                  left: startX, 
                  top: startY, 
                  x: '-50%', 
                  y: '-50%',
                  background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
                }}
                initial={{ width: 56, height: 56, opacity: 1 }}
                animate={{ width: 400, height: 400, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />

              {/* Energy particles explosion */}
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full bg-primary"
                  style={{
                    left: startX,
                    top: startY,
                    width: particle.size,
                    height: particle.size,
                    boxShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary))',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
                    y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}

              {/* Spark trails */}
              {sparks.map((spark) => (
                <motion.div
                  key={`spark-${spark.id}`}
                  className="absolute"
                  style={{
                    left: startX,
                    top: startY,
                    width: 2,
                    height: 20,
                    background: 'linear-gradient(to bottom, hsl(var(--primary)), transparent)',
                    transformOrigin: 'center top',
                    rotate: `${spark.angle}deg`,
                  }}
                  initial={{ scaleY: 0, opacity: 1 }}
                  animate={{ 
                    scaleY: [0, 1, 1],
                    y: [0, spark.distance * 0.5, spark.distance],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: spark.delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}

              {/* THE PLUS SIGN — dramatic 3D flip with glow trail */}
              <motion.div
                className="absolute z-[60]"
                style={{ left: startX, top: startY, x: '-50%', y: '-50%' }}
                initial={{ scale: 1, opacity: 1, rotateZ: 0, rotateX: 0, rotateY: 0, filter: 'blur(0px)' }}
                animate={{
                  left: [startX, startX + (centerX - startX) * 0.3, centerX],
                  top: [startY, startY + (centerY - startY) * 0.2, centerY],
                  scale: [1, 3, 20],
                  rotateZ: [0, 180, 360],
                  rotateX: [0, 45, 90],
                  rotateY: [0, -30, -90],
                  opacity: [1, 1, 0],
                  filter: ['blur(0px)', 'blur(0px)', 'blur(16px)'],
                }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  times: [0, 0.4, 1],
                }}
              >
                <div className="relative">
                  {/* Glow behind */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: [1, 2, 3], opacity: [0.5, 0.3, 0] }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ filter: 'blur(20px)' }}
                  />
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="relative z-10">
                    <circle cx="28" cy="28" r="28" fill="hsl(var(--primary))" />
                    <motion.circle
                      cx="28"
                      cy="28"
                      r="28"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 0.3, repeat: 2 }}
                    />
                    <path
                      d="M28 16V40M16 28H40"
                      stroke="hsl(var(--primary-foreground))"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Multiple shockwave rings with different colors */}
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{ 
                    left: startX, 
                    top: startY, 
                    x: '-50%', 
                    y: '-50%',
                    border: i < 2 ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--primary) / 0.5)',
                  }}
                  initial={{ width: 56, height: 56, opacity: i < 2 ? 0.8 : 0.4 }}
                  animate={{ 
                    width: 600 + i * 200, 
                    height: 600 + i * 200, 
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}

              {/* Converging energy lines to center */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={`line-${i}`}
                  className="absolute bg-gradient-to-r from-transparent via-primary to-transparent"
                  style={{
                    left: '50%',
                    top: '50%',
                    height: 2,
                    width: '100%',
                    transformOrigin: 'center',
                    rotate: `${i * 45}deg`,
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ 
                    scaleX: [0, 1.5, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 + i * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}

              {/* Modal — dramatic entrance with glow */}
              <motion.div
                className="bg-[hsl(220_15%_10%)] border border-[hsl(0_0%_100%/0.12)] rounded-xl max-w-sm w-full mx-4 overflow-hidden relative pointer-events-auto"
                style={{
                  boxShadow: '0 0 60px hsl(var(--primary) / 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
                initial={{
                  opacity: 0,
                  scale: 0.85,
                  y: 40,
                  rotateX: 80,
                  rotateY: -20,
                  filter: 'blur(20px)',
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
                  scale: 0.9,
                  y: 20,
                  rotateX: 25,
                  filter: 'blur(12px)',
                  transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3), transparent, hsl(var(--primary) / 0.2))',
                  }}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                />

                {/* Blue flash overlay */}
                <motion.div
                  className="absolute inset-0 bg-primary/40 z-10 pointer-events-none"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.25, duration: 0.35, ease: 'easeOut' }}
                />

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(105deg, transparent 40%, hsl(var(--primary) / 0.15) 50%, transparent 60%)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
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
