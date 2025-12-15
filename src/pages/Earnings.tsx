import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { WeeklySalesChart } from "@/components/dashboard/SalesChart";

const earningsHistory = [
  { source: "Referral Commission", amount: "5.00", date: "Dec 14, 2025" },
  { source: "Sales Commission", amount: "0.60", date: "Dec 15, 2025" },
  { source: "Affiliate Signup Bonus", amount: "5.00", date: "Dec 10, 2025" },
];

export default function Earnings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Earnings
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your commission and earnings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Earnings"
            value="GH¢10.60"
            icon={DollarSign}
            variant="purple"
          />
          <StatCard
            title="This Month"
            value="GH¢10.60"
            icon={TrendingUp}
            variant="green"
            trend="+100%"
            trendUp
          />
          <StatCard
            title="This Week"
            value="GH¢5.60"
            icon={Calendar}
            variant="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <WeeklySalesChart />

          {/* Earnings History */}
          <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Recent Earnings</h3>
            </div>
            <div className="p-6 space-y-4">
              {earningsHistory.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.source}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <p className="text-lg font-bold text-stat-green-icon">
                    +GH¢{item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
