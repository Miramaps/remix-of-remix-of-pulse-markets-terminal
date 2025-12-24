// Connect Wallet Button Component
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';
import { formatWalletAddress } from '@/lib/solana';
import { motion } from 'framer-motion';

interface ConnectWalletButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
}

export function ConnectWalletButton({
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
}: ConnectWalletButtonProps) {
  const { setVisible } = useWalletModal();
  const { connected, connecting, publicKey, disconnect } = useWallet();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  if (connected && publicKey) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={className}
      >
        {showIcon && <Wallet className="w-4 h-4 mr-2" />}
        {formatWalletAddress(publicKey.toBase58())}
      </Button>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={connecting}
        className={className}
      >
        {connecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            {showIcon && <Wallet className="w-4 h-4 mr-2" />}
            Connect Wallet
          </>
        )}
      </Button>
    </motion.div>
  );
}

