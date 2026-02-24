import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters").max(255),
        sku: z.string().min(3, "SKU must be at least 3 characters").max(100),
        price: z.number().positive("Price must be a positive number"),
        stock: z.number().int().nonnegative("Stock cannot be negative").default(0),
        category: z.string().max(100).optional(),
    })
});

export const updateProductSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, "ID must be a number"),
    }),
    body: z.object({
        name: z.string().min(2).max(255).optional(),
        price: z.number().positive().optional(),
        stock: z.number().int().nonnegative().optional(),
        category: z.string().max(100).optional(),
    })
});
