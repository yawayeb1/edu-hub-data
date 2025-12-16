import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { AccountOverview } from "@/components/dashboard/AccountOverview";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { WeeklySalesChart, MonthlySalesChart } from "@/components/dashboard/SalesChart";
import { AffiliateCTA } from "@/components/dashboard/AffiliateCTA";
import { SalesPointsCard } from "@/components/dashboard/SalesPointsCard";
import { ShoppingCart, PackageCheck, Users, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useProfile, useAffiliate, useTransactions, useDashboardStats } from "@/hooks/useUserData";
import { formatDistanceToNow } from "date-fns";

export default function Index() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { affiliate, isAffiliate } = useAffiliate();
  const { transactions, loading: transactionsLoading } = useTransactions(5);
  const { stats } = useDashboardStats();

  const username = profile?.full_name?.split(" ")[0] || "User";
  const availableEarnings = affiliate?.available_balance?.toFixed(2) || "0.00";

  const handleWithdraw = () => {
    if (!isAffiliate) {
      toast({
        title: "Affiliate Required",
        description: "Join the affiliate program to withdraw earnings.",
        variant: "destructive",
      });
      navigate("/services/affiliate-program");
      return;
    }
    navigate("/withdrawals");
  };

  // Transform transactions for display
  const displayTransactions = transactions
    .filter(t => t.type === "data_purchase")
    .map(t => ({
      orderId: `#${t.reference_id || t.id.slice(0, 7)}`,
      msisdn: (t.metadata as { msisdn?: string })?.msisdn || "N/A",
      value: (t.metadata as { value?: string })?.value || `GH¢${t.amount}`,
      status: (t.status === "completed" ? "Delivered" : t.status === "pending" ? "Pending" : "Failed") as "Delivered" | "Pending" | "Failed",
      time: formatDistanceToNow(new Date(t.created_at), { addSuffix: true }),
    }));

  return (
    <DashboardLayout isAffiliate={isAffiliate}>
      <div className="space-y-6">
        {/* Hero Section */}
        <HeroCard
          username={username}
          earnings={availableEarnings}
          onWithdraw={handleWithdraw}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sales"
            value={`GH¢${stats.totalSales.toFixed(2)}`}
            icon={ShoppingCart}
            variant="purple"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            icon={PackageCheck}
            variant="green"
          />
          <StatCard
            title="Total Referrals"
            value={stats.totalReferrals.toString()}
            icon={Users}
            variant="blue"
          />
          <StatCard
            title="Total Commission"
            value={`GH¢${stats.totalCommission.toFixed(2)}`}
            icon={Coins}
            variant="pink"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeeklySalesChart />
              <MonthlySalesChart />
            </div>

            {/* Transactions */}
            <TransactionsTable
              title="Recent Transactions"
              transactions={displayTransactions}
              loading={transactionsLoading}
            />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <AccountOverview
              recentTopUp={stats.totalSales.toFixed(2)}
              lastLogin="Just now"
              lastLoginDevice="Web"
              lastCommission={stats.totalCommission.toFixed(2)}
            />

            {/* Affiliate CTA or Dashboard based on status */}
            {!isAffiliate ? (
              <AffiliateCTA />
            ) : (
              <SalesPointsCard />
            )}

            <SalesPointsCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
