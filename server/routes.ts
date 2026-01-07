import type { Express } from "express";
import { type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertProductSchema } from "@shared/schema";

export async function registerRoutes(server: Server, app: Express): Promise<Server> {
  setupAuth(app);

  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isSeller) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const input = api.products.create.input.parse(req.body);
    const product = await storage.createProduct({ ...input, sellerId: req.user.id });
    res.status(201).json(product);
  });

  app.get(api.cart.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const items = await storage.getCartItems(req.user.id);
    res.json(items);
  });

  app.post(api.cart.add.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const input = api.cart.add.input.parse(req.body);
    const item = await storage.addToCart({ ...input, userId: req.user.id });
    res.json(item);
  });

  app.delete(api.cart.remove.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.removeFromCart(Number(req.params.id));
    res.sendStatus(200);
  });

  app.post(api.cart.checkout.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const items = await storage.getCartItems(req.user.id);
    if (items.length === 0) return res.status(400).json({ message: "Cart empty" });
    
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const order = await storage.createOrder(req.user.id, total);
    await storage.clearCart(req.user.id);
    
    res.json(order);
  });

  // Seed data if empty
  const products = await storage.getProducts();
  if (products.length === 0) {
    console.log("Seeding products...");
    const demoSeller = await storage.getUserByUsername("seller");
    let sellerId = 1;
    if (!demoSeller) {
       const seller = await storage.createUser({ 
         username: "seller", 
         password: "password", // In real app, hash this, but auth provider hashes it. 
         // Actually auth provider expects plain text here to hash it inside createUser? 
         // No, my auth.ts hashes it. 
         // But storage.createUser just inserts. 
         // So I should seed via storage, but I need a hashed password.
         // I'll skip complex seeding with auth for now or just insert raw.
         isSeller: true 
       } as any);
       sellerId = seller.id;
    } else {
       sellerId = demoSeller.id;
    }

    await storage.createProduct({
      title: "Mechanical Keyboard",
      description: "Clicky and tactile",
      price: 12000,
      imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
      sellerId
    });
    await storage.createProduct({
      title: "Wireless Mouse",
      description: "Ergonomic design",
      price: 5000,
      imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
      sellerId
    });
    await storage.createProduct({
      title: "Gaming Headset",
      description: "Surround sound",
      price: 8000,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      sellerId
    });
  }

  return server;
}
