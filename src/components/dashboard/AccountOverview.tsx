import { ArrowUpRight, Clock, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountOverviewProps {
  recentTopUp: string;
  lastLogin: string;
  lastLoginDevice: string;
  lastCommission: string;
}

export function AccountOverview({
  recentTopUp,
  lastLogin,
  lastLoginDevice,
  lastCommission,
}: AccountOverviewProps) {
  const items = [
    {
      label: "Recent Top-Up",
      value: `GH¢${recentTopUp}`,
      icon: ArrowUpRight,
      color: "text-stat-green-icon",
      bg: "bg-stat-green",
    },
    {
      label: "Last Login",
      value: lastLogin,
      subValue: lastLoginDevice,
      icon: Clock,
      color: "text-stat-blue-icon",
      bg: "bg-stat-blue",
    },
    {
      label: "Last Commission Paid",
      value: lastCommission === "0" ? "GH¢0" : `GH¢${lastCommission}`,
      icon: Coins,
      color: "text-stat-orange-icon",
      bg: "bg-stat-orange",
    },
  ];

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Account Overview</h3>
      <div className="space-y-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", item.bg)}>
                <Icon className={cn("w-5 h-5", item.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {item.value}
                </p>
                {item.subValue && (
                  <span className="text-xs text-stat-blue-icon font-medium">
                    {item.subValue}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
