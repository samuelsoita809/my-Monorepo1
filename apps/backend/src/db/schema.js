import { mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core";

export const messages = mysqlTable("messages", {
    id: serial("id").primaryKey(),
    message: varchar("message", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
