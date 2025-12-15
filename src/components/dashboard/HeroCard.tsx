import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroCardProps {
  username: string;
  earnings: string;
  onWithdraw: () => void;
}

export function HeroCard({ username, earnings, onWithdraw }: HeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl gradient-hero p-6 md:p-8 text-primary-foreground animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">
            Greetings, {username}
          </h2>
          <p className="text-primary-foreground/80 text-sm">
            Your total earnings so far
          </p>
          <p className="text-4xl md:text-5xl font-bold mt-2">
            GH¢{earnings}
          </p>
        </div>
        
        <Button
          variant="teal"
          size="xl"
          onClick={onWithdraw}
          className="w-full md:w-auto"
        >
          Withdraw Earnings
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
