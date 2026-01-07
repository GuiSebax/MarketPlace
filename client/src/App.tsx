import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/Navbar";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import CartPage from "@/pages/CartPage";
import SellerDashboard from "@/pages/SellerDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/dashboard" component={SellerDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col font-body">
          <Navbar />
          <main className="flex-1">
            <Router />
          </main>
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
