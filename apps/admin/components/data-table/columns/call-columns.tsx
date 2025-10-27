"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@t2p-admin/ui/components/checkbox";
import { Badge } from "@t2p-admin/ui/components/badge";
import { DataTableColumnHeader } from "@t2p-admin/ui/components/data-table/data-table-column-header";
import { Clock, User, CalendarIcon } from "lucide-react";
import {
  CallType,
  CallStatus,
} from "../../../features/call/helpers/call.schema";

export const getCallColumns = (): ColumnDef<CallType>[] => [
  // ✅ Row selection
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
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
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
    id: "search",
    accessorKey: "studentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student" />
    ),
    cell: ({ cell }) => cell.getValue<string>() || "N/A",
    meta: {
      label: "Student",
      placeholder: "Search students...",
      variant: "text",
      icon: User,
      visible: true,
    },
    enableColumnFilter: true,
  },

  // ✅ Partner Name
  {
    accessorKey: "partnerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Partner" />
    ),
    cell: ({ cell }) => cell.getValue<string>() || "N/A",
    meta: {
      label: "Partner",
      placeholder: "Search partners...",
      variant: "text",
      icon: User,
      visible: false,
    },
    enableColumnFilter: false,
  },

  // ✅ Wait Duration
  {
    accessorKey: "waitDurationSecs",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wait (secs)" />
    ),
    cell: ({ row }) => {
      const secs = row.getValue<number | null>("waitDurationSecs");
      return secs != null ? `${secs}s` : "-";
    },
    meta: {
      label: "Wait Duration",
      variant: "range",
      unit: "secs",
      icon: Clock,
      visible: false,
    },
  },

  // ✅ Room Duration
  {
    accessorKey: "roomDurationSecs",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room (secs)" />
    ),
    cell: ({ row }) => {
      const secs = row.getValue<number | null>("roomDurationSecs");
      return secs != null ? `${secs}s` : "-";
    },
    meta: {
      label: "Room Duration",
      variant: "range",
      unit: "secs",
      icon: Clock,
      visible: false,
    },
  },

  // ✅ Status
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue<CallType["status"]>("status");

      let variant: "default" | "secondary" | "destructive" | "warning" =
        "secondary";

      switch (status) {
        case "SEARCHING":
          variant = "default";
          break;
        case "CONNECTED":
          variant = "default";
          break;
        case "COMPLETED":
          variant = "default";
          break;
        case "CANCELLED":
        case "TIMED_OUT":
          variant = "destructive";
          break;
      }

      return (
        <Badge variant={variant} className="uppercase">
          {status.replaceAll("_", " ")}
        </Badge>
      );
    },
    meta: {
      label: "Status",
      placeholder: "Filter status...",
      variant: "select",
      options: Object.keys(CallStatus).map((key) => ({
        label: key.replaceAll("_", " "),
        value: key,
      })),
      visible: true,
    },
    enableColumnFilter: true,
  },
];
