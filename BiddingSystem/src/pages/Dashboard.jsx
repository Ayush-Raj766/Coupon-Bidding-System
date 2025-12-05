import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Coins, Upload, Gift, TrendingUp, Bell } from 'lucide-react';
import { useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, bids, coupons, notifications } = useStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const myBids = bids.filter((b) => b.bidderId === user.id);
  const myCoupons = coupons.filter((c) => c.sellerId === user.id);
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-primary-foreground shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Coins className="h-8 w-8 opacity-80" />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/wallet')}
              >
                Manage
              </Button>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-1">Current Points</p>
              <p className="text-3xl font-bold">{user.points}</p>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Bids</p>
              <p className="text-3xl font-bold text-foreground">{myBids.length}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 w-full"
              onClick={() => navigate('/profile')}
            >
              View All
            </Button>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Upload className="h-8 w-8 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">My Coupons</p>
              <p className="text-3xl font-bold text-foreground">{myCoupons.length}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 w-full"
              onClick={() => navigate('/upload')}
            >
              Upload New
            </Button>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Bell className="h-8 w-8 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Notifications</p>
              <p className="text-3xl font-bold text-foreground">{unreadNotifications.length}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 w-full"
              disabled={unreadNotifications.length === 0}
            >
              View All
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col space-y-2"
              onClick={() => navigate('/coupons')}
            >
              <TrendingUp className="h-6 w-6" />
              <span>Browse Coupons</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex-col space-y-2"
              onClick={() => navigate('/upload')}
            >
              <Upload className="h-6 w-6" />
              <span>Upload Coupon</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex-col space-y-2"
              onClick={() => navigate('/wallet')}
            >
              <Coins className="h-6 w-6" />
              <span>Add Points</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex-col space-y-2"
            >
              <Gift className="h-6 w-6" />
              <span>Daily Reward</span>
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No notifications yet</p>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read
                      ? 'bg-background border-border'
                      : 'bg-primary/5 border-primary/20'
                  }`}
                >
                  <p className="text-sm text-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
