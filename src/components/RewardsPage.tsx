import { Trophy, Gift, Crown, Zap, Target, TrendingUp, Star, Users, Clock, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const tiers = [
  { name: 'Bronze', multiplier: '1x', icon: Trophy, active: false, color: 'text-amber-600', bgColor: 'bg-amber-600/20' },
  { name: 'Silver', multiplier: '1.25x', icon: Trophy, active: true, color: 'text-slate-300', bgColor: 'bg-slate-300/20' },
  { name: 'Gold', multiplier: '1.5x', icon: Crown, active: false, color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' },
  { name: 'Platinum', multiplier: '2x', icon: Crown, active: false, color: 'text-cyan-300', bgColor: 'bg-cyan-300/20' },
];

const achievements = [
  { id: 1, name: 'First Trade', description: 'Completed', progress: 100, reward: 10, unlocked: true, icon: Check },
  { id: 2, name: 'Hot Streak', description: '3 / 5', progress: 60, reward: 50, unlocked: false, icon: Zap },
  { id: 3, name: 'Diversified', description: '3 / 5', progress: 60, reward: 25, unlocked: false, icon: Target },
  { id: 4, name: 'Volume King', description: '4,250 / 10,000', progress: 43, reward: 100, unlocked: false, icon: TrendingUp },
  { id: 5, name: 'Early Bird', description: '2 / 10', progress: 20, reward: 75, unlocked: false, icon: Star },
  { id: 6, name: 'Community', description: '4 / 10', progress: 40, reward: 200, unlocked: false, icon: Users },
];

const dailyTasks = [
  { name: 'Daily Trader', description: 'Complete 3 trades', progress: '1/3', reward: 5, percent: 33 },
  { name: 'Volume Boost', description: 'Trade $500', progress: '285/500', reward: 15, percent: 57 },
  { name: 'Explorer', description: '2 categories', progress: '1/2', reward: 10, percent: 50 },
];

const leaderboard = [
  { rank: 1, name: 'whale.sol', points: '12,450 pts', emoji: '🐋' },
  { rank: 2, name: 'degen', points: '9,820 pts', emoji: '🎰' },
  { rank: 3, name: 'king', points: '8,540 pts', emoji: '👑' },
  { rank: 4, name: 'alpha', points: '7,920 pts', emoji: '🔮' },
  { rank: 5, name: 'sniper', points: '7,010 pts', emoji: '🎯' },
];

export function RewardsPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('PULSE-X7K9M');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex-1 px-4 md:px-6 2xl:px-8 py-6 overflow-auto">
      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-7xl mx-auto mb-6">
        <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Trophy className="w-4 h-4" />
              <span>Total Points</span>
            </div>
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">285</span>
            <span className="text-success text-sm">+48</span>
          </div>
        </div>

        <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Crown className="w-4 h-4 text-light-muted" />
                <span>Current Tier</span>
              </div>
              <div className="text-xl font-bold text-foreground">Silver</div>
            </div>
            <div className="border-l border-primary/15 pl-4">
              <div className="text-muted-foreground text-xs">Multiplier</div>
              <div className="text-foreground font-semibold">1.25x</div>
            </div>
          </div>
        </div>

        <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Gift className="w-4 h-4" />
                <span>Claimable</span>
              </div>
              <div className="text-xl font-bold text-success">$12</div>
            </div>
            <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
              <Gift className="w-4 h-4 mr-1" />
              Claim
            </Button>
          </div>
        </div>

        <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Tier progress</span>
            <span className="text-muted-foreground text-xs">to Gold</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-foreground font-semibold">$4,250 / $10,000</span>
            <span className="text-foreground">43%</span>
          </div>
          <Progress value={43} className="h-2" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl mx-auto">
        {/* Left Column - Tiers & Referral */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tiers */}
          <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Tiers</h3>
              <span className="text-muted-foreground text-sm">2/4</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {tiers.map((tier) => (
                <div key={tier.name} className="text-center">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1 ${
                    tier.active ? `${tier.bgColor} ring-2 ring-offset-2 ring-offset-panel2 ring-current ${tier.color}` : `${tier.bgColor} ${tier.color}`
                  }`}>
                    <tier.icon className="w-5 h-5" />
                  </div>
                  <div className={`text-xs font-medium ${tier.active ? tier.color : 'text-muted-foreground'}`}>
                    {tier.name}
                  </div>
                  <div className={`text-xs ${tier.active ? tier.color : 'text-muted-foreground'}`}>
                    {tier.multiplier}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall</span>
              <span className="text-foreground">36%</span>
            </div>
            <Progress value={36} className="h-2 mb-4" />

            <div className="bg-panel rounded-lg p-3">
              <h4 className="font-medium text-foreground mb-2">Silver perks</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 0.25% cashback</li>
                <li>• Early access</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>

          {/* Referral */}
          <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Referral</h3>
              <span className="text-accent text-sm">Forever 10%</span>
            </div>
            <div className="bg-panel rounded-lg p-3 mb-3">
              <div className="text-xs text-muted-foreground mb-1">Your code</div>
              <div 
                className="font-mono text-foreground text-center py-2 cursor-pointer hover:text-primary transition-colors flex items-center justify-center gap-2"
                onClick={handleCopy}
              >
                PULSE-X7K9M
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-panel rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Referrals</div>
                <div className="text-xl font-bold text-foreground">4</div>
              </div>
              <div className="bg-panel rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Earned</div>
                <div className="text-xl font-bold text-success">$42</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Earn a cut of fees from traders you refer.
            </p>
          </div>
        </div>

        {/* Middle Column - Achievements */}
        <div className="lg:col-span-5">
          <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Achievements</h3>
              <span className="text-muted-foreground text-sm">1/6 unlocked</span>
            </div>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`rounded-lg p-3 ${achievement.unlocked ? 'bg-success/10 border border-success/30' : 'bg-panel'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.unlocked ? 'bg-success/20 text-success' : 'bg-panel2 text-muted-foreground'
                    }`}>
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{achievement.name}</span>
                        <div className="flex items-center gap-2">
                          {achievement.unlocked ? (
                            <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded">UNLOCKED</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">{achievement.progress}%</span>
                          )}
                          <span className="text-accent font-medium">+{achievement.reward}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">{achievement.description}</div>
                      <Progress value={achievement.progress} className="h-1.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Daily & Leaderboard */}
        <div className="lg:col-span-4 space-y-4">
          {/* Daily */}
          <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Daily</h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                <span>18h</span>
              </div>
            </div>
            <div className="space-y-3">
              {dailyTasks.map((task) => (
                <div key={task.name} className="bg-panel rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{task.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{task.progress}</span>
                      <span className="text-accent font-medium">+{task.reward}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{task.description}</div>
                  <Progress value={task.percent} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-panel2 border border-primary/15 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Top Traders</h3>
              <span className="text-muted-foreground text-sm">Leaderboard</span>
            </div>
            <div className="space-y-2 mb-4">
              {leaderboard.map((trader) => (
                <div key={trader.rank} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${
                      trader.rank === 1 ? 'text-accent' : 
                      trader.rank === 2 ? 'text-muted-foreground' : 
                      trader.rank === 3 ? 'text-amber-600' : 'text-muted-foreground'
                    }`}>
                      #{trader.rank}
                    </span>
                    <span className="text-lg">{trader.emoji}</span>
                    <span className="text-foreground">{trader.name}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{trader.points}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-panel rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Rank</div>
                <div className="text-xl font-bold text-foreground">#128</div>
              </div>
              <div className="bg-panel rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Percentile</div>
                <div className="text-xl font-bold text-success">Top 6%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
