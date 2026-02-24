import { db } from "../db/db.js";
import { products } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

/**
 * Product Service: Separates business/DB logic from controllers
 */
export const ProductService = {
    async getAllProducts() {
        return await db.select().from(products).orderBy(desc(products.createdAt));
    },

    async getProductById(id) {
        const result = await db.select()
            .from(products)
            .where(eq(products.id, parseInt(id)))
            .limit(1);
        return result[0] || null;
    },

    async createProduct(data) {
        const result = await db.insert(products).values({
            ...data,
            price: data.price.toString(), // Drizzle handles decimal as string/number depending on config
        });
        // result[0].insertId might exist depending on driver, but safer to query back if needed
        return { id: result[0].insertId, ...data };
    },

    async updateProduct(id, data) {
        const updateData = { ...data };
        if (data.price) updateData.price = data.price.toString();

        await db.update(products)
            .set(updateData)
            .where(eq(products.id, parseInt(id)));

        return await this.getProductById(id);
    }
};
