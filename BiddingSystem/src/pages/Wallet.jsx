import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { mockApi } from '@/services/mockApi';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Coins, Plus, Minus, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const Wallet = () => {
  const navigate = useNavigate();
  const { user, updateUserPoints, transactions, addTransaction } = useStore();
  const { toast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState('');
  const [loading, setLoading] = useState(false);

  const packages = [
    { id: 1, price: 15, points: 500, popular: true },
    { id: 2, price: 30, points: 1100, popular: false },
    { id: 3, price: 50, points: 2000, popular: false },
    { id: 4, price: 100, points: 4500, popular: false },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleBuyPackage = async (packageData) => {
    setLoading(true);

    try {
      const transaction = await mockApi.addPoints(packageData.points);
      addTransaction(transaction);
      updateUserPoints(user.points + packageData.points);

      toast({
        title: 'Success! 🎉',
        description: `${packageData.points} points added to your wallet for ₹${packageData.price}`,
      });

      setShowAddModal(false);
      setSelectedPackage(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add points',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemPoints = async () => {
    const points = parseInt(redeemPoints);

    if (isNaN(points) || points < 50) {
      toast({
        title: 'Error',
        description: 'Minimum 50 points required to redeem',
        variant: 'destructive',
      });
      return;
    }

    if (points % 50 !== 0) {
      toast({
        title: 'Error',
        description: 'Points must be in multiples of 50',
        variant: 'destructive',
      });
      return;
    }

    if (points > user.points) {
      toast({
        title: 'Error',
        description: 'Insufficient points',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const cashAmount = points / 50;
      const transaction = await mockApi.redeemPoints(points);
      addTransaction(transaction);
      updateUserPoints(user.points - points);

      toast({
        title: 'Success!',
        description: `₹${cashAmount} will be credited to your account`,
      });

      setShowRedeemModal(false);
      setRedeemPoints('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to redeem points',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCashValue = (points) => {
    if (isNaN(points) || points < 0) return 0;
    return (points / 50).toFixed(2);
  };

  if (!user) return null;

  const getTransactionIcon = (type) => {
    if (type === 'add' || type === 'reward' || type === 'win') {
      return <TrendingUp className="h-5 w-5 text-success" />;
    }
    return <TrendingDown className="h-5 w-5 text-destructive" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Wallet</h1>
            <p className="text-muted-foreground">Manage your points and view transactions</p>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-8 text-primary-foreground shadow-lg mb-8">
            <p className="text-sm opacity-80 mb-2">Current Balance</p>

            <div className="flex items-center space-x-3 mb-6">
              <Coins className="h-12 w-12 opacity-80" />
              <p className="text-5xl font-bold">{user.points}</p>
            </div>

            <div className="flex space-x-3">
              <Button className="flex-1" variant="secondary" onClick={() => setShowAddModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Points
              </Button>

              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => setShowRedeemModal(true)}
                disabled={user.points === 0}
              >
                <Minus className="mr-2 h-4 w-4" />
                Redeem Points
              </Button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6">Transaction History</h2>

            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>

                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`text-lg font-bold ${
                        transaction.amount > 0 ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount} pts
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Add Points Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedPackage(null);
        }}
        title="Buy Points"
        description="Choose a package to purchase"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}

                <div className="text-center">
                  <p className="text-2xl font-bold">{pkg.points}</p>
                  <p className="text-xs text-muted-foreground mb-2">points</p>
                  <p className="text-lg font-semibold text-primary">₹{pkg.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-3 pt-2">
            <Button className="flex-1" variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setSelectedPackage(null);
              }}
            >
              Cancel
            </Button>

            <Button
              className="flex-1"
              onClick={() => {
                const pkg = packages.find((p) => p.id === selectedPackage);
                if (pkg) handleBuyPackage(pkg);
              }}
              disabled={loading || !selectedPackage}
            >
              {loading ? 'Processing...' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Redeem Points Modal */}
      <Modal
        isOpen={showRedeemModal}
        onClose={() => {
          setShowRedeemModal(false);
          setRedeemPoints('');
        }}
        title="Redeem Points"
        description="Convert your points to cash"
      >
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-2xl font-bold">{user.points} points</p>
            <p className="text-xs text-muted-foreground mt-1">≈ ₹{calculateCashValue(user.points)}</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Points to Redeem (multiples of 50)</label>
            <Input
              type="number"
              placeholder="Enter points (min 50)"
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(e.target.value)}
              min="50"
              step="50"
              max={user.points}
            />

            {redeemPoints && parseInt(redeemPoints) >= 50 && (
              <p className="text-sm text-muted-foreground mt-2">
                You will receive:{' '}
                <span className="font-semibold text-success">₹{calculateCashValue(parseInt(redeemPoints))}</span>
              </p>
            )}
          </div>

          <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg">
            <p className="text-xs">
              <span className="font-semibold">Conversion Rate:</span> 50 points = ₹1
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                setShowRedeemModal(false);
                setRedeemPoints('');
              }}
            >
              Cancel
            </Button>

            <Button
              className="flex-1"
              onClick={handleRedeemPoints}
              disabled={loading || !redeemPoints || parseInt(redeemPoints) < 50}
            >
              {loading ? 'Processing...' : 'Redeem'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Wallet;
