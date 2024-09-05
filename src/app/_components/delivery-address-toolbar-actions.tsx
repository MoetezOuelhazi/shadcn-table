"use client"

import { PlusIcon } from "@radix-ui/react-icons"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {Button} from "@/components/ui/button";
import {Table} from "@tanstack/react-table";
import {type DeliveryAddress} from "@/db/delivery-address";


interface AddressesTableToolbarActionsProps {
    table?: Table<DeliveryAddress>
}

export function AddressesTableToolbarActions(table: AddressesTableToolbarActionsProps) {
    const searchParams = useSearchParams();

    // Convert the current search params to an object
    const currentQuery = Object.fromEntries(searchParams.entries());
    return (
        <div className="flex items-center gap-2">
            {/*{//until we have a delete dialog that can delete multiple elements at a time*/}
            {/*    table.getFilteredSelectedRowModel().rows.length > 0 ? (*/}
            {/*    <DeleteAddressesDialog*/}
            {/*        tasks={table*/}
            {/*            .getFilteredSelectedRowModel()*/}
            {/*            .rows.map((row) => row.original)}*/}
            {/*        onSuccess={() => table.toggleAllRowsSelected(false)}*/}
            {/*    />*/}
            {/*) : null}*/}
            <Link
                href={{
                    query: {
                        ...currentQuery,
                        editAddress: "",
                    },
                }}
            >
                <Button variant="outline" size="sm">
                    <PlusIcon className="mr-2 size-4" aria-hidden="true" />
                    New address
                </Button>
            </Link>
            {/**
             * Other actions can be added here.
             * For example, export, view, etc.
             */}
        </div>
    )
}