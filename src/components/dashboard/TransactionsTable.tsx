import { cn } from "@/lib/utils";

interface Transaction {
  orderId: string;
  msisdn: string;
  value: string;
  status: "Delivered" | "Pending" | "Failed";
  time: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  title: string;
}

const statusStyles = {
  Delivered: "bg-stat-green text-stat-green-icon",
  Pending: "bg-stat-orange text-stat-orange-icon",
  Failed: "bg-destructive/10 text-destructive",
};

export function TransactionsTable({ transactions, title }: TransactionsTableProps) {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                MSISDN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-destructive">
                  {tx.orderId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {tx.msisdn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                  {tx.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                    statusStyles[tx.status]
                  )}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {tx.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
