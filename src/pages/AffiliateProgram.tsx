import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  DollarSign,
  RefreshCw,
  Calendar,
  Gift,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const benefits = [
  {
    icon: Gift,
    title: "Instant GH¢5 Commission",
    description: "Receive instant commission after successful payment",
  },
  {
    icon: RefreshCw,
    title: "Unique Referral Code",
    description: "Get your own referral code to share with others",
  },
  {
    icon: DollarSign,
    title: "Earn from Referrals",
    description: "Commission when referred users buy data or become affiliates",
  },
  {
    icon: Wifi,
    title: "1GB Free Data Monthly",
    description: "Enjoy free data every month as an affiliate partner",
  },
  {
    icon: Calendar,
    title: "Weekly Withdrawals",
    description: "Withdraw your earnings every week with no minimum amount",
  },
  {
    icon: CheckCircle,
    title: "First 5 Purchase Bonus",
    description: "Earn on first 5 purchases of every affiliate you refer",
  },
];

export default function AffiliateProgram() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  // Check if already an affiliate
  useEffect(() => {
    const checkAffiliateStatus = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("affiliates")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (data) {
        navigate("/affiliate");
      }
    };

    checkAffiliateStatus();
  }, [user, navigate]);

  // Validate referral code when user finishes typing
  useEffect(() => {
    const validateCode = async () => {
      if (!referralCode) {
        setCodeError(null);
        return;
      }

      setIsValidatingCode(true);
      const { data, error } = await supabase
        .from("affiliates")
        .select("id, user_id")
        .eq("referral_code", referralCode)
        .single();

      if (error || !data) {
        setCodeError("Invalid referral code");
      } else if (data.user_id === user?.id) {
        setCodeError("You cannot use your own referral code");
      } else {
        setCodeError(null);
      }
      setIsValidatingCode(false);
    };

    const timeout = setTimeout(validateCode, 500);
    return () => clearTimeout(timeout);
  }, [referralCode, user?.id]);

  const handleJoin = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to join the affiliate program",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (codeError && referralCode) {
      toast({
        title: "Invalid Referral Code",
        description: codeError,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("initialize-paystack-payment", {
        body: {
          email: user.email,
          referralCode: referralCode || null,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (error: unknown) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Join the Affiliate Program
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Become a partner and start earning commissions on every sale and referral.
            One-time registration fee, lifetime benefits.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 text-primary-foreground animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10 text-center">
            <p className="text-primary-foreground/80 mb-2">One-time Registration Fee</p>
            <p className="text-5xl md:text-6xl font-bold mb-4">GH¢50</p>
            <p className="text-sm text-primary-foreground/70 mb-6">
              Pay once, earn forever. No recurring fees.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={i}
                className="bg-card rounded-2xl shadow-card border border-border/50 p-5 hover:shadow-elevated transition-shadow animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Registration Form */}
        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Complete Registration
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Enter referral code if you have one"
                className={`w-full h-11 px-4 rounded-lg bg-muted/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  codeError ? "border-destructive" : "border-border"
                }`}
              />
              {isValidatingCode && (
                <p className="text-xs text-muted-foreground mt-1">
                  Validating code...
                </p>
              )}
              {codeError && !isValidatingCode && (
                <p className="text-xs text-destructive mt-1">{codeError}</p>
              )}
              {!codeError && !isValidatingCode && referralCode && (
                <p className="text-xs text-success mt-1">Valid referral code!</p>
              )}
              {!referralCode && (
                <p className="text-xs text-muted-foreground mt-1">
                  If someone referred you, enter their code to give them a bonus
                </p>
              )}
            </div>

            <Button
              variant="hero"
              size="xl"
              className="w-full"
              onClick={handleJoin}
              disabled={isProcessing || (!!codeError && !!referralCode)}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Redirecting to Payment...
                </>
              ) : (
                <>
                  Pay GH¢50 & Join Now
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-muted-foreground">
          By joining, you agree to our affiliate terms and conditions.
          Commissions are paid weekly to your wallet.
        </p>
      </div>
    </DashboardLayout>
  );
}
