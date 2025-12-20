import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, referralCode } = await req.json();
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    // Get authorization header for user verification
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Check if user is already an affiliate
    const { data: existingAffiliate } = await supabase
      .from("affiliates")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingAffiliate) {
      throw new Error("You are already an affiliate");
    }

    // Validate referral code if provided
    if (referralCode) {
      const { data: referrer } = await supabase
        .from("affiliates")
        .select("id, user_id")
        .eq("referral_code", referralCode)
        .single();

      if (!referrer) {
        throw new Error("Invalid referral code");
      }

      if (referrer.user_id === user.id) {
        throw new Error("You cannot use your own referral code");
      }
    }

    // Initialize Paystack transaction
    const reference = `AFF-${user.id.slice(0, 8)}-${Date.now()}`;
    const callbackUrl = `${req.headers.get("origin")}/affiliate/callback`;

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: 5000, // GH¢50 in pesewas
        currency: "GHS",
        reference,
        callback_url: callbackUrl,
        metadata: {
          user_id: user.id,
          referral_code: referralCode || null,
          type: "affiliate_registration",
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      console.error("Paystack error:", paystackData);
      throw new Error(paystackData.message || "Failed to initialize payment");
    }

    console.log("Payment initialized:", { reference, userId: user.id });

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
