import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const transactions = [
  { type: "credit", description: "Wallet Top-up", amount: "50.00", date: "Dec 15, 2025", balance: "94.60" },
  { type: "debit", description: "AT iShare 10GB", amount: "10.00", date: "Dec 15, 2025", balance: "44.60" },
  { type: "debit", description: "MTN UP2U 5GB", amount: "5.00", date: "Dec 14, 2025", balance: "54.60" },
  { type: "credit", description: "Affiliate Commission", amount: "5.60", date: "Dec 12, 2025", balance: "59.60" },
  { type: "credit", description: "Initial Top-up", amount: "50.00", date: "Dec 10, 2025", balance: "54.00" },
];

export default function Credits() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Credits & Debits
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all your wallet transactions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Current Balance"
            value="GH¢94.60"
            icon={CreditCard}
            variant="purple"
          />
          <StatCard
            title="Total Credits"
            value="GH¢105.60"
            icon={ArrowUpRight}
            variant="green"
          />
          <StatCard
            title="Total Debits"
            value="GH¢15.00"
            icon={ArrowDownLeft}
            variant="pink"
          />
        </div>

        {/* Transaction History */}
        <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          tx.type === "credit"
                            ? "bg-stat-green text-stat-green-icon"
                            : "bg-stat-pink text-stat-pink-icon"
                        }`}
                      >
                        {tx.type === "credit" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownLeft className="w-3 h-3" />
                        )}
                        {tx.type === "credit" ? "Credit" : "Debit"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {tx.description}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      tx.type === "credit" ? "text-stat-green-icon" : "text-stat-pink-icon"
                    }`}>
                      {tx.type === "credit" ? "+" : "-"}GH¢{tx.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      GH¢{tx.balance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {tx.date}
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
