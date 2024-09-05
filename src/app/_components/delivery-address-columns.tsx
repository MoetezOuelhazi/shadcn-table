"use client"

import * as React from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type {ColumnDef} from "@tanstack/react-table";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {type DeliveryAddress} from "@/db/delivery-address";

export function getColumns(): ColumnDef<DeliveryAddress>[] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const searchParams = useSearchParams();

    // Convert the current search params to an object
    const currentQuery = Object.fromEntries(searchParams.entries());

    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-0.5"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-0.5"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Address Id" />
            ),
            cell: ({ row }) => <div className="w-20">{row.getValue("id")}</div>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "full_address",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Full Address" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("full_address")}
            </span>
                    </div>
                )
            },
        },
        {
            accessorKey: "country",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Country" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex w-[6.25rem] items-center">
                        <span className="capitalize">{row.getValue("country")}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "city",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="City" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        <span className="capitalize">{row.getValue("city")}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "street",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Street" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        <span className="capitalize">{row.getValue("street")}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "zipCode",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Zip Code" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        <span className="capitalize">{row.getValue("zipCode")}</span>
                    </div>
                )
            },
        },
        {
            id: "actions",
            cell: function Cell({ row }) {
                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    aria-label="Open menu"
                                    variant="ghost"
                                    className="flex size-8 p-0 data-[state=open]:bg-muted"
                                >
                                    <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem>
                                    <Link
                                        href={{
                                            query: {
                                                ...currentQuery, // Keep existing query parameters
                                                editAddress: row.original.id,
                                                country: row.original.country,
                                                city: row.original.city,
                                                street: row.original.street,
                                                zipCode: row.original.zipCode,
                                            }
                                        }}
                                        shallow
                                    >
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link
                                        href={{
                                            query: {
                                                ...currentQuery, // Keep existing query parameters
                                                deleteAddress: row.original.id,
                                            }
                                        }}
                                        shallow
                                    >
                                        Delete
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )
            },
            size: 40,
        },
    ]
}