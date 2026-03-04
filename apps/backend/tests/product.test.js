import { jest } from "@jest/globals";
import request from "supertest";

// 1. Mock the Service Layer BEFORE importing it
jest.unstable_mockModule("../src/services/product.service.js", () => ({
    ProductService: {
        getAllProducts: jest.fn().mockResolvedValue([]),
        createProduct: jest.fn().mockImplementation((data) => Promise.resolve({ id: 1, ...data })),
        getProductById: jest.fn().mockResolvedValue(null),
        updateProduct: jest.fn().mockImplementation((id, data) => Promise.resolve({ id: parseInt(id), ...data }))
    }
}));

// Mock Auth Middleware to pass through
jest.unstable_mockModule("../src/middleware/auth.middleware.js", () => ({
    authMiddleware: jest.fn().mockImplementation((req, res, next) => next())
}));

// 2. Dynamically import modules AFTER mocking
const { default: app } = await import("../src/index.js");

describe("Product Behavioral API", () => {
    it("should create a product and verify validation", async () => {
        const payload = {
            name: "Test Laptop",
            sku: "TEST-SKU",
            price: 1200.50,
            stock: 10,
            category: "Electronics"
        };

        const res = await request(app)
            .post("/api/v1/products")
            .send(payload);

        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toBe(payload.name);

        // Ensure validation enforced error
        const badRes = await request(app)
            .post("/api/v1/products")
            .send({ name: "X" }); // Name too short
        expect(badRes.statusCode).toEqual(400);
        expect(badRes.body.message).toBe("Validation failed");
    });

    it("should handle 404 for missing products", async () => {
        const res = await request(app).get("/api/v1/products/999999");
        expect(res.statusCode).toEqual(404);
    });
});
