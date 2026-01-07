import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Welcome to Marketplace</h1>
          <p className="text-muted-foreground mt-2">Sign in to start shopping or selling</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 rounded-xl bg-background/50 p-1 border">
            <TabsTrigger value="login" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm onSubmit={(data) => loginMutation.mutate(data)} isPending={loginMutation.isPending} />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm onSubmit={(data) => registerMutation.mutate(data)} isPending={registerMutation.isPending} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LoginForm({ onSubmit, isPending }: { onSubmit: (data: any) => void; isPending: boolean }) {
  const form = useForm({
    defaultValues: { username: "", password: "" },
  });

  return (
    <Card className="border-border/50 shadow-xl shadow-primary/5">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-bold" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function RegisterForm({ onSubmit, isPending }: { onSubmit: (data: any) => void; isPending: boolean }) {
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "", isSeller: false },
  });

  return (
    <Card className="border-border/50 shadow-xl shadow-primary/5">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join our community today.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isSeller"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Register as a Seller</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable this to list your own products.
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-bold bg-gradient-to-r from-primary to-accent" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
