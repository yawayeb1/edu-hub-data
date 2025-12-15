import { TrendingUp } from "lucide-react";

export function SalesPointsCard() {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Sales Points
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Total Product Sales
          </p>
          <p className="text-3xl font-bold text-foreground">GH¢0</p>
        </div>
        
        {/* Circular progress indicator */}
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${35 * 2 * Math.PI}`}
              strokeDashoffset={`${35 * 2 * Math.PI * 0.75}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
