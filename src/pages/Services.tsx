import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Wifi, ArrowRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const serviceData: Record<string, { name: string; color: string; packages: { name: string; price: string; data: string }[] }> = {
  "at-ishare": {
    name: "AirtelTigo iShare Business",
    color: "from-red-500 to-orange-500",
    packages: [
      { name: "Daily Bundle", price: "0.50", data: "100MB" },
      { name: "Weekly Lite", price: "2.00", data: "500MB" },
      { name: "Weekly Standard", price: "5.00", data: "2GB" },
      { name: "Monthly Starter", price: "10.00", data: "5GB" },
      { name: "Monthly Pro", price: "20.00", data: "12GB" },
      { name: "Monthly Ultimate", price: "50.00", data: "35GB" },
    ],
  },
  "mtn-up2u": {
    name: "MTN UP2U Business",
    color: "from-yellow-500 to-amber-500",
    packages: [
      { name: "Daily Bundle", price: "0.50", data: "150MB" },
      { name: "Weekly Lite", price: "2.50", data: "600MB" },
      { name: "Weekly Standard", price: "5.00", data: "2.5GB" },
      { name: "Monthly Starter", price: "12.00", data: "6GB" },
      { name: "Monthly Pro", price: "25.00", data: "15GB" },
      { name: "Monthly Ultimate", price: "55.00", data: "40GB" },
    ],
  },
  "telecel": {
    name: "Telecel Business",
    color: "from-blue-500 to-cyan-500",
    packages: [
      { name: "Daily Bundle", price: "0.45", data: "120MB" },
      { name: "Weekly Lite", price: "2.00", data: "550MB" },
      { name: "Weekly Standard", price: "4.50", data: "2GB" },
      { name: "Monthly Starter", price: "9.00", data: "4.5GB" },
      { name: "Monthly Pro", price: "18.00", data: "10GB" },
      { name: "Monthly Ultimate", price: "45.00", data: "30GB" },
    ],
  },
};

export default function Services() {
  const { service } = useParams();
  const navigate = useNavigate();
  const data = service ? serviceData[service] : null;

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Wifi className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The service you're looking for doesn't exist.
          </p>
          <Button variant="default" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${data.color} p-8 text-white animate-fade-in`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{data.name}</h1>
            <p className="text-white/80">Choose a data package to resell</p>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.packages.map((pkg, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl shadow-card border border-border/50 p-6 hover:shadow-elevated transition-all hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                  <p className="text-2xl font-bold text-primary mt-1">{pkg.data}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-foreground">
                  GH¢{pkg.price}
                </p>
                <Button variant="teal" size="sm">
                  Buy Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
