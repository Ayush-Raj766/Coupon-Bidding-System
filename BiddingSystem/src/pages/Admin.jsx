import { useState } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Users, FileWarning, AlertTriangle, Coins as CoinsIcon } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');

  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', points: 1200, status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', points: 850, status: 'active' },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', points: 0, status: 'banned' },
  ];

  const mockReports = [
    { id: '1', couponTitle: 'Fake Amazon Coupon', reporter: 'John Doe', reason: 'Invalid code' },
    { id: '2', couponTitle: 'Expired Netflix', reporter: 'Jane Smith', reason: 'Already expired' },
  ];

  const mockFraudAlerts = [
    { id: '1', user: 'Bob Wilson', type: 'Multiple fake coupons', severity: 'high' },
    { id: '2', user: 'Alice Cooper', type: 'Suspicious bidding', severity: 'medium' },
  ];

  const economyStats = {
    totalPoints: 125000,
    activeUsers: 245,
    totalCoupons: 89,
    avgCouponPrice: 567,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Monitor and manage the platform</p>
        </div>

        <div className="flex space-x-2 mb-8 border-b border-border">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'coupons', label: 'Reports', icon: FileWarning },
            { id: 'fraud', label: 'Fraud Alerts', icon: AlertTriangle },
            { id: 'economy', label: 'Economy', icon: CoinsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">User Management</h2>
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                >
                  <div>
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Points: {user.points}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active'
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {user.status}
                    </span>
                    {user.status === 'active' ? (
                      <Button variant="destructive" size="sm">
                        Ban User
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        Unban
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Coupon Reports</h2>
              {mockReports.map((report) => (
                <div key={report.id} className="p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{report.couponTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        Reported by: {report.reporter}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Reason: {report.reason}</p>
                  <div className="flex space-x-2">
                    <Button variant="destructive" size="sm">
                      Remove Coupon
                    </Button>
                    <Button variant="outline" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'fraud' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Fraud Alerts</h2>
              {mockFraudAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.severity === 'high'
                      ? 'bg-destructive/5 border-destructive/20'
                      : 'bg-accent/5 border-accent/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{alert.user}</p>
                      <p className="text-sm text-muted-foreground">{alert.type}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        alert.severity === 'high'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-accent/10 text-accent'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button variant="destructive" size="sm">
                      Ban User
                    </Button>
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'economy' && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">Points Economy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-background rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Total Points in Circulation</p>
                  <p className="text-3xl font-bold text-foreground">{economyStats.totalPoints}</p>
                </div>
                <div className="p-6 bg-background rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Active Users</p>
                  <p className="text-3xl font-bold text-foreground">{economyStats.activeUsers}</p>
                </div>
                <div className="p-6 bg-background rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Total Coupons</p>
                  <p className="text-3xl font-bold text-foreground">{economyStats.totalCoupons}</p>
                </div>
                <div className="p-6 bg-background rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Avg Coupon Price</p>
                  <p className="text-3xl font-bold text-foreground">
                    {economyStats.avgCouponPrice}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
