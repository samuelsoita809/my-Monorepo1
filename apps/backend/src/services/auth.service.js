import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "nex-nexus-core-secret-2026";
const JWT_EXPIRES_IN = "24h";

export const AuthService = {
    async register(email, password, role = "viewer") {
        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await db.insert(users).values({
            email,
            passwordHash,
            role
        });

        // Drizzle mysql2 driver returns { insertId: ... } or similar in result
        // For simplicity, we fetch the user back
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        return this.generateToken(user);
    },

    async login(email, password) {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        return this.generateToken(user);
    },

    async findByEmail(email) {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        return user;
    },

    generateToken(user) {
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        };
    },

    async verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return null;
        }
    }
};
