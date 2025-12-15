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

// Mock data - in real app this would come from API/state
const isAffiliate = false;
const username = "Kofi";
const earnings = "5.60";

const transactions = [
  {
    orderId: "#3991038",
    msisdn: "0551234567",
    value: "10GB",
    status: "Delivered" as const,
    time: "2 mins ago",
  },
  {
    orderId: "#3991037",
    msisdn: "0241234567",
    value: "5GB",
    status: "Delivered" as const,
    time: "15 mins ago",
  },
  {
    orderId: "#3991036",
    msisdn: "0201234567",
    value: "2GB",
    status: "Pending" as const,
    time: "1 hour ago",
  },
];

export default function Index() {
  const navigate = useNavigate();

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <HeroCard
          username={username}
          earnings={earnings}
          onWithdraw={handleWithdraw}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sales"
            value="GH¢44.4"
            icon={ShoppingCart}
            variant="purple"
            trend="+12.5%"
            trendUp
          />
          <StatCard
            title="Total Orders"
            value="2"
            icon={PackageCheck}
            variant="green"
          />
          <StatCard
            title="Total Referrals"
            value="0"
            icon={Users}
            variant="blue"
          />
          <StatCard
            title="Total Commission"
            value="GH¢0.067"
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
              title="Recent AT Transactions"
              transactions={transactions}
            />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <AccountOverview
              recentTopUp="50.00"
              lastLogin="Dec 15, 2025 • 10:32 AM"
              lastLoginDevice="Web"
              lastCommission="0"
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
