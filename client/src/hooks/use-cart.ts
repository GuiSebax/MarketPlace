import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCart() {
  return useQuery({
    queryKey: [api.cart.get.path],
    queryFn: async () => {
      const res = await fetch(api.cart.get.path);
      if (res.status === 401) return null; // Guest user
      if (!res.ok) throw new Error("Failed to fetch cart");
      return api.cart.get.responses[200].parse(await res.json());
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const res = await fetch(api.cart.add.path, {
        method: api.cart.add.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");
      return api.cart.add.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
      toast({ title: "Added to cart", description: "Item added successfully." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Could not add item to cart. Please try again." });
    }
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.cart.remove.path, { id });
      const res = await fetch(url, { method: api.cart.remove.method });
      if (!res.ok) throw new Error("Failed to remove item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
      toast({ title: "Removed", description: "Item removed from cart." });
    },
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.cart.checkout.path, { method: api.cart.checkout.method });
      if (!res.ok) throw new Error("Checkout failed");
      return api.cart.checkout.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
      toast({ title: "Order placed!", description: "Thank you for your purchase." });
    },
  });
}
