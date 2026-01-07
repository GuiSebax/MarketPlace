import { useProducts, useCreateProduct } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertProductSchema } from "@shared/schema";
import { Loader2, Plus, Package } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { data: products, isLoading } = useProducts();
  const [, setLocation] = useLocation();

  if (!user?.isSeller) {
    setLocation("/");
    return null;
  }

  // Filter products to show only the ones created by this seller
  const myProducts = products?.filter(p => p.sellerId === user.id);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your inventory and listings.</p>
        </div>
        <AddProductDialog />
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : myProducts && myProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="h-12 w-12 rounded object-cover bg-secondary"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>${(product.price / 100).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 flex flex-col items-center text-center">
              <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">No products listed</h3>
              <p className="text-muted-foreground mb-6">Start selling by adding your first product.</p>
              <AddProductDialog />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateProduct();
  
  const form = useForm({
    resolver: zodResolver(insertProductSchema.extend({
      price: z.coerce.number().min(1, "Price is required"),
    })),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      imageUrl: "",
    },
  });

  const onSubmit = async (data: any) => {
    // Schema expects price in cents, form has dollars
    await createMutation.mutateAsync({ ...data, price: Math.round(data.price * 100) });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>List New Product</DialogTitle>
          <DialogTitle className="sr-only">Product listing form</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Vintage Camera" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="29.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input placeholder="https://images.unsplash.com/..." {...field} />
                      <p className="text-xs text-muted-foreground">
                        Try this unsplash URL: <br/>
                        <code className="bg-secondary p-1 rounded">https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80</code>
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your product..." className="resize-none h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full font-bold" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              List Product
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
