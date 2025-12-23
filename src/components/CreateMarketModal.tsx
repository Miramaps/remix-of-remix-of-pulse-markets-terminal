import { useState } from 'react';
import { X, ImagePlus, Calendar, Link2 } from 'lucide-react';
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


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <>
            {/* Dark overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />

            <div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              {/* Modal container */}
              <motion.div
                className="relative max-w-md w-full mx-4 pointer-events-auto"
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: 15,
                  transition: { duration: 0.15, ease: 'easeIn' },
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Main modal card */}
                <div
                  className="relative bg-panel-glass border border-stroke rounded-xl overflow-hidden"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {/* Shimmer/mirror effect across the modal */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)',
                      backgroundSize: '200% 100%',
                    }}
                    initial={{ backgroundPosition: '-100% 0' }}
                    animate={{ backgroundPosition: '200% 0' }}
                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeInOut' }}
                  />

                  {/* Content */}
                  <div className="relative">
                  <DialogHeader className="px-5 py-4 border-b border-stroke">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="font-semibold text-base text-light">
                        Create Market
                      </DialogTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-light-muted hover:text-light hover:bg-row-hover"
                        onClick={onClose}
                      >
                        <X className="w-4 h-4" />
                      </Button>
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
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </Dialog>
  );
}