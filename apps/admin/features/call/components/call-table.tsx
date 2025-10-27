"use client";

import * as React from "react";
import { DataTable } from "@t2p-admin/ui/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@t2p-admin/ui/components/data-table/data-table-advanced-toolbar";
import { DataTableToolbar } from "@t2p-admin/ui/components/data-table/data-table-toolbar";
import { useFeatureFlags } from "../../../components/feature-flag-provider";
import { CallsTableActionBar } from "./call-table-action-bar";
import { useDataTable } from "../../../hooks/use-data-table";
import { DataTableSortList } from "../../../components/data-table-sort-list";
import { DataTableFilterList } from "../../../components/data-table-filter-list";
import { DataTableFilterMenu } from "../../../components/data-table-filter-menu";
import { useCall } from "../hooks/useCall";
import { getCallColumns } from "../../../components/data-table/columns/call-columns";

export interface QueryKeys {
  page: string;
  perPage: string;
  sort: string;
  filters: string;
  joinOperator: string;
}

export function CallTable() {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();
  const { data } = useCall();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const columns = React.useMemo(() => getCallColumns(), []);

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.meta.pagination.totalPages ?? 1,
    enableAdvancedFilter,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <DataTable
        table={table}
        actionBar={<CallsTableActionBar table={table} />}
      >
        {enableAdvancedFilter ? (
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} align="start" />
            {filterFlag === "advancedFilters" ? (
              <DataTableFilterList
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
                align="start"
              />
            ) : (
              <DataTableFilterMenu
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
              />
            )}
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table}>
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
        )}
      </DataTable>
    </>
  );
}
