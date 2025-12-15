import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  DollarSign,
  Users,
  Wallet,
  Copy,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock affiliate data
const affiliateData = {
  totalEarnings: "125.50",
  totalWithdrawn: "100.00",
  availableCommission: "25.50",
  totalReferrals: 8,
  referralCode: "KOFI2025",
};

export default function AffiliateDashboard() {
  const [copied, setCopied] = useState(false);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(affiliateData.referralCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = () => {
    if (parseFloat(affiliateData.availableCommission) <= 0) {
      toast({
        title: "No Earnings",
        description: "You don't have any available earnings to withdraw.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Withdrawal Initiated",
      description: `GH¢${affiliateData.availableCommission} will be sent to your account.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Affiliate Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your earnings and manage referrals
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Earnings"
            value={`GH¢${affiliateData.totalEarnings}`}
            icon={DollarSign}
            variant="purple"
          />
          <StatCard
            title="Total Withdrawn"
            value={`GH¢${affiliateData.totalWithdrawn}`}
            icon={Wallet}
            variant="green"
          />
          <StatCard
            title="Available Commission"
            value={`GH¢${affiliateData.availableCommission}`}
            icon={DollarSign}
            variant="orange"
          />
          <StatCard
            title="Total Referrals"
            value={affiliateData.totalReferrals.toString()}
            icon={Users}
            variant="blue"
          />
        </div>

        {/* Referral Code & Withdraw Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Referral Code Card */}
          <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Your Referral Code
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-12 px-4 rounded-lg bg-muted/50 border border-border flex items-center">
                <span className="text-lg font-mono font-bold text-primary">
                  {affiliateData.referralCode}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={copyReferralCode}
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-stat-green-icon" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Share this code with friends. You'll earn commission when they sign up
              or make purchases.
            </p>
          </div>

          {/* Withdraw Card */}
          <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Withdraw Earnings
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stat-green">
                <p className="text-sm text-muted-foreground">Available to withdraw</p>
                <p className="text-3xl font-bold text-foreground">
                  GH¢{affiliateData.availableCommission}
                </p>
              </div>
              <Button
                variant="teal"
                size="lg"
                className="w-full"
                onClick={handleWithdraw}
                disabled={parseFloat(affiliateData.availableCommission) <= 0}
              >
                Withdraw Earnings
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Withdrawals are processed weekly. No minimum amount required.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Recent Referrals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Commission Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { user: "Ama K.", status: "Active", commission: "5.00", date: "Dec 14, 2025" },
                  { user: "Kwame B.", status: "Active", commission: "12.50", date: "Dec 12, 2025" },
                  { user: "Akua M.", status: "Pending", commission: "0.00", date: "Dec 10, 2025" },
                ].map((referral, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {referral.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          referral.status === "Active"
                            ? "bg-stat-green text-stat-green-icon"
                            : "bg-stat-orange text-stat-orange-icon"
                        }`}
                      >
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      GH¢{referral.commission}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {referral.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
