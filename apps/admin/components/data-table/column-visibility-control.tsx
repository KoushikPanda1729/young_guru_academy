"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { IconChevronDown, IconLayoutColumns } from "@tabler/icons-react"

import { Button } from "@t2p-admin/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu"

interface ColumnVisibilityControlProps<TData> {
  table: Table<TData>
}

export function ColumnVisibilityControl<TData>({
  table,
}: ColumnVisibilityControlProps<TData>) {
  const columns = table
    .getAllColumns()
    .filter((column) => column.getCanHide() && column.accessorFn !== undefined)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <IconLayoutColumns className="size-4" />
          <span className="hidden lg:inline">Customize Columns</span>
          <span className="lg:hidden">Columns</span>
          <IconChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
