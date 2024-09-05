import { pgTable } from "@/db/utils"
import { sql } from "drizzle-orm"
import { timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

export const deliveryAddresses = pgTable("delivery_addresses", {
    id: varchar("id", { length: 30 })
        .$defaultFn(() => generateId())
        .primaryKey(),
    country: varchar("country", { length: 100 }).notNull(),
    full_address: varchar("full_address", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    street: varchar("street", { length: 255 }).notNull(),
    zipCode: varchar("zip_code", { length: 20 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .default(sql`current_timestamp`)
        .$onUpdate(() => new Date()),
})

export type DeliveryAddress = typeof deliveryAddresses.$inferSelect
export type NewDeliveryAddress = typeof deliveryAddresses.$inferInsert