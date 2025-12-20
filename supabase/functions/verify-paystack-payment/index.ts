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
    const { reference } = await req.json();
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
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Client for user auth
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service client for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      console.error("Payment verification failed:", verifyData);
      throw new Error("Payment verification failed");
    }

    const { metadata } = verifyData.data;
    
    // Verify this payment belongs to the current user
    if (metadata.user_id !== user.id) {
      throw new Error("Payment does not belong to this user");
    }

    // Check if affiliate already exists
    const { data: existingAffiliate } = await supabaseClient
      .from("affiliates")
      .select("id, referral_code")
      .eq("user_id", user.id)
      .single();

    if (existingAffiliate) {
      return new Response(
        JSON.stringify({
          success: true,
          referral_code: existingAffiliate.referral_code,
          message: "You are already an affiliate",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate unique referral code
    const { data: codeData, error: codeError } = await supabaseAdmin
      .rpc("generate_referral_code");

    if (codeError) {
      console.error("Error generating referral code:", codeError);
      throw new Error("Failed to generate referral code");
    }

    const referralCode = codeData;

    // Create affiliate record using admin client
    const { data: affiliate, error: affiliateError } = await supabaseAdmin
      .from("affiliates")
      .insert({
        user_id: user.id,
        referral_code: referralCode,
        referred_by_code: metadata.referral_code || null,
        joining_fee_paid: true,
        joining_fee_amount: 50,
      })
      .select()
      .single();

    if (affiliateError) {
      console.error("Error creating affiliate:", affiliateError);
      throw new Error("Failed to create affiliate record");
    }

    // Record the transaction
    await supabaseAdmin.from("transactions").insert({
      user_id: user.id,
      type: "affiliate_registration",
      amount: 50,
      status: "completed",
      description: "Affiliate program registration fee",
      reference_id: reference,
      metadata: {
        paystack_reference: reference,
        referred_by_code: metadata.referral_code || null,
      },
    });

    // If referred by someone, create referral record and credit the referrer
    if (metadata.referral_code) {
      const { data: referrer } = await supabaseAdmin
        .from("affiliates")
        .select("id, user_id, total_earnings, available_balance")
        .eq("referral_code", metadata.referral_code)
        .single();

      if (referrer) {
        // Create referral record
        await supabaseAdmin.from("referrals").insert({
          referrer_id: referrer.user_id,
          referred_id: user.id,
          referral_code: metadata.referral_code,
          status: "active",
          commission_earned: 5, // GH¢5 commission for affiliate signup
        });

        // Credit referrer with GH¢5 commission
        await supabaseAdmin
          .from("affiliates")
          .update({
            total_earnings: referrer.total_earnings + 5,
            available_balance: referrer.available_balance + 5,
          })
          .eq("id", referrer.id);

        // Record commission transaction for referrer
        await supabaseAdmin.from("transactions").insert({
          user_id: referrer.user_id,
          type: "commission",
          amount: 5,
          status: "completed",
          description: "Commission for affiliate referral",
          metadata: {
            referred_user_id: user.id,
            referral_code: metadata.referral_code,
          },
        });
      }
    }

    console.log("Affiliate created successfully:", { userId: user.id, referralCode });

    return new Response(
      JSON.stringify({
        success: true,
        referral_code: referralCode,
        message: "Welcome to the affiliate program!",
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
