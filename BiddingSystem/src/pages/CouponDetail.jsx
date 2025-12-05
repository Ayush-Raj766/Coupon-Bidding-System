import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { mockApi } from '@/services/mockApi';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Loader } from '@/components/shared/Loader';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Coins, Tag, TrendingUp, User, Clock, Trophy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CouponDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addBid, updateUserPoints, addTransaction, addNotification, updateCoupon } =
    useStore();
  const { toast } = useToast();

  const [coupon, setCoupon] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [couponData, bidsData] = await Promise.all([
        mockApi.fetchCouponById(id),
        mockApi.fetchBidsForCoupon(id)
      ]);
      setCoupon(couponData);
      setBids(bidsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load coupon details',
        variant: 'destructive'
      });
      navigate('/coupons');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async () => {
    if (!user || !coupon) {
      navigate('/login');
      return;
    }

    const amount = parseInt(bidAmount);
    if (isNaN(amount) || amount < coupon.basePrice) {
      toast({
        title: 'Invalid Bid',
        description: `Bid must be at least ${coupon.basePrice} points`,
        variant: 'destructive'
      });
      return;
    }

    if (amount > user.points) {
      toast({
        title: 'Insufficient Points',
        description: 'You do not have enough points for this bid',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    try {
      const newBid = await mockApi.placeBid({
        couponId: coupon.id,
        bidderId: user.id,
        bidderName: user.name,
        amount
      });

      addBid(newBid);
      updateUserPoints(user.points - amount);
      addTransaction({
        id: 'txn-' + Date.now(),
        type: 'bid',
        amount: -amount,
        description: `Bid on ${coupon.title}`,
        timestamp: new Date().toISOString()
      });

      if (amount > (coupon.currentHighestBid || 0)) {
        updateCoupon(coupon.id, { currentHighestBid: amount });
      }

      toast({
        title: 'Bid Placed! 🎉',
        description: `Your bid of ${amount} points has been placed`
      });

      setShowBidModal(false);
      setBidAmount('');
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place bid',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectWinner = async (bidderId) => {
    if (!coupon) return;

    try {
      await mockApi.selectWinner(coupon.id, bidderId);
      updateCoupon(coupon.id, { status: 'sold', winnerId: bidderId });

      toast({
        title: 'Winner Selected! 🏆',
        description: 'The winning bidder has been notified'
      });

      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to select winner',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <Loader text="Loading coupon..." />
        <Footer />
      </div>
    );
  }

  if (!coupon) return null;

  const isSeller = user && user.id === coupon.sellerId;
  const isWinner = user && user.id === coupon.winnerId;
  const daysLeft = Math.ceil(
    (new Date(coupon.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold">{coupon.title}</h1>
                  <span className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {coupon.category}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{coupon.description}</p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                <h2 className="text-xl font-semibold mb-4">Coupon Details</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Coins className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Base Price</p>
                      <p className="font-semibold">{coupon.basePrice} pts</p>
                    </div>
                  </div>

                  {coupon.currentHighestBid && (
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-success" />
                      <div>
                        <p className="text-sm text-muted-foreground">Highest Bid</p>
                        <p className="font-semibold text-success">{coupon.currentHighestBid} pts</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-sm text-muted-foreground">Expires In</p>
                      <p className={`font-semibold ${daysLeft <= 7 ? 'text-destructive' : ''}`}>
                        {daysLeft} days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Seller</p>
                      <p className="font-semibold">{coupon.sellerName}</p>
                    </div>
                  </div>
                </div>

                {isWinner && (
                  <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-sm text-success mb-2 flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      You won this coupon!
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Coupon Code:</p>
                      <code className="px-3 py-1 bg-background rounded font-mono text-sm">
                        {coupon.code}
                      </code>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Bid History</h2>

                {bids.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No bids yet. Be the first!</p>
                ) : (
                  <div className="space-y-3">
                    {bids
                      .sort((a, b) => b.amount - a.amount)
                      .map((bid) => (
                        <div
                          key={bid.id}
                          className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{bid.bidderName}</p>
                              <p className="text-xs text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{bid.amount} pts</p>
                            {isSeller && coupon.status === 'active' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSelectWinner(bid.bidderId)}
                                className="mt-1"
                              >
                                Select Winner
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm sticky top-24">
                {coupon.status === 'sold' ? (
                  <div className="text-center space-y-3">
                    <Trophy className="h-12 w-12 text-success mx-auto" />
                    <p className="text-lg font-semibold">Sold</p>
                    <p className="text-sm text-muted-foreground">This coupon has been sold</p>
                  </div>
                ) : isSeller ? (
                  <div className="text-center space-y-3">
                    <Tag className="h-12 w-12 text-primary mx-auto" />
                    <p className="text-lg font-semibold">Your Listing</p>
                    <p className="text-sm text-muted-foreground">
                      {bids.length} {bids.length === 1 ? 'bid' : 'bids'} received
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-4">Place Your Bid</h3>

                    {user ? (
                      <>
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Your Points</p>
                          <div className="flex items-center space-x-2">
                            <Coins className="h-5 w-5 text-accent" />
                            <span className="text-2xl font-bold">{user.points}</span>
                          </div>
                        </div>

                        <Button className="w-full" size="lg" onClick={() => setShowBidModal(true)}>
                          Place Bid
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full" size="lg" onClick={() => navigate('/login')}>
                        Login to Bid
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <Modal
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        title="Place Your Bid"
        description={`Minimum bid: ${coupon.basePrice} points`}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Bid Amount</label>
            <Input
              type="number"
              placeholder={`Min. ${coupon.basePrice}`}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowBidModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handlePlaceBid} disabled={submitting || !bidAmount} className="flex-1">
              {submitting ? 'Placing...' : 'Confirm Bid'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CouponDetail;
