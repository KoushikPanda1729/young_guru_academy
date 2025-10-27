"use client"

import React, { useEffect, useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";

import TableFilter, { FilterOption } from "./table-filter";
import TablePagination from "./table-pagination";
import DataTable from "./table";
import { TableSkeleton } from "./table-skeleton";

export interface WithId {
  id: string | number;
}


export type PaginatedTableData<TData> = {
  data: TData[];
  total_filtered: number;
  limit: number;
};



export interface TanstackTableProps<TData extends WithId> {
  paginatedTableData: PaginatedTableData<TData> | null;
  columns: ColumnDef<TData, unknown>[];
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  isTableDataLoading?: boolean;
  categoryOptions?: string[];
  statusOptions?: string[];
  archivedOptions?: FilterOption[]
  searchColumns?: string[]
  handleBulkDelete?: (ids: string[]) => Promise<void>
  handleBulkArchive?: (ids: string[]) => Promise<void>
  handleBulkUnarchive?: (ids: string[]) => Promise<void>
}

export function TanstackTable<TData extends WithId>({
  paginatedTableData,
  columns,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  pagination,
  setPagination,
  isTableDataLoading = false,
  categoryOptions,
  statusOptions,
  archivedOptions,
  searchColumns,
  handleBulkUnarchive,
  handleBulkArchive,
  handleBulkDelete
}: TanstackTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});

  const data = paginatedTableData?.data ?? [];
  const totalFiltered = paginatedTableData?.total_filtered ?? 0;
  const limit = paginatedTableData?.limit ?? pagination.pageSize ?? 10;

  const table = useReactTable<TData>({
    data,
    columns,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    enableMultiSort: true,
    sortDescFirst: true,
    onSortingChange: setSorting,
    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    onPaginationChange: setPagination,
    rowCount: totalFiltered,
    pageCount: Math.max(1, Math.ceil(totalFiltered / limit)),
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
    },
  });

  useEffect(() => {
    setPagination((prev) =>
      prev.pageIndex === 0
        ? prev
        : {
            pageIndex: 0,
            pageSize: prev.pageSize,
          }
    );
  }, [columnFilters, setPagination]);

  return (
    <div className="p-6">
      <TableFilter 
        table={table}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
        archivedOptions={archivedOptions}
        searchColumns={searchColumns}
        handleBulkDelete={handleBulkDelete}
        handleBulkArchive={handleBulkArchive}
        handleBulkUnarchive={handleBulkUnarchive}
        />
      <div className="flex-1 mt-10">
        {isTableDataLoading ? (
          <TableSkeleton columns={columns.length} rows={5} />
        ) : (
          <>
            <div className="rounded-md border mb-4">
              <DataTable table={table} />
            </div>
            <TablePagination table={table} />
          </>
        )}
      </div>
    </div>
  );
}
