"use memo"

import * as React from "react"
import type { SearchParams } from "@/types"

import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { Shell } from "@/components/shell"

import { TasksTable } from "./_components/tasks-table"
import { TasksTableProvider } from "./_components/tasks-table-provider"
import {getAddresses, getTasks} from "./_lib/queries"
import { searchParamsSchema } from "./_lib/validations"
import {DeliveryAddressList} from "@/app/_components/delivery-address-list";

export interface IndexPageProps {
  searchParams: SearchParams
}

export interface DeliveryAddressCardProps {
    id: string;
    country: string;
    full_address?:string;
    city: string;
    street: string;
    zipCode: string;
}

export default async function IndexPage({ searchParams }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)
    const addressesPromise = getAddresses(search);

    const tasksPromise = getTasks(search)

  return (
    <Shell className="gap-2">
      {/**
       * The `TasksTableProvider` is use to enable some feature flags for the `TasksTable` component.
       * Feel free to remove this, as it's not required for the `TasksTable` component to work.
       */}
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          {/**
           * Passing promises and consuming them using React.use for triggering the suspense fallback.
           * @see https://react.dev/reference/react/use
           */}
          <DeliveryAddressList addressesPromise={addressesPromise} />

          {/*<TasksTable tasksPromise={tasksPromise}/>*/}
        </React.Suspense>
    </Shell>
  )
}
