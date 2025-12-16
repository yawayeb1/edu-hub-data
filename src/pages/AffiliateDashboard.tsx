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
import { useAffiliate, useReferrals } from "@/hooks/useUserData";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function AffiliateDashboard() {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { affiliate, isAffiliate, loading: affiliateLoading } = useAffiliate();
  const { referrals, loading: referralsLoading } = useReferrals();

  const copyReferralCode = () => {
    if (affiliate?.referral_code) {
      navigator.clipboard.writeText(affiliate.referral_code);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWithdraw = () => {
    if (!affiliate || affiliate.available_balance <= 0) {
      toast({
        title: "No Earnings",
        description: "You don't have any available earnings to withdraw.",
        variant: "destructive",
      });
      return;
    }
    navigate("/withdrawals");
  };

  // Redirect if not an affiliate
  if (!affiliateLoading && !isAffiliate) {
    navigate("/services/affiliate-program");
    return null;
  }

  if (affiliateLoading) {
    return (
      <DashboardLayout isAffiliate={isAffiliate}>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalEarnings = affiliate?.total_earnings || 0;
  const totalWithdrawn = affiliate?.total_withdrawn || 0;
  const availableBalance = affiliate?.available_balance || 0;
  const totalReferrals = referrals.length;

  return (
    <DashboardLayout isAffiliate={isAffiliate}>
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
            value={`GH¢${totalEarnings.toFixed(2)}`}
            icon={DollarSign}
            variant="purple"
          />
          <StatCard
            title="Total Withdrawn"
            value={`GH¢${totalWithdrawn.toFixed(2)}`}
            icon={Wallet}
            variant="green"
          />
          <StatCard
            title="Available Commission"
            value={`GH¢${availableBalance.toFixed(2)}`}
            icon={DollarSign}
            variant="orange"
          />
          <StatCard
            title="Total Referrals"
            value={totalReferrals.toString()}
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
                  {affiliate?.referral_code || "N/A"}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={copyReferralCode}
                disabled={!affiliate?.referral_code}
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
                  GH¢{availableBalance.toFixed(2)}
                </p>
              </div>
              <Button
                variant="teal"
                size="lg"
                className="w-full"
                onClick={handleWithdraw}
                disabled={availableBalance <= 0}
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
                {referralsLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    </tr>
                  ))
                ) : referrals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No referrals yet. Share your code to start earning!
                    </td>
                  </tr>
                ) : (
                  referrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        User #{referral.referred_id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            referral.status === "active" || referral.status === "converted"
                              ? "bg-stat-green text-stat-green-icon"
                              : "bg-stat-orange text-stat-orange-icon"
                          }`}
                        >
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        GH¢{referral.commission_earned.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(referral.created_at), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
