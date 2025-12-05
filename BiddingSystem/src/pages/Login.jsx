import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { mockApi } from '@/services/mockApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/shared/Modal';
import { useToast } from '@/hooks/use-toast';
import { Coins, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [dailyReward, setDailyReward] = useState(0);

  const navigate = useNavigate();
  const { setUser, updateUserPoints, addTransaction } = useStore();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const user = await mockApi.login(email, password);
      setUser(user);

      const today = new Date().toDateString();

      if (!user.lastDailyReward || user.lastDailyReward !== today) {
        const reward = await mockApi.claimDailyReward();
        setDailyReward(reward.points);
        updateUserPoints(user.points + reward.points);

        addTransaction({
          id: 'reward-' + Date.now(),
          type: 'reward',
          amount: reward.points,
          description: 'Daily login reward',
          timestamp: new Date().toISOString(),
        });

        setShowRewardModal(true);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRewardClose = () => {
    setShowRewardModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg border border-border p-8 space-y-6">

          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-2">
              <Coins className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Log in to continue to CouponBidder</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Daily Reward Modal */}
      <Modal
        isOpen={showRewardModal}
        onClose={handleRewardClose}
        title="Daily Reward! 🎉"
        description="You've earned your daily login bonus"
      >
        <div className="text-center space-y-4 py-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 text-accent rounded-full">
            <Coins className="h-10 w-10" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{dailyReward} Points</p>
            <p className="text-muted-foreground mt-1">Added to your wallet</p>
          </div>
          <Button onClick={handleRewardClose} className="w-full">
            Claim Reward
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
