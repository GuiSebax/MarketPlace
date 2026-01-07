import { useCart, useRemoveFromCart, useCheckout } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function CartPage() {
  const { data: cartItems, isLoading } = useCart();
  const removeMutation = useRemoveFromCart();
  const checkoutMutation = useCheckout();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/">
          <Button size="lg" className="font-bold">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const total = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="h-24 w-24 rounded-lg bg-secondary/50 overflow-hidden shrink-0">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg truncate">{item.product.title}</h3>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>

                <div className="text-right">
                  <p className="font-mono font-bold text-lg mb-2">
                    ${((item.product.price * item.quantity) / 100).toFixed(2)}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeMutation.mutate(item.id)}
                    disabled={removeMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-border/50 bg-secondary/10 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
              </div>

              <Button 
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-primary/90 hover:to-primary shadow-lg shadow-primary/25"
                onClick={() => checkoutMutation.mutate()}
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>Checkout <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
