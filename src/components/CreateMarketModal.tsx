import { useState } from 'react';
import { X, Calendar, DollarSign, Link2, FileText, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  const [description, setDescription] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question || !resolveDate) return;

    onCreate({
      question,
      category,
      resolvesAt: new Date(resolveDate),
      liquidity: Number(liquidity),
      sourceUrl: sourceUrl || undefined,
    });

    // Reset form
    setQuestion('');
    setCategory('crypto');
    setResolveDate('');
    setLiquidity('1000');
    setDescription('');
    setSourceUrl('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-panel border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-gold flex items-center justify-center">
              <span className="text-background font-bold text-sm">+</span>
            </div>
            Create Market
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4 mt-2"
        >
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm text-muted-foreground flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Question
            </Label>
            <Input
              id="question"
              placeholder="Will X happen by Y?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-panel2 border-border focus:border-border-hover"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" />
              Category
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Market['category'])}>
              <SelectTrigger className="bg-panel2 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-panel border-border">
                <SelectItem value="crypto">Crypto</SelectItem>
                <SelectItem value="politics">Politics</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="pop">Pop Culture</SelectItem>
                <SelectItem value="memes">Memes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resolve Date */}
          <div className="space-y-2">
            <Label htmlFor="resolveDate" className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Resolve Date
            </Label>
            <Input
              id="resolveDate"
              type="datetime-local"
              value={resolveDate}
              onChange={(e) => setResolveDate(e.target.value)}
              className="bg-panel2 border-border focus:border-border-hover"
              required
            />
          </div>

          {/* Initial Liquidity */}
          <div className="space-y-2">
            <Label htmlFor="liquidity" className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5" />
              Initial Liquidity
            </Label>
            <Input
              id="liquidity"
              type="number"
              min="100"
              step="100"
              value={liquidity}
              onChange={(e) => setLiquidity(e.target.value)}
              className="bg-panel2 border-border focus:border-border-hover font-mono"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-muted-foreground">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Additional context about resolution criteria…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-panel2 border-border focus:border-border-hover resize-none h-20"
            />
          </div>

          {/* Source URL */}
          <div className="space-y-2">
            <Label htmlFor="sourceUrl" className="text-sm text-muted-foreground flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5" />
              Source URL (optional)
            </Label>
            <Input
              id="sourceUrl"
              type="url"
              placeholder="https://…"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="bg-panel2 border-border focus:border-border-hover"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-panel2 border-border hover:border-border-hover"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent-gold text-background hover:bg-accent-gold-muted font-medium"
            >
              Create Market
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
