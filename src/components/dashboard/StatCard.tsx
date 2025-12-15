import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant: "purple" | "green" | "blue" | "pink" | "orange";
  trend?: string;
  trendUp?: boolean;
}

const variantStyles = {
  purple: {
    bg: "bg-stat-purple",
    icon: "bg-stat-purple-icon",
  },
  green: {
    bg: "bg-stat-green",
    icon: "bg-stat-green-icon",
  },
  blue: {
    bg: "bg-stat-blue",
    icon: "bg-stat-blue-icon",
  },
  pink: {
    bg: "bg-stat-pink",
    icon: "bg-stat-pink-icon",
  },
  orange: {
    bg: "bg-stat-orange",
    icon: "bg-stat-orange-icon",
  },
};

export function StatCard({ title, value, icon: Icon, variant, trend, trendUp }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trendUp ? "text-stat-green-icon" : "text-destructive"
            )}>
              {trend}
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          styles.bg
        )}>
          <Icon className={cn("w-6 h-6", `text-${variant === 'purple' ? 'stat-purple-icon' : variant === 'green' ? 'stat-green-icon' : variant === 'blue' ? 'stat-blue-icon' : variant === 'pink' ? 'stat-pink-icon' : 'stat-orange-icon'}`)} style={{ color: `hsl(var(--stat-${variant}-icon))` }} />
        </div>
      </div>
    </div>
  );
}
