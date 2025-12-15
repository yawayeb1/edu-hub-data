import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AffiliateProgram from "./pages/AffiliateProgram";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import Services from "./pages/Services";
import Withdrawals from "./pages/Withdrawals";
import Credits from "./pages/Credits";
import Earnings from "./pages/Earnings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services/affiliate-program" element={<AffiliateProgram />} />
          <Route path="/services/:service" element={<Services />} />
          <Route path="/affiliate" element={<AffiliateDashboard />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/earnings" element={<Earnings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
