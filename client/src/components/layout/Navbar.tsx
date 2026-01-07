import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  LogOut, 
  User, 
  Store, 
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const { data: cartItems } = useCart();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
            M
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Marketplace</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-muted-foreground"}`}>
            Products
          </Link>
          
          {user?.isSeller && (
            <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${location === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full animate-in zoom-in duration-300">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-border/50 hover:border-primary/50 transition-colors">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b mb-1">
                    Hi, {user.username}
                  </div>
                  {user.isSeller && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer w-full flex items-center gap-2">
                        <Store className="h-4 w-4" /> Seller Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex gap-3">
              <Link href="/auth">
                <Button variant="ghost" className="hover:bg-primary/5 hover:text-primary">Log In</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background animate-in slide-in-from-top-5">
          <Link href="/" className="block py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Browse Products
          </Link>
          {user?.isSeller && (
            <Link href="/dashboard" className="block py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
              Seller Dashboard
            </Link>
          )}
          {!user && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Log In</Button>
              </Link>
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
