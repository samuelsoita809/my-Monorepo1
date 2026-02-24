import { mysqlTable, serial, varchar, timestamp, decimal, int, json, mysqlEnum } from "drizzle-orm/mysql-core";

// Level 1: Foundation
export const messages = mysqlTable("messages", {
    id: serial("id").primaryKey(),
    message: varchar("message", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

// Level 2: Feature Expansion & Layers
export const users = mysqlTable("users", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["admin", "manager", "viewer"]).default("viewer"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const products = mysqlTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    stock: int("stock").notNull().default(0),
    category: varchar("category", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow(),
});

export const orders = mysqlTable("orders", {
    id: serial("id").primaryKey(),
    userId: int("user_id").references(() => users.id),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
});

// Level 2 & 3: Intentional Engineering & Observability
export const analyticsEvents = mysqlTable("analytics_events", {
    id: serial("id").primaryKey(),
    signal: varchar("signal", { length: 100 }).notNull(), // e.g., 'STEP_STARTED', 'REQUEST_SUCCESS'
    action: varchar("action", { length: 255 }).notNull(), // e.g., 'PRODUCT_ONBOARDING'
    payload: json("payload"), // Custom event data
    latency: int("latency"), // Measured in ms (Level 3)
    timestamp: timestamp("timestamp").defaultNow(),
});
