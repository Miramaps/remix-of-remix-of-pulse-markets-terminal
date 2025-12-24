import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Shield, Zap, ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConnectWalletButton } from './ConnectWalletButton';
import { useWallet } from '@/hooks/useWallet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface LoginPageProps {
  onLogin: (user: { email: string; name: string; avatar: string }) => void;
  onBack: () => void;
  shouldAutoLogin?: boolean;
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

export function LoginPage({ onLogin, onBack, shouldAutoLogin = true }: LoginPageProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const { connected, publicKey, walletUser, updateWalletProfile } = useWallet();

  // Handle wallet connection - when wallet connects on login page, auto-login
  // Only auto-login if shouldAutoLogin is true (prevents auto-login after logout)
  useEffect(() => {
    if (shouldAutoLogin && connected && publicKey && walletUser) {
      // Wallet is connected and tracked in Firestore
      const user = {
        email: walletUser.email || '',
        name: walletUser.name || `Wallet ${publicKey.toBase58().slice(0, 4)}`,
        avatar: walletUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${publicKey.toBase58()}&backgroundColor=b6e3f4`,
      };
      onLogin(user);
    }
  }, [shouldAutoLogin, connected, publicKey, walletUser?.walletAddress, onLogin]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setEmailError('');
    
    try {
      // Sign in with Google using Firebase Auth
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Extract user data from Google account
      const googleUser = {
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'User',
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}&backgroundColor=b6e3f4`,
      };
      
      // If wallet is connected, update wallet profile with Google data
      if (connected && publicKey) {
        try {
          await updateWalletProfile({
            email: googleUser.email,
            name: googleUser.name,
            avatar: googleUser.avatar,
          });
        } catch (error) {
          console.error('Error updating wallet profile:', error);
        }
      }
      
      // Also update/create user in Firestore users collection
      // Use email (gmail) as document ID for Google sign-ups
      if (user.email) {
        try {
          const { userService } = await import('@/lib/firestore');
          await userService.upsert(user.email, 'google', {
            email: googleUser.email,
            name: googleUser.name,
            avatar: googleUser.avatar,
            updateLastActive: false,
          });
        } catch (error) {
          console.error('Error updating Firestore user:', error);
        }
      }
      
      onLogin(googleUser);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        setEmailError('Sign-in popup was closed');
      } else if (error.code === 'auth/popup-blocked') {
        setEmailError('Popup was blocked by browser. Please allow popups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setEmailError('Another sign-in request is already in progress');
      } else {
        setEmailError(error.message || 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    // Validation for sign-up
    if (isSignUp) {
      if (!email || !password || !name || !confirmPassword) {
        setEmailError('Please fill in all fields');
        return;
      }
      
      if (password.length < 6) {
        setEmailError('Password must be at least 6 characters');
        return;
      }
      
      if (password !== confirmPassword) {
        setEmailError('Passwords do not match');
        return;
      }
    } else {
      // Validation for sign-in
      if (!email || !password) {
        setEmailError('Please fill in all fields');
        return;
      }
    }

    setIsEmailLoading(true);

    try {
      let userCredential;
      
      if (isSignUp) {
        // Sign up
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign in
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      // Use provided name for sign-up, or fallback to email username
      const displayName = isSignUp ? name : (user.displayName || email.split('@')[0]);
      const avatar = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&backgroundColor=b6e3f4`;

      const userData = {
        email: user.email || email,
        name: displayName,
        avatar: avatar,
      };
      
      // Update Firebase profile with name if signing up
      if (isSignUp && name) {
        try {
          const { updateProfile } = await import('firebase/auth');
          await updateProfile(user, { displayName: name });
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }

      // Update/create user in Firestore users collection
      // Use email as document ID for email sign-ups
      if (user.email) {
        try {
          const { userService } = await import('@/lib/firestore');
          await userService.upsert(user.email, 'email', {
            email: userData.email,
            name: userData.name, // This will include the provided name for sign-ups
            avatar: userData.avatar,
            updateLastActive: false,
          });
        } catch (error) {
          console.error('Error updating Firestore user:', error);
        }
      }

      // If wallet is connected, update wallet profile with email data
      if (connected && publicKey) {
        try {
          await updateWalletProfile({
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
          });
        } catch (error) {
          console.error('Error updating wallet profile:', error);
        }
      }

      onLogin(userData);

      // Reset form
      setEmail('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      setIsEmailMode(false);
      setIsSignUp(false);
    } catch (error: any) {
      console.error('Email auth error:', error);
      if (error.code === 'auth/user-not-found') {
        setEmailError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setEmailError('Incorrect password');
      } else if (error.code === 'auth/email-already-in-use') {
        setEmailError('This email is already registered');
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        setEmailError('Password is too weak');
      } else {
        setEmailError(error.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsEmailLoading(false);
    }
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
              <motion.div
                key={isSignUp ? 'signup' : 'signin'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mb-3"
              >
                {isSignUp ? (
                  <UserPlus className="w-8 h-8 text-primary" />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
                <h2 className={`font-display font-bold text-3xl ${isSignUp ? 'text-primary' : 'text-white'}`}>
                  {isSignUp ? 'Create Account' : 'Welcome back'}
                </h2>
              </motion.div>
              <motion.p
                key={isSignUp ? 'signup-desc' : 'signin-desc'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-base text-light-muted"
              >
                {isSignUp 
                  ? 'Join Pulse Markets and start trading predictions' 
                  : 'Sign in to access your portfolio and start trading'}
              </motion.p>
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

            {/* Email Login Form */}
            {isEmailMode ? (
              <motion.form
                onSubmit={handleEmailLogin}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`space-y-4 ${isSignUp ? 'bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-2xl border border-primary/20' : ''}`}
              >
                <div className="space-y-3">
                  {/* Name field - only for sign-up */}
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative"
                    >
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted" />
                      <Input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setEmailError('');
                        }}
                        className="h-12 pl-10 bg-panel/70 border-primary/30 text-light placeholder:text-light-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl"
                        required={isSignUp}
                      />
                    </motion.div>
                  )}
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      className={`h-12 pl-10 ${isSignUp ? 'bg-panel/70 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/30' : 'bg-panel/50 border-stroke focus:border-primary focus:ring-1 focus:ring-primary/30'} text-light placeholder:text-light-muted/50 rounded-xl`}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setEmailError('');
                      }}
                      className={`h-12 pl-10 pr-10 ${isSignUp ? 'bg-panel/70 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/30' : 'bg-panel/50 border-stroke focus:border-primary focus:ring-1 focus:ring-primary/30'} text-light placeholder:text-light-muted/50 rounded-xl`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-light-muted hover:text-light transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Confirm Password - only for sign-up */}
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative"
                    >
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-muted" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setEmailError('');
                        }}
                        className="h-12 pl-10 pr-10 bg-panel/70 border-primary/30 text-light placeholder:text-light-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl"
                        required={isSignUp}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-light-muted hover:text-light transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>

                {emailError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2"
                  >
                    {emailError}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isEmailLoading}
                  className={`w-full h-12 font-semibold rounded-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all ${
                    isSignUp 
                      ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/25' 
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                >
                  {isEmailLoading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <span className="flex items-center gap-2">
                      {isSignUp && <UserPlus className="w-4 h-4" />}
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </span>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-light-muted">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setEmailError('');
                      setPassword('');
                      setConfirmPassword('');
                      if (!isSignUp) {
                        setName(''); // Clear name when switching to sign-in
                      }
                    }}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsEmailMode(false);
                    setEmail('');
                    setName('');
                    setPassword('');
                    setConfirmPassword('');
                    setEmailError('');
                    setIsSignUp(false);
                  }}
                  className="w-full text-sm text-light-muted hover:text-light transition-colors"
                >
                  Back to other options
                </button>
              </motion.form>
            ) : (
              <motion.button
                onClick={() => setIsEmailMode(true)}
                className="w-full h-12 bg-panel/50 border border-stroke hover:bg-panel/70 text-light rounded-xl font-medium text-base flex items-center justify-center gap-2 transition-all duration-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Mail className="w-4 h-4" />
                <span>Continue with Email</span>
              </motion.button>
            )}

            {/* Divider */}
            {!isEmailMode && (
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-sm text-light-muted">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            )}

            {/* Connect Wallet Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ConnectWalletButton
                variant="outline"
                size="lg"
                className="w-full h-14 bg-panel/50 border-2 border-primary/30 hover:border-primary/50 hover:bg-panel/70 text-white font-semibold text-base"
                showIcon={true}
              />
            </motion.div>

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

