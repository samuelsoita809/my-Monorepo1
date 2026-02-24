import request from "supertest";
import app from "../src/index.js";

describe("Health Check API", () => {
    it("should return status ok", async () => {
        const res = await request(app).get("/api/v1/health");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("status", "ok");
    });
});
