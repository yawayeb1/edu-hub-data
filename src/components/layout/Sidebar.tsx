import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wifi,
  CreditCard,
  DollarSign,
  Wallet,
  Users,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    title: "Services",
    icon: Wifi,
    children: [
      { title: "AT iShare Business", href: "/services/at-ishare" },
      { title: "MTN UP2U Business", href: "/services/mtn-up2u" },
      { title: "Telecel Business", href: "/services/telecel" },
    ],
  },
  { title: "Credits & Debits", href: "/credits", icon: CreditCard },
  { title: "Earnings", href: "/earnings", icon: DollarSign },
  { title: "Withdrawals", href: "/withdrawals", icon: Wallet },
  { title: "Affiliate Dashboard", href: "/affiliate", icon: Users },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Services"]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isChildActive = (children?: { href: string }[]) =>
    children?.some((child) => location.pathname === child.href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
          <GraduationCap className="w-6 h-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-sidebar-foreground">Edu-Hub</span>
            <span className="text-xs text-muted-foreground">Data Services</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.includes(item.title);
          const active = item.href ? isActive(item.href) : isChildActive(item.children);

          if (hasChildren) {
            return (
              <div key={item.title}>
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>
                {!collapsed && isExpanded && (
                  <div className="mt-1 ml-4 pl-4 border-l border-sidebar-border space-y-1">
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive(child.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              to={item.href!}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground text-center">
          {!collapsed && <p>© 2025 Edu-Hub Data Limited</p>}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-card border border-border shadow-sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <Menu className="w-3 h-3" />
          )}
        </Button>
      </aside>
    </>
  );
}
