"use client";
"use memo"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"

import {getColumns} from "./delivery-address-columns";
import {type DataTableFilterField} from "@/types";
import {useDataTable} from "@/hooks/use-data-table";
import {AddressesTableToolbarActions} from "@/app/_components/delivery-address-toolbar-actions";
import {type getAddresses} from "@/app/_lib/queries";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar";
import {DeliveryAddress} from "@/db/delivery-address";


interface AddressTableProps {
    addressesPromise: ReturnType<typeof getAddresses>
}

/**
 * @See https://github.com/sadmann7/shadcn-table
 * @param addressesPromise
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
export function DeliveryAddressList({addressesPromise}: AddressTableProps) {

    const {data, pageCount} = React.use(addressesPromise);

    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), [])

    /**
     * This component can render either a faceted filter or a search filter based on the `options` prop.
     *
     * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
     *
     * Each `option` object has the following properties:
     * @prop {string} label - The label for the filter option.
     * @prop {string} value - The value for the filter option.
     * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
     * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
     */
    const filterFields: DataTableFilterField<DeliveryAddress>[] = [
        {
            label: "Full Address",
            value: "full_address",
            placeholder: "Filter addresses...",
        },
    ]

    const {table} = useDataTable({
        data,
        columns,
        pageCount,
        /* optional props */
        filterFields,
        initialState: {
            columnPinning: {right: ["actions"]},
        },
        getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
        /* */
    })


    return (
        <DataTable table={table} >
            <DataTableToolbar table={table}>
                <AddressesTableToolbarActions />
            </DataTableToolbar>
        </DataTable>
    )
}