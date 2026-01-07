import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAddToCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { mutate, isPending } = useAddToCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleAddToCart = () => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="aspect-square relative overflow-hidden bg-secondary/50">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <Button 
            onClick={handleAddToCart}
            disabled={isPending}
            className="w-full bg-white text-black hover:bg-white/90 font-semibold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ShoppingCart className="h-4 w-4 mr-2" />
            )}
            Add to Cart
          </Button>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="mb-2 flex justify-between items-start gap-2">
          <h3 className="font-display font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <span className="font-mono font-bold text-primary shrink-0">
            ${(product.price / 100).toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </CardContent>
    </Card>
  );
}
