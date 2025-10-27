/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@t2p-admin/ui/components/select";
import { Input } from "@t2p-admin/ui/components/input";
import { useState } from "react";
import { Button } from "@t2p-admin/ui/components/button";
import { IconArchive, IconArchiveOff, IconTrash } from "@tabler/icons-react";
import ConfirmDialog from "@/components/dashboard/confirm-dialog";

export interface CustomColumnMeta {
  filterType?: "text" | "select";
  options?: string[];
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface TableFilterProps<TData extends object> {
  table: Table<TData>;
  categoryOptions?: string[];
  statusOptions?: string[];
  archivedOptions?: FilterOption[];
  searchColumns?: string[];
  handleBulkDelete?: (ids: string[]) => Promise<void>;
  handleBulkArchive?: (ids: string[]) => Promise<void>;
  handleBulkUnarchive?: (ids: string[]) => Promise<void>;
}

export default function TableFilter<TData extends object>({
  table,
  categoryOptions: customCategoryOptions,
  statusOptions: customStatusOptions,
  archivedOptions: customArchivedOptions,
  searchColumns,
  handleBulkDelete,
  handleBulkArchive,
  handleBulkUnarchive,
}: TableFilterProps<TData>) {
  const categoryColumn = table.getAllColumns().find(col => col.id === "category");
  const statusColumn = table.getAllColumns().find(col => col.id === "status");
  const archivedColumn = table.getAllColumns().find(col => col.id === "archived");

  const categoryOptions =
    customCategoryOptions ??
    (categoryColumn
      ? Array.from(
          new Set(
            table
              .getPreFilteredRowModel()
              .rows.map(row => row.getValue("category") as string)
          )
        ).filter(Boolean)
      : []);

  const statusOptions =
    customStatusOptions ??
    (statusColumn
      ? Array.from(
          new Set(
            table
              .getPreFilteredRowModel()
              .rows.map(row => row.getValue("status") as string)
          )
        ).filter(Boolean)
      : []);

  const archivedOptions: FilterOption[] =
    customArchivedOptions ??
    (archivedColumn
      ? Array.from(
          new Set(
            table
              .getPreFilteredRowModel()
              .rows.map(row => String(row.getValue("archived")))
          )
        )
          .filter(v => v && v !== "undefined" && v !== "null" && v !== "")
          .map(value => ({
            label: value === "true" ? "Yes" : value === "false" ? "No" : value,
            value,
          }))
      : []);

  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedRowIds = selectedRows.map(row => (row.original as any).id);

  const unarchivedSelectedRows = selectedRows.filter(row => !(row.original as any).archived);
  const archivedSelectedRows = selectedRows.filter(row => (row.original as any).archived);
  const unarchivedIds = unarchivedSelectedRows.map(row => (row.original as any).id);
  const archivedIds = archivedSelectedRows.map(row => (row.original as any).id);

  const handleCategoryChange = (value: string) => {
    if (categoryColumn) {
      categoryColumn.setFilterValue(value === "all" ? undefined : value);
    }
  };

  const handleStatusChange = (value: string) => {
    if (statusColumn) {
      statusColumn.setFilterValue(value === "all" ? undefined : value);
    }
  };

  const handleSearchChange = (value: string) => {
    if(searchColumns) {
      setSearchValue(value);
    searchColumns.forEach(columnId => {
      const column = table.getColumn(columnId);
      if (column) {
        column.setFilterValue(value || undefined);
      }
    });
    }
  };

  const handleBulkArchiveAction = async () => {
    if (unarchivedIds.length === 0) return;
    if(!handleBulkArchive) return
    try {
      setIsLoading(true);
      await handleBulkArchive(unarchivedIds);
      table.resetRowSelection();
    } catch (error) {
      console.error("Failed to bulk archive:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUnarchiveAction = async () => {
    if (archivedIds.length === 0) return;
    if(!handleBulkUnarchive) return;
    try {
      setIsLoading(true);
      await handleBulkUnarchive(archivedIds);
      table.resetRowSelection();
    } catch (error) {
      console.error("Failed to bulk unarchive:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDeleteAction = async () => {
    if (selectedRowIds.length === 0) return;
    if(!handleBulkDelete) return
    try {
      setIsLoading(true);
      await handleBulkDelete(selectedRowIds);
      table.resetRowSelection();
    } catch (error) {
      console.error("Failed to bulk delete:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryValue = categoryColumn?.getFilterValue() as string | undefined;
  const statusValue = statusColumn?.getFilterValue() as string | undefined;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      {
        searchColumns && (
          <Input
        className="max-w-72"
        placeholder="Search..."
        value={searchValue}
        onChange={e => handleSearchChange(e.target.value)}
      />
        )
      }

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        {categoryColumn && (
          <Select
            value={categoryValue ?? "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {statusColumn && (
          <Select
            value={statusValue ?? "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {archivedColumn && (
          <Select
            value={(archivedColumn.getFilterValue() as string) ?? "all"}
            onValueChange={value => {
              archivedColumn.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                {(() => {
                  const value = (archivedColumn.getFilterValue() as string) ?? "all";
                  const selected = archivedOptions.find(o => o.value === value);
                  return selected?.label ?? "All";
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {archivedOptions
                .filter(option => option.value !== "all")
                .map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-2">
          {selectedRowIds.length > 0 && (
            <>
              {unarchivedIds.length > 0 && (
                <ConfirmDialog
                  onConfirm={handleBulkArchiveAction}
                  confirmText={`Archive (${unarchivedIds.length})`}
                  title="Confirm Archive"
                  description={`Are you sure you want to archive ${unarchivedIds.length} item${unarchivedIds.length === 1 ? '' : 's'}? Archived items can be restored later.`}
                  disabled={isLoading}
                >
                  {(open) => (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={open}
                      disabled={isLoading}
                    >
                      <IconArchive className="size-4" />
                      Archive ({unarchivedIds.length})
                    </Button>
                  )}
                </ConfirmDialog>
              )}

              {archivedIds.length > 0 && (
                <ConfirmDialog
                  onConfirm={handleBulkUnarchiveAction}
                  confirmText={`Unarchive (${archivedIds.length})`}
                  title="Confirm Unarchive"
                  description={`Are you sure you want to unarchive ${archivedIds.length} item${archivedIds.length === 1 ? '' : 's'}? This will restore them to active status.`}
                  disabled={isLoading}
                >
                  {(open) => (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={open}
                      disabled={isLoading}
                    >
                      <IconArchiveOff className="size-4" />
                      Unarchive ({archivedIds.length})
                    </Button>
                  )}
                </ConfirmDialog>
              )}

              <ConfirmDialog
                onConfirm={handleBulkDeleteAction}
                confirmText={`Delete (${selectedRowIds.length})`}
                title="Confirm Deletion"
                description={`Are you sure you want to delete ${selectedRowIds.length} items? This action cannot be undone.`}
                disabled={isLoading}
              >
                {(open) => (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={open}
                    disabled={isLoading}
                  >
                    <IconTrash className="size-4" />
                    Delete ({selectedRowIds.length})
                  </Button>
                )}
              </ConfirmDialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
}