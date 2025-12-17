import { useState } from 'react';
import { X, Settings, ImagePlus, Calendar, Link2 } from 'lucide-react';
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
  const [communityUrl, setCommunityUrl] = useState('');

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
    setCommunityUrl('');
    onClose();
  };

  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
  const startX = buttonPosition?.x ?? centerX;
  const startY = buttonPosition?.y ?? 56;

  // Smaller particle explosion
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 12 + Math.random() * 15,
    distance: 60 + Math.random() * 80,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 0.08,
    duration: 0.35,
  }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <>
            {/* Dark overlay */}
            <motion.div
              className="fixed inset-0 bg-black/55 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />

            <div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              style={{ perspective: 1200 }}
            >
              {/* Small flash at button */}
              <motion.div
                className="absolute rounded-full"
                style={{ 
                  left: startX, 
                  top: startY, 
                  x: '-50%', 
                  y: '-50%',
                  background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
                }}
                initial={{ width: 44, height: 44, opacity: 0.8 }}
                animate={{ width: 180, height: 180, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />

              {/* Small particles */}
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full bg-primary"
                  style={{
                    left: startX,
                    top: startY,
                    width: particle.size,
                    height: particle.size,
                    boxShadow: '0 0 6px hsl(var(--primary))',
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

              {/* Plus sign animation - smaller scale */}
              <motion.div
                className="absolute z-[60]"
                style={{ left: startX, top: startY, x: '-50%', y: '-50%' }}
                initial={{ scale: 1, opacity: 1, rotateZ: 0 }}
                animate={{
                  left: [startX, centerX],
                  top: [startY, centerY],
                  scale: [1, 2, 8],
                  rotateZ: [0, 180],
                  opacity: [1, 1, 0],
                  filter: ['blur(0px)', 'blur(0px)', 'blur(8px)'],
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                  times: [0, 0.5, 1],
                }}
              >
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <circle cx="22" cy="22" r="22" fill="hsl(var(--primary))" />
                  <path
                    d="M22 12V32M12 22H32"
                    stroke="hsl(var(--primary-foreground))"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              {/* Two subtle shockwave rings */}
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-primary/60"
                  style={{ left: startX, top: startY, x: '-50%', y: '-50%' }}
                  initial={{ width: 44, height: 44, opacity: 0.6 }}
                  animate={{ width: 200 + i * 80, height: 200 + i * 80, opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}

              {/* Modal - bigger width */}
              <motion.div
                className="bg-panel-glass border border-stroke rounded-xl max-w-md w-full mx-4 overflow-hidden relative pointer-events-auto"
                style={{
                  boxShadow: '0 0 40px hsl(var(--primary) / 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                }}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 30,
                  filter: 'blur(10px)',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: 15,
                  filter: 'blur(8px)',
                  transition: { duration: 0.15, ease: [0.4, 0, 1, 1] },
                }}
                transition={{
                  delay: 0.15,
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Blue flash overlay */}
                <motion.div
                  className="absolute inset-0 bg-primary/30 z-10 pointer-events-none"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.25, ease: 'easeOut' }}
                />

                {/* Content */}
                <div className="relative">
                  <DialogHeader className="px-5 py-4 border-b border-stroke">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.25, duration: 0.2, ease: 'easeOut' }}
                        >
                          <Settings className="w-4 h-4 text-light-muted" />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.28, duration: 0.2 }}
                        >
                          <DialogTitle className="font-semibold text-base text-light">
                            Create Market
                          </DialogTitle>
                        </motion.div>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.15, ease: 'easeOut' }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-light-muted hover:text-light hover:bg-row-hover"
                          onClick={onClose}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <motion.div
                      className="flex gap-4"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22, duration: 0.2, ease: 'easeOut' }}
                    >
                      <motion.button
                        type="button"
                        className="shrink-0 w-20 h-20 rounded-lg border border-dashed border-stroke bg-row/30 flex flex-col items-center justify-center gap-1 text-light-muted hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <ImagePlus className="w-6 h-6" />
                        <span className="text-[10px]">Add Image</span>
                      </motion.button>

                      <div className="flex-1 space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider text-light-muted">
                          Question
                        </Label>
                        <Input
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="Will X happen by Y date?"
                          className="h-11 bg-row/50 border-stroke text-sm text-light placeholder:text-light-muted/50 focus:border-primary focus:ring-1 focus:ring-primary/30"
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Community URL field */}
                    <motion.div
                      className="space-y-1.5"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.26, duration: 0.2, ease: 'easeOut' }}
                    >
                      <Label className="text-[10px] uppercase tracking-wider text-light-muted">
                        Community URL <span className="text-light-muted/50">(optional)</span>
                      </Label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted" />
                        <Input
                          value={communityUrl}
                          onChange={(e) => setCommunityUrl(e.target.value)}
                          placeholder="https://x.com/community or Discord, Telegram..."
                          className="h-11 bg-row/50 border-stroke text-sm text-light placeholder:text-light-muted/50 focus:border-primary focus:ring-1 focus:ring-primary/30 pl-10"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.30, duration: 0.2, ease: 'easeOut' }}
                    >
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider text-light-muted">
                          Category
                        </Label>
                        <Select value={category} onValueChange={(v) => setCategory(v as Market['category'])}>
                          <SelectTrigger className="h-11 bg-row/50 border-stroke text-sm text-light">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-panel backdrop-blur-xl border-stroke">
                            {categories.map((cat) => (
                              <SelectItem
                                key={cat}
                                value={cat}
                                className="text-sm text-light capitalize hover:bg-row-hover"
                              >
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-wider text-light-muted">
                          Resolve Date
                        </Label>
                        <div className="relative">
                          <Input
                            type="date"
                            value={resolveDate}
                            onChange={(e) => setResolveDate(e.target.value)}
                            className="h-11 bg-row/50 border-stroke text-sm text-light pr-10"
                            required
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted pointer-events-none" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.34, duration: 0.2, ease: 'easeOut' }}
                    >
                      <Label className="text-[10px] uppercase tracking-wider text-light-muted">
                        Initial Liquidity (USD)
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative w-28">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-muted text-sm">$</span>
                          <Input
                            type="number"
                            value={liquidity}
                            onChange={(e) => setLiquidity(Number(e.target.value))}
                            className="h-10 bg-row/50 border-stroke text-sm text-light pl-7"
                            min={10}
                          />
                        </div>
                        <div className="flex gap-1.5 flex-1">
                          {liquidityPresets.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setLiquidity(preset)}
                              className={`flex-1 h-10 rounded-md text-xs font-medium transition-all duration-150 ${
                                liquidity === preset
                                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                  : 'bg-row/50 text-light-muted border border-stroke hover:bg-row-hover'
                              }`}
                            >
                              ${preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex gap-3 pt-3"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.38, duration: 0.2, ease: 'easeOut' }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="w-full h-11 bg-row/50 border border-stroke text-light-muted hover:bg-row-hover hover:text-light text-sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/30"
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