import { useState } from 'react';
import { Calendar, DollarSign, Link2, FileText, Tag } from 'lucide-react';
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
import { Market } from '@/lib/mockData';
import { motion } from 'framer-motion';

interface CreateMarketModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (market: Omit<Market, 'id' | 'yesPrice' | 'noPrice' | 'volume' | 'traders' | 'createdAt' | 'status'>) => void;
}

export function CreateMarketModal({ open, onClose, onCreate }: CreateMarketModalProps) {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<Market['category']>('crypto');
  const [resolveDate, setResolveDate] = useState('');
  const [liquidity, setLiquidity] = useState('1000');
  const [sourceUrl, setSourceUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question || !resolveDate) return;

    onCreate({
      question,
      category,
      resolvesAt: new Date(resolveDate),
      sourceUrl: sourceUrl || undefined,
    });

    setQuestion('');
    setCategory('crypto');
    setResolveDate('');
    setLiquidity('1000');
    setSourceUrl('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel border-dark max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-panel flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">+</span>
            </div>
            Create Market
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5 mt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm text-panel/60 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Question
            </Label>
            <Input
              id="question"
              placeholder="Will X happen by Y?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="h-11 bg-panel/10 border-dark text-panel placeholder:text-panel/30 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-panel/60 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Market['category'])}>
              <SelectTrigger className="h-11 bg-panel/10 border-dark text-panel rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-panel border-dark rounded-xl">
                <SelectItem value="crypto">Crypto</SelectItem>
                <SelectItem value="politics">Politics</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="pop">Pop Culture</SelectItem>
                <SelectItem value="memes">Memes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolveDate" className="text-sm text-panel/60 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Resolve Date
            </Label>
            <Input
              id="resolveDate"
              type="datetime-local"
              value={resolveDate}
              onChange={(e) => setResolveDate(e.target.value)}
              className="h-11 bg-panel/10 border-dark text-panel rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="liquidity" className="text-sm text-panel/60 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Initial Liquidity
            </Label>
            <Input
              id="liquidity"
              type="number"
              min="100"
              step="100"
              value={liquidity}
              onChange={(e) => setLiquidity(e.target.value)}
              className="h-11 bg-panel/10 border-dark text-panel font-mono rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceUrl" className="text-sm text-panel/60 flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Source URL (optional)
            </Label>
            <Input
              id="sourceUrl"
              type="url"
              placeholder="https://…"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="h-11 bg-panel/10 border-dark text-panel placeholder:text-panel/30 rounded-xl"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 bg-panel/10 border-dark text-panel hover:bg-panel/20 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-gradient-to-r from-accent-blue to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-accent-blue"
            >
              Create Market
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
