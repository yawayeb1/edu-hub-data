import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AffiliateProgram from "./pages/AffiliateProgram";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import Services from "./pages/Services";
import Withdrawals from "./pages/Withdrawals";
import Credits from "./pages/Credits";
import Earnings from "./pages/Earnings";
import AffiliateCallback from "./pages/AffiliateCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/services/affiliate-program" element={<ProtectedRoute><AffiliateProgram /></ProtectedRoute>} />
            <Route path="/services/:service" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/affiliate" element={<ProtectedRoute><AffiliateDashboard /></ProtectedRoute>} />
            <Route path="/affiliate/callback" element={<ProtectedRoute><AffiliateCallback /></ProtectedRoute>} />
            <Route path="/withdrawals" element={<ProtectedRoute><Withdrawals /></ProtectedRoute>} />
            <Route path="/credits" element={<ProtectedRoute><Credits /></ProtectedRoute>} />
            <Route path="/earnings" element={<ProtectedRoute><Earnings /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
