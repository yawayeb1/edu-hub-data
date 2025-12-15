import { Home, Users, Wifi, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MobileBottomNavProps {
  isAffiliate?: boolean;
}

export function MobileBottomNav({ isAffiliate = false }: MobileBottomNavProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  const affiliateRoute = isAffiliate ? "/affiliate" : "/services/affiliate-program";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        <NavLink
          to="/"
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-muted-foreground transition-colors"
          activeClassName="text-primary"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Home</span>
        </NavLink>

        <NavLink
          to={affiliateRoute}
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-muted-foreground transition-colors"
          activeClassName="text-primary"
        >
          <Users className="h-5 w-5" />
          <span className="text-xs font-medium">Affiliate</span>
        </NavLink>

        <NavLink
          to="/services/at-ishare"
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-muted-foreground transition-colors"
          activeClassName="text-primary"
        >
          <Wifi className="h-5 w-5" />
          <span className="text-xs font-medium">Buy Data</span>
        </NavLink>

        <button
          onClick={handleSignOut}
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-muted-foreground transition-colors hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
