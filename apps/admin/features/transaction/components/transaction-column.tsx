"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CalendarIcon,
  CreditCard,
  Ellipsis,
  User,
  Mail,
  Phone,
  BookOpen,
  Receipt,
  Cog,
} from "lucide-react";

import { Checkbox } from "@t2p-admin/ui/components/checkbox";
import { Button } from "@t2p-admin/ui/components/button";
import { Badge } from "@t2p-admin/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@t2p-admin/ui/components/data-table/data-table-column-header";

import { Transactions } from "../helpers/transaction-schema";
import { CourseType } from "@/features/course/helpers/course.schema";

export function getTransactionsTableColumns({
  courses,
}: {
  courses: CourseType[];
}): ColumnDef<Transactions>[] {
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
      size: 40,
    },

    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Practice Time" />
      ),
      cell: ({ cell }) => {
        const value = cell.getValue<string | undefined>();
        if (!value) return "-";

        const date = new Date(value);

        const formattedDate = date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        const formattedTime = date.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span>{formattedDate}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formattedTime}
            </span>
          </div>
        );
      },
      meta: {
        label: "Created At",
        placeholder: "Filter by date...",
        variant: "dateRange",
        icon: CalendarIcon,
        visible: true,
      },
      enableColumnFilter: true,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const name = row.getValue<string | null>("name");
        return name ? (
          <div className="truncate w-40">{name}</div>
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        );
      },
      meta: {
        label: "User Name",
        placeholder: "Search name...",
        variant: "text",
        icon: User,
        visible: false,
      },
      enableColumnFilter: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        const email = row.getValue<string | null>("email");
        return email ? (
          <div className="truncate w-48">{email}</div>
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        );
      },
      meta: {
        label: "Email",
        placeholder: "Search email...",
        variant: "text",
        icon: Mail,
        visible: false,
      },
      enableColumnFilter: true,
    },
    // Phone
    {
      id: "search",
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => {
        const phone = row.getValue<string | null>("search");
        return phone ? (
          <div>{phone}</div>
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        );
      },
      meta: {
        label: "Users",
        placeholder: "Search users...",
        variant: "text",
        icon: Phone,
        visible: true,
      },
      enableColumnFilter: true,
    },

    // Payment ID
    {
      id: "id",
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment ID" />
      ),
      cell: ({ row }) => (
        <div className="font-medium truncate w-32">{row.getValue("id")}</div>
      ),
      meta: {
        label: "Payment ID",
        placeholder: "Search by ID...",
        variant: "text",
        icon: CreditCard,
        visible: false,
      },
      enableColumnFilter: true,
    },

    // Amount
    {
      id: "amount",
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        const amount = row.getValue<number>("amount");
        return (
          <div className="text-center font-semibold">
            ₹{amount.toLocaleString("en-IN")}
          </div>
        );
      },
      meta: {
        label: "Amount",
        variant: "range",
        icon: Receipt,
        range: [0, 100000],
        unit: "₹",
        visible: false,
      },
      enableColumnFilter: true,
    },

    {
      id: "courses",
      accessorKey: "courses",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Courses" />
      ),
      cell: ({ row }) => {
        const coursesSelected = row.getValue<string[]>("courses");
        return (
          <div className="flex flex-wrap gap-1 max-w-[16rem]">
            {coursesSelected.length ? (
              coursesSelected.map((course) => (
                <Badge key={course} variant="secondary">
                  {course}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground italic">None</span>
            )}
          </div>
        );
      },
      meta: {
        label: "Courses",
        placeholder: "Filter by course...",
        variant: "select",
        options: courses.map((c) => ({ label: c.title, value: c.id })),
        icon: BookOpen,
        visible: true,
      },
      enableColumnFilter: true,
    },

    // Type
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const type = row.getValue<string>("type");
        const variant =
          type === "MANUAL"
            ? "outline"
            : type === "RAZORPAY"
              ? "default"
              : "secondary";

        return (
          <Badge variant={variant} className="uppercase">
            {type}
          </Badge>
        );
      },
      meta: {
        label: "Type",
        placeholder: "Filter by type...",
        variant: "select",
        options: [
          { label: "Manual", value: "MANUAL" },
          { label: "Razorpay", value: "RAZORPAY" },
        ],
        icon: Cog,
        visible: true,
      },
      enableColumnFilter: true,
    },

    // Actions
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <Ellipsis className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onSelect={() =>
                window.open(
                  row.original.invoiceUrl!,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              View Receipt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 40,
    },
  ];
}
