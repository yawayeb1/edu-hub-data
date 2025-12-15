import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-card border-b border-border">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search services, transactions..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
        </Button>

        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Kofi Mensah</p>
            <p className="text-xs text-muted-foreground">kofi@email.com</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
            <User className="w-5 h-5 text-primary" />
          </Button>
        </div>
      </div>
    </header>
  );
}
