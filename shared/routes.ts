import { z } from 'zod';
import { insertProductSchema, insertUserSchema, insertCartItemSchema } from './schema';

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.object({ id: z.number(), username: z.string() }),
        400: z.object({ message: z.string() })
      }
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ id: z.number(), username: z.string() }),
        401: z.object({ message: z.string() })
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: { 200: z.void() }
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: { 
        200: z.object({ id: z.number(), username: z.string(), isSeller: z.boolean().nullable() }).nullable() 
      }
    }
  },
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      responses: {
        200: z.array(z.object({
          id: z.number(),
          title: z.string(),
          description: z.string(),
          price: z.number(),
          imageUrl: z.string(),
          sellerId: z.number()
        }))
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/products',
      input: insertProductSchema,
      responses: {
        201: z.object({ id: z.number() }),
        400: z.object({ message: z.string() }),
        403: z.object({ message: z.string() })
      }
    }
  },
  cart: {
    get: {
      method: 'GET' as const,
      path: '/api/cart',
      responses: {
        200: z.array(z.object({
          id: z.number(),
          productId: z.number(),
          quantity: z.number(),
          product: z.object({
            title: z.string(),
            price: z.number(),
            imageUrl: z.string()
          })
        }))
      }
    },
    add: {
      method: 'POST' as const,
      path: '/api/cart',
      input: z.object({ productId: z.number(), quantity: z.number() }),
      responses: {
        200: z.object({ id: z.number() })
      }
    },
    remove: {
      method: 'DELETE' as const,
      path: '/api/cart/:id',
      responses: {
        200: z.void()
      }
    },
    checkout: {
      method: 'POST' as const,
      path: '/api/checkout',
      responses: {
        200: z.object({ id: z.number() })
      }
    }
  }
};
