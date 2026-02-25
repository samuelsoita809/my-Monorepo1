import { ProductService } from "../services/product.service.js";
import { EVENTS, createLogSignal } from "@inventory/shared";

export const ProductController = {
    async list(req, res, next) {
        try {
            const products = await ProductService.getAllProducts();
            res.json(products);
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const product = await ProductService.createProduct(req.validatedBody);
            res.status(201).json(product);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.warn(createLogSignal(EVENTS.ABUSE_TRIGGERED, {
                    reason: "DUPLICATE_SKU_ATTEMPT",
                    sku: req.validatedBody?.sku
                }));
                return res.status(409).json({ message: "SKU already exists" });
            }
            next(error);
        }
    },

    async getOne(req, res, next) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json(product);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const product = await ProductService.updateProduct(req.params.id, req.validatedBody);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json(product);
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            await ProductService.deleteProduct(req.params.id);
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
};
