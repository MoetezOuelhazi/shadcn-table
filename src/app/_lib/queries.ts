import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { tasks, type Task } from "@/db/schema"
import { type DrizzleWhere } from "@/types"
import { and, asc, count, desc,gte, lte, or, sql,type SQL } from "drizzle-orm"

import { filterColumn } from "@/lib/filter-column"

import {type GetAddressesSchema, type GetTasksSchema} from "./validations"
import {deliveryAddresses} from "@/db/delivery-address";

export async function getTasks(input: GetTasksSchema) {
  noStore()
  const { page, per_page, sort, title, status, priority, operator, from, to } =
    input

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Task | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const fromDay = from ? sql`to_date(${from}, 'yyyy-mm-dd')` : undefined
    const toDay = to ? sql`to_date(${to}, 'yyy-mm-dd')` : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      title
        ? filterColumn({
            column: tasks.title,
            value: title,
          })
        : undefined,
      // Filter tasks by status
      !!status
        ? filterColumn({
            column: tasks.status,
            value: status,
            isSelectable: true,
          })
        : undefined,
      // Filter tasks by priority
      !!priority
        ? filterColumn({
            column: tasks.priority,
            value: priority,
            isSelectable: true,
          })
        : undefined,
      // Filter by createdAt
      fromDay && toDay
        ? and(gte(tasks.createdAt, fromDay), lte(tasks.createdAt, toDay))
        : undefined,
    ]
    const where: DrizzleWhere<Task> =
      !operator || operator === "and" ? and(...expressions) : or(...expressions)

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(tasks)
        .limit(per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in tasks
            ? order === "asc"
              ? asc(tasks[column])
              : desc(tasks[column])
            : desc(tasks.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(tasks)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

export async function getAddresses(input: GetAddressesSchema) {
    noStore()
    const { page, per_page, sort, country, city, zipCode,  operator } = input

    try {
        const offset = (page - 1) * per_page

        const [column, order] = (sort?.split(".").filter(Boolean) ?? [
            "createdAt",
            "desc",
        ]) as [keyof typeof deliveryAddresses | undefined, "asc" | "desc" | undefined]

        const expressions: (SQL<unknown> | undefined)[] = [
            country
                ? filterColumn({
                    column: deliveryAddresses.country,
                    value: country,
                    isSelectable: true,
                })
                : undefined,
            city
                ? filterColumn({
                    column: deliveryAddresses.city,
                    value: city,
                    isSelectable: true,
                })
                : undefined,
            zipCode
                ? filterColumn({
                    column: deliveryAddresses.zipCode,
                    value: zipCode,
                    isSelectable: true,
                })
                : undefined,
        ]

        const where: DrizzleWhere<typeof deliveryAddresses> =
            !operator || operator === "and" ? and(...expressions) : or(...expressions)

        const { data, total } = await db.transaction(async (tx) => {
            const data = [
                {
                    id: "0987654321",
                    createdAt: new Date("2023-07-10T08:00:00Z"),
                    updatedAt: null,
                    country: "Canada",
                    full_address: "567 Maple Ave, Toronto, ON M5V 2T6, Canada",
                    city: "Toronto",
                    zipCode: "M5V 2T6",
                    street: "567 Maple Ave",
                },
                {
                    id: "1122334455",
                    createdAt: new Date("2022-11-20T14:15:00Z"),
                    updatedAt: new Date("2023-02-28T16:20:00Z"),
                    country: "Australia",
                    full_address: "432 Kangaroo Rd, Sydney, NSW 2000, Australia",
                    city: "Sydney",
                    zipCode: "2000",
                    street: "432 Kangaroo Rd",
                },
                {
                    id: "6677889900",
                    createdAt: new Date("2024-01-05T09:45:00Z"),
                    updatedAt: null,
                    country: "United Kingdom",
                    full_address: "89 Baker St, London W1U 6RF, United Kingdom",
                    city: "London",
                    zipCode: "W1U 6RF",
                    street: "89 Baker St",
                },
                {
                    id: "4455667788",
                    createdAt: new Date("2021-05-25T11:30:00Z"),
                    updatedAt: new Date("2021-09-10T10:00:00Z"),
                    country: "Germany",
                    full_address: "10 Hauptstraße, Berlin 10115, Germany",
                    city: "Berlin",
                    zipCode: "10115",
                    street: "10 Hauptstraße",
                },
                {
                    id: "2233445566",
                    createdAt: new Date("2023-03-12T13:50:00Z"),
                    updatedAt: new Date("2023-06-22T09:25:00Z"),
                    country: "Japan",
                    full_address: "12 Sakura St, Tokyo 100-0001, Japan",
                    city: "Tokyo",
                    zipCode: "100-0001",
                    street: "12 Sakura St",
                },
            ];

            const total = 9

            return {
                data,
                total,
            }
        })

        const pageCount = Math.ceil(total / per_page)
        return { data, pageCount, total }
    } catch (err) {
        console.error("Error fetching addresses:", err)
        return { data: [], pageCount: 0, total: 0 }
    }
}
export async function getTaskCountByStatus() {
  noStore()
  try {
    return await db
      .select({
        status: tasks.status,
        count: count(),
      })
      .from(tasks)
      .groupBy(tasks.status)
      .execute()
  } catch (err) {
    return []
  }
}

export async function getTaskCountByPriority() {
  noStore()
  try {
    return await db
      .select({
        priority: tasks.priority,
        count: count(),
      })
      .from(tasks)
      .groupBy(tasks.priority)
      .execute()
  } catch (err) {
    return []
  }
}
