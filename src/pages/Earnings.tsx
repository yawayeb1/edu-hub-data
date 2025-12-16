import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { WeeklySalesChart } from "@/components/dashboard/SalesChart";
import { useAffiliate, useTransactions, useEarningsStats } from "@/hooks/useUserData";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Earnings() {
  const { isAffiliate } = useAffiliate();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { stats, loading: statsLoading } = useEarningsStats();

  // Filter to only commission transactions
  const earningsTransactions = transactions.filter(t => t.type === "commission");

  const getSourceDescription = (transaction: typeof transactions[0]) => {
    const metadata = transaction.metadata as { source?: string };
    return metadata?.source || transaction.description || "Commission";
  };

  return (
    <DashboardLayout isAffiliate={isAffiliate}>
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
          {statsLoading ? (
            [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))
          ) : (
            <>
              <StatCard
                title="Total Earnings"
                value={`GH¢${stats.totalEarnings.toFixed(2)}`}
                icon={DollarSign}
                variant="purple"
              />
              <StatCard
                title="This Month"
                value={`GH¢${stats.thisMonth.toFixed(2)}`}
                icon={TrendingUp}
                variant="green"
                trend={stats.totalEarnings > 0 ? `+${((stats.thisMonth / stats.totalEarnings) * 100).toFixed(0)}%` : undefined}
                trendUp={stats.thisMonth > 0}
              />
              <StatCard
                title="This Week"
                value={`GH¢${stats.thisWeek.toFixed(2)}`}
                icon={Calendar}
                variant="blue"
              />
            </>
          )}
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
              {transactionsLoading ? (
                [...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))
              ) : earningsTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No earnings yet. Start referring to earn commission!
                </div>
              ) : (
                earningsTransactions.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{getSourceDescription(item)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(item.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-stat-green-icon">
                      +GH¢{Number(item.amount).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
