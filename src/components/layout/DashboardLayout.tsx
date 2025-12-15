import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";

interface DashboardLayoutProps {
  children: ReactNode;
  isAffiliate?: boolean;
}

export function DashboardLayout({ children, isAffiliate = false }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">
          {children}
        </main>
      </div>
      <MobileBottomNav isAffiliate={isAffiliate} />
    </div>
  );
}
