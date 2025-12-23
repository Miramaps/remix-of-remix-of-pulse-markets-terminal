import { useState } from 'react';
import { Sparkles, TrendingUp, Shield, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginPageProps {
  onLogin: (user: { email: string; name: string; avatar: string }) => void;
  onBack: () => void;
}

// Google icon SVG component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const features = [
  {
    icon: TrendingUp,
    title: 'Trade Predictions',
    description: 'Buy & sell outcome shares on real-world events',
  },
  {
    icon: Shield,
    title: 'Secure & Simple',
    description: 'Custodial wallet managed for you—no seed phrases',
  },
  {
    icon: Zap,
    title: 'Instant Payouts',
    description: 'Withdraw winnings to your bank or crypto wallet',
  },
];

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    
    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock user data (in production, this would come from Google OAuth)
    const mockUser = {
      email: 'user@gmail.com',
      name: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=b6e3f4',
    };
    
    onLogin(mockUser);
    setIsLoggingIn(false);
  };

  return (
    <motion.div
      className="min-h-screen w-full flex bg-[#0a0a14]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left side - Marketing/Branding */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#0a0a14] via-[#0d1420] to-[#0a0a14] relative overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, hsl(210, 100%, 50%) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, hsl(160, 80%, 45%) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(270, 70%, 50%) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Shimmer/Mirror effect - like the plus button */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 55%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
          initial={{ backgroundPosition: '-100% 0%' }}
          animate={{ backgroundPosition: '200% 0%' }}
          transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
        />

        {/* Content */}
        <div className="relative z-10 p-12 lg:p-16 flex flex-col justify-between h-full w-full">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              PULSEMARKETS
            </span>
          </motion.div>

          {/* Center content - Features */}
          <div className="space-y-8 max-w-md">
            <motion.h1
              className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Predict the future.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Profit from it.
              </span>
            </motion.h1>

            <div className="space-y-5 pt-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.12, duration: 0.5 }}
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <feature.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">{feature.title}</h3>
                    <p className="text-sm text-white/50 mt-0.5">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer text */}
          <motion.p
            className="text-sm text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Join 50,000+ traders making predictions on crypto, politics, sports & more
          </motion.p>
        </div>

        {/* Decorative grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 bg-panel flex flex-col relative">
        {/* Back button */}
        <motion.div 
          className="absolute top-6 left-6 z-20"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={onBack}
            className="h-10 px-4 flex items-center gap-2 text-light-muted hover:text-light hover:bg-white/5 rounded-xl transition-all duration-200 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </motion.div>

        {/* Login content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12">
          <motion.div
            className="w-full max-w-sm space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Mobile logo */}
            <div className="md:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                PULSEMARKETS
              </span>
            </div>

            {/* Header */}
            <div className="text-center">
              <h2 className="font-display font-bold text-3xl text-white mb-3">
                Welcome back
              </h2>
              <p className="text-base text-light-muted">
                Sign in to access your portfolio and start trading
              </p>
            </div>

            {/* Google Sign In Button */}
            <motion.button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full h-14 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold text-base flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoggingIn ? (
                <motion.div
                  className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-sm text-light-muted">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email option hint */}
            <div className="text-center">
              <button className="text-base text-primary hover:text-primary/80 transition-colors flex items-center gap-2 mx-auto font-medium">
                <span>Use email instead</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-light-muted/60 leading-relaxed pt-4">
              By continuing, you agree to our{' '}
              <a href="#" className="text-light-muted hover:text-light underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-light-muted hover:text-light underline">
                Privacy Policy
              </a>
            </p>
          </motion.div>
        </div>

        {/* Mobile marketing hint */}
        <div className="md:hidden px-8 pb-8">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-light-muted">
              Trade predictions on crypto, politics, sports & more
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

