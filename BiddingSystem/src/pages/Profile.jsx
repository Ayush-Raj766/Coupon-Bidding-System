import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { User, Mail, Coins, Upload, TrendingUp, LogOut, Trophy } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, coupons, bids, logout } = useStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const myCoupons = coupons.filter((c) => c.sellerId === user.id);
  const myBids = bids.filter((b) => b.bidderId === user.id);
  const wonCoupons = coupons.filter((c) => c.winnerId === user.id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and activity</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                  <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <Coins className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="text-2xl font-bold text-foreground">{user.points}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <Upload className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">My Coupons</p>
                    <p className="text-2xl font-bold text-foreground">{myCoupons.length}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Coupons Won</p>
                    <p className="text-2xl font-bold text-foreground">{wonCoupons.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">My Uploaded Coupons</h2>
            {myCoupons.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">
                  You haven't uploaded any coupons yet
                </p>
                <Button onClick={() => navigate('/upload')}>Upload Coupon</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => navigate(`/coupons/${coupon.id}`)}
                  >
                    <div>
                      <p className="font-semibold text-foreground">{coupon.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Base Price: {coupon.basePrice} pts
                        {coupon.currentHighestBid &&
                          ` • Highest Bid: ${coupon.currentHighestBid} pts`}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        coupon.status === 'active'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-success/10 text-success'
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">My Bids</h2>
            {myBids.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">You haven't placed any bids yet</p>
                <Button onClick={() => navigate('/coupons')}>Browse Coupons</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myBids.map((bid) => {
                  const coupon = coupons.find((c) => c.id === bid.couponId);
                  if (!coupon) return null;

                  return (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => navigate(`/coupons/${coupon.id}`)}
                    >
                      <div>
                        <p className="font-semibold text-foreground">{coupon.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your Bid: {bid.amount} pts
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          bid.status === 'won'
                            ? 'bg-success/10 text-success'
                            : bid.status === 'lost'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {wonCoupons.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-4">Coupons Won 🏆</h2>
              <div className="space-y-3">
                {wonCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="p-4 bg-success/5 rounded-lg border border-success/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{coupon.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {coupon.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-background rounded border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Coupon Code:</p>
                      <code className="text-sm font-mono font-semibold text-success">
                        {coupon.code}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
