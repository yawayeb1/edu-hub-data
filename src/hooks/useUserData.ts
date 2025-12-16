import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone_number: string | null;
  email: string | null;
}

interface Affiliate {
  id: string;
  user_id: string;
  referral_code: string;
  referred_by_code: string | null;
  joining_fee_paid: boolean;
  total_earnings: number;
  available_balance: number;
  total_withdrawn: number;
  free_data_claimed_at: string | null;
}

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  description: string | null;
  reference_id: string | null;
  metadata: unknown;
  created_at: string;
}

interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: string;
  commission_earned: number;
  purchases_tracked: number;
  created_at: string;
}

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalReferrals: number;
  totalCommission: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  return { profile, loading };
}

export function useAffiliate() {
  const { user } = useAuth();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAffiliate, setIsAffiliate] = useState(false);

  useEffect(() => {
    if (!user) {
      setAffiliate(null);
      setIsAffiliate(false);
      setLoading(false);
      return;
    }

    const fetchAffiliate = async () => {
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setAffiliate(data);
        setIsAffiliate(data.joining_fee_paid);
      }
      setLoading(false);
    };

    fetchAffiliate();
  }, [user]);

  return { affiliate, isAffiliate, loading };
}

export function useTransactions(limit?: number) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      let query = supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (!error && data) {
        setTransactions(data);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [user, limit]);

  return { transactions, loading };
}

export function useReferrals() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setReferrals([]);
      setLoading(false);
      return;
    }

    const fetchReferrals = async () => {
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReferrals(data);
      }
      setLoading(false);
    };

    fetchReferrals();
  }, [user]);

  return { referrals, loading };
}

export function useDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalReferrals: 0,
    totalCommission: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStats({
        totalSales: 0,
        totalOrders: 0,
        totalReferrals: 0,
        totalCommission: 0,
      });
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      // Get data purchases (sales)
      const { data: purchases } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", user.id)
        .eq("type", "data_purchase")
        .eq("status", "completed");

      // Get commission transactions
      const { data: commissions } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", user.id)
        .eq("type", "commission")
        .eq("status", "completed");

      // Get referrals count
      const { count: referralsCount } = await supabase
        .from("referrals")
        .select("*", { count: "exact", head: true })
        .eq("referrer_id", user.id);

      const totalSales = purchases?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const totalOrders = purchases?.length || 0;
      const totalCommission = commissions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      setStats({
        totalSales,
        totalOrders,
        totalReferrals: referralsCount || 0,
        totalCommission,
      });
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
}

export function useEarningsStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    thisWeek: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStats({ totalEarnings: 0, thisMonth: 0, thisWeek: 0 });
      setLoading(false);
      return;
    }

    const fetchEarningsStats = async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();

      // Total earnings (commissions)
      const { data: allEarnings } = await supabase
        .from("transactions")
        .select("amount, created_at")
        .eq("user_id", user.id)
        .eq("type", "commission")
        .eq("status", "completed");

      const totalEarnings = allEarnings?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      
      const thisMonth = allEarnings
        ?.filter(t => t.created_at >= startOfMonth)
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      
      const thisWeek = allEarnings
        ?.filter(t => t.created_at >= startOfWeek)
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      setStats({ totalEarnings, thisMonth, thisWeek });
      setLoading(false);
    };

    fetchEarningsStats();
  }, [user]);

  return { stats, loading };
}
