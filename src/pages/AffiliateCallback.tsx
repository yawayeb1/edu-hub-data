import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AffiliateCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");
      
      if (!reference) {
        setStatus("error");
        setErrorMessage("No payment reference found");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("verify-paystack-payment", {
          body: { reference },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.success) {
          setStatus("success");
          setReferralCode(data.referral_code);
          toast({
            title: "Welcome to the Affiliate Program!",
            description: `Your referral code is ${data.referral_code}`,
          });
        } else {
          throw new Error(data.error || "Verification failed");
        }
      } catch (error: unknown) {
        console.error("Verification error:", error);
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Payment verification failed");
        toast({
          title: "Verification Failed",
          description: error instanceof Error ? error.message : "Please contact support",
          variant: "destructive",
        });
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto mt-20">
        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-8 text-center">
          {status === "verifying" && (
            <>
              <RefreshCw className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Verifying Payment
              </h1>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welcome, Affiliate!
              </h1>
              <p className="text-muted-foreground mb-6">
                Your registration is complete. Your referral code is:
              </p>
              <div className="bg-primary/10 rounded-xl p-4 mb-6">
                <p className="text-3xl font-bold text-primary tracking-wider">
                  {referralCode}
                </p>
              </div>
              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={() => navigate("/affiliate")}
              >
                Go to Affiliate Dashboard
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Verification Failed
              </h1>
              <p className="text-muted-foreground mb-6">
                {errorMessage || "Something went wrong. Please try again or contact support."}
              </p>
              <div className="space-y-3">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/services/affiliate-program")}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
