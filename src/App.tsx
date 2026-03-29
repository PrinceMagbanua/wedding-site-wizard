import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Manage from "./pages/Manage";
import BuilderPage from "./pages/BuilderPage";
import SiteRenderer from "./pages/SiteRenderer";
import BackgroundMusic from "@/components/BackgroundMusic";
import SmoothScroll from "@/components/SmoothScroll";

const queryClient = new QueryClient();

// The existing / route wraps BackgroundMusic + SmoothScroll inside the route
// so they don't mount on /builder or /site/:slug.
const IndexWithAudio = () => (
  <>
    <BackgroundMusic />
    <SmoothScroll />
    <Index />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<IndexWithAudio />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/site/:slug" element={<SiteRenderer />} />
          <Route path="/manage" element={<Manage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
