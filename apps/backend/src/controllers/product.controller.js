import { ProductService } from "../services/product.service.js";

export const ProductController = {
    async list(req, res) {
        const products = await ProductService.getAllProducts();
        res.json(products);
    },

    async create(req, res) {
        try {
            const product = await ProductService.createProduct(req.validatedBody);
            res.status(201).json(product);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "SKU already exists" });
            }
            throw error;
        }
    },

    async getOne(req, res) {
        const product = await ProductService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    },

    async update(req, res) {
        const product = await ProductService.updateProduct(req.params.id, req.validatedBody);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }
};
