import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const weeklyData = [
  { day: "Mon", sales: 0 },
  { day: "Tue", sales: 0 },
  { day: "Wed", sales: 12.5 },
  { day: "Thu", sales: 8.2 },
  { day: "Fri", sales: 15.7 },
  { day: "Sat", sales: 8 },
  { day: "Sun", sales: 0 },
];

const monthlyData = [
  { month: "Jan", sales: 45 },
  { month: "Feb", sales: 52 },
  { month: "Mar", sales: 38 },
  { month: "Apr", sales: 65 },
  { month: "May", sales: 48 },
  { month: "Jun", sales: 72 },
  { month: "Jul", sales: 58 },
  { month: "Aug", sales: 85 },
  { month: "Sep", sales: 62 },
  { month: "Oct", sales: 78 },
  { month: "Nov", sales: 44.4 },
  { month: "Dec", sales: 0 },
];

interface ChartCardProps {
  title: string;
  trend?: string;
  trendUp?: boolean;
  children: React.ReactNode;
}

function ChartCard({ title, trend, trendUp, children }: ChartCardProps) {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {trend && (
          <span
            className={`text-sm font-medium px-2 py-1 rounded-md ${
              trendUp ? "bg-stat-green text-stat-green-icon" : "bg-stat-pink text-stat-pink-icon"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function WeeklySalesChart() {
  return (
    <ChartCard title="Weekly Sales" trend="+10%" trendUp>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="day"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={(value) => `₵${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`GH¢${value.toFixed(2)}`, "Sales"]}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function MonthlySalesChart() {
  return (
    <ChartCard title="Monthly Sales (2025)">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={(value) => `₵${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`GH¢${value.toFixed(2)}`, "Sales"]}
            />
            <Bar
              dataKey="sales"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
