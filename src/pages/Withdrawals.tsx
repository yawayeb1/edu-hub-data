import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { Wallet, ArrowDownLeft, Clock, CheckCircle } from "lucide-react";

const withdrawalHistory = [
  { id: "WD-001", amount: "50.00", status: "Completed", date: "Dec 10, 2025" },
  { id: "WD-002", amount: "25.00", status: "Completed", date: "Dec 03, 2025" },
  { id: "WD-003", amount: "25.00", status: "Pending", date: "Dec 15, 2025" },
];

export default function Withdrawals() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Withdrawals
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your withdrawal requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Available Balance"
            value="GH¢25.50"
            icon={Wallet}
            variant="green"
          />
          <StatCard
            title="Total Withdrawn"
            value="GH¢100.00"
            icon={ArrowDownLeft}
            variant="purple"
          />
          <StatCard
            title="Pending"
            value="GH¢25.00"
            icon={Clock}
            variant="orange"
          />
        </div>

        {/* Withdrawal History */}
        <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Withdrawal History</h3>
            <Button variant="default" size="sm">
              New Withdrawal
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {withdrawalHistory.map((item, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                      GH¢{item.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.status === "Completed"
                            ? "bg-stat-green text-stat-green-icon"
                            : "bg-stat-orange text-stat-orange-icon"
                        }`}
                      >
                        {item.status === "Completed" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {item.date}
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
