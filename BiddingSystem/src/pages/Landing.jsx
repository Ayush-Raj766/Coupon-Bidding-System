import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Coins, Search, Upload, Trophy } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-primary/5 to-accent/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <Coins className="h-4 w-4" />
              <span>Buy & Sell Coupons Using Points</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              The Smart Way to Trade <span className="text-primary">Coupons</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join CouponBidder - where buyers place bids using points and sellers choose
              the winning offer. No money, just points!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/coupons">
                <Button size="lg" className="w-full sm:w-auto group">
                  Browse Coupons
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link to="/upload">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Upload Coupon
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start trading coupons on CouponBidder
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            <div className="bg-background rounded-xl p-8 text-center space-y-4 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Browse Coupons</h3>
              <p className="text-muted-foreground">
                Explore available coupons across various categories and find deals that interest you
              </p>
            </div>

            <div className="bg-background rounded-xl p-8 text-center space-y-4 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-full">
                <Coins className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Place Your Bid</h3>
              <p className="text-muted-foreground">
                Use your points to bid on coupons. The higher your bid, the better your chances
              </p>
            </div>

            <div className="bg-background rounded-xl p-8 text-center space-y-4 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 text-success rounded-full">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Win & Redeem</h3>
              <p className="text-muted-foreground">
                Get selected by the seller and receive your coupon code instantly
              </p>
            </div>

          </div>

          <div className="text-center mt-12">
            <Link to="/signup">
              <Button size="lg" variant="secondary">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold">No Money Required</h3>
                </div>
                <p className="text-muted-foreground ml-5">
                  Trade using points - earn them through activities or purchase them directly
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold">Secure Transactions</h3>
                </div>
                <p className="text-muted-foreground ml-5">
                  All transactions are protected and coupon codes are released only to winners
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold">Daily Rewards</h3>
                </div>
                <p className="text-muted-foreground ml-5">
                  Earn free points every day just by logging in and staying active
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold">Wide Selection</h3>
                </div>
                <p className="text-muted-foreground ml-5">
                  Find coupons for shopping, food, entertainment, and much more
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
