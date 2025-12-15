import { Button } from "@/components/ui/button";
import { Wifi, DollarSign, RefreshCw, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AffiliateCTA() {
  const navigate = useNavigate();

  const benefits = [
    { icon: Wifi, text: "1GB Free Data every month" },
    { icon: DollarSign, text: "Real commission earnings" },
    { icon: RefreshCw, text: "Earn from referrals & sales" },
  ];

  return (
    <div className="relative bg-card rounded-2xl shadow-card border border-border/50 p-6 overflow-hidden animate-fade-in">
      {/* Lock overlay decoration */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
        <Lock className="w-8 h-8 text-muted-foreground/50" />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-foreground mb-2">
          Join the Affiliate Program
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Unlock commissions, earn weekly income, and get free data by becoming a partner.
        </p>

        <div className="space-y-3 mb-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-foreground">{benefit.text}</span>
              </div>
            );
          })}
        </div>

        <Button
          variant="hero"
          onClick={() => navigate("/services/affiliate-program")}
          className="w-full sm:w-auto"
        >
          Join Now & Start Earning
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
