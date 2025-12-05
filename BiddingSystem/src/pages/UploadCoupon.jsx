import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { mockApi } from '@/services/mockApi';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Upload } from 'lucide-react';

const UploadCoupon = () => {
  const navigate = useNavigate();
  const { user, addCoupon } = useStore();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !basePrice || !expiryDate || !code) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const priceNum = parseInt(basePrice);
    if (isNaN(priceNum) || priceNum < 1) {
      toast({
        title: 'Error',
        description: 'Base price must be a positive number',
        variant: 'destructive',
      });
      return;
    }

    const expiry = new Date(expiryDate);
    if (expiry < new Date()) {
      toast({
        title: 'Error',
        description: 'Expiry date must be in the future',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const newCoupon = await mockApi.uploadCoupon({
        title,
        description,
        category,
        basePrice: priceNum,
        expiryDate: expiry.toISOString(),
        code,
        sellerId: user.id,
        sellerName: user.name,
      });

      addCoupon(newCoupon);
      setShowSuccessModal(true);

      setTitle('');
      setDescription('');
      setCategory('');
      setBasePrice('');
      setExpiryDate('');
      setCode('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload coupon',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Upload Coupon
            </h1>
            <p className="text-muted-foreground">
              List your coupon and let buyers place their bids
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Coupon Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., 50% Off Amazon Prime"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the coupon benefits and terms..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (points) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    placeholder="e.g., 500"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    disabled={loading}
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    disabled={loading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., SAVE50NOW"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  This will be hidden from buyers until you select a winner
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  'Uploading...'
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Coupon
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/dashboard');
        }}
        title="Success! 🎉"
        description="Your coupon has been uploaded successfully"
      >
        <div className="text-center space-y-4 py-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 text-success rounded-full">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <p className="text-muted-foreground">
            Buyers can now start placing bids on your coupon. You'll be notified when bids are placed.
          </p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/dashboard');
              }}
              className="flex-1"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="flex-1"
            >
              Upload Another
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadCoupon;
