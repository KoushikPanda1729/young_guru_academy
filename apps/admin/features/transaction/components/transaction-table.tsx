"use client";

import * as React from "react";
import { DataTable } from "@t2p-admin/ui/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@t2p-admin/ui/components/data-table/data-table-advanced-toolbar";
import { DataTableToolbar } from "@t2p-admin/ui/components/data-table/data-table-toolbar";
import { useFeatureFlags } from "../../../components/feature-flag-provider";
import { TransactionssTableActionBar } from "./transaction-table-action-bar";
import { getTransactionsTableColumns } from "./transaction-column";
import { useTransaction } from "../hooks/useTransaction";
import { useDataTable } from "../../../hooks/use-data-table";
import { DataTableSortList } from "../../../components/data-table-sort-list";
import { DataTableFilterList } from "../../../components/data-table-filter-list";
import { DataTableFilterMenu } from "../../../components/data-table-filter-menu";
import { useCourse } from "../../course/hooks/useCourse";

export interface QueryKeys {
  page: string;
  perPage: string;
  sort: string;
  filters: string;
  joinOperator: string;
}

export function TransactionsTable() {
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();
  const { transactionList } = useTransaction();
  const { data: coursesData, isLoading: coursesLoading } = useCourse();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const columns = React.useMemo(
    () => getTransactionsTableColumns({ courses: coursesData ?? [] }),
    [coursesData]
  );

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: transactionList?.data ?? [],
    columns,
    pageCount: transactionList?.meta.pagination.totalPages ?? 1,
    enableAdvancedFilter,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  if (!isMounted || coursesLoading) {
    return null;
  }

  return (
    <>
      <DataTable
        table={table}
        actionBar={<TransactionssTableActionBar table={table} />}
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
