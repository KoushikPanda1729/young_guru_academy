"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu";
import { Button } from "@t2p-admin/ui/components/button";
import { Badge } from "@t2p-admin/ui/components/badge";
import { Checkbox } from "@t2p-admin/ui/components/checkbox";
import { DataTableColumnHeader } from "@t2p-admin/ui/components/data-table/data-table-column-header";
import { MoreHorizontal, Calendar, Bell, Tag, AlignLeft } from "lucide-react";
import { PushNotificationType } from "@/features/notification/notification.schema";
import { formatDate } from "@t2p-admin/ui/lib/format";

export function getNotificationColumns({
  handleViewEdit,
  handleDelete,
  handleCancel,
}: {
  handleViewEdit: (notification: PushNotificationType) => void;
  handleDelete: (notification: PushNotificationType) => void;
  handleCancel: (notification: PushNotificationType) => void;
}): ColumnDef<PushNotificationType>[] {
  return [
    // ✅ Select checkbox
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

    // ✅ Title
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.original.title || (
            <span className="italic text-muted-foreground">N/A</span>
          )}
        </div>
      ),
      meta: {
        label: "Title",
        placeholder: "Search title...",
        variant: "text",
        icon: Bell,
        visible: false,
      },
      enableColumnFilter: true,
    },

    // ✅ Message
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
          {row.original.message || (
            <span className="italic text-muted-foreground">N/A</span>
          )}
        </div>
      ),
      meta: {
        label: "Message",
        placeholder: "Search message...",
        variant: "text",
        icon: AlignLeft,
        visible: false,
      },
      enableColumnFilter: true,
    },

    // ✅ Segments
    {
      accessorKey: "segments",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Segments" />
      ),
      cell: ({ row }) => {
        const segments = row.original.segments || [];
        return segments.length > 0 ? (
          <div className="flex flex-wrap gap-1 max-w-[16rem]">
            {segments.map((segment) => (
              <Badge
                key={segment}
                className="font-mono text-xs bg-background text-muted-foreground border"
              >
                {segment}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="italic text-muted-foreground">None</span>
        );
      },
      meta: {
        label: "Segments",
        placeholder: "Filter by segment...",
        variant: "multiSelect",
        icon: Tag,
        visible: false,
      },
      enableColumnFilter: true,
    },

    // ✅ Status
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status.toUpperCase();
        const isScheduled = row.original.status === "schedule";
        return (
          <Badge
            variant={isScheduled ? "outline" : "default"}
            className={
              isScheduled
                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                : "bg-green-100 text-green-800 border-green-300"
            }
          >
            {status}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        placeholder: "Filter by status...",
        variant: "select",
        options: [
          { label: "Scheduled", value: "schedule" },
          { label: "Sent", value: "sent" },
        ],
        visible: true,
      },
      enableColumnFilter: true,
    },

    // ✅ Scheduled Date
    {
      accessorKey: "schedule",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Scheduled At" />
      ),
      cell: ({ row }) =>
        row.original.schedule ? (
          formatDate(new Date(row.original.schedule))
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        ),
      meta: {
        label: "Scheduled At",
        placeholder: "Filter by date...",
        variant: "dateRange",
        icon: Calendar,
        visible: false,
      },
      enableColumnFilter: true,
    },

    // ✅ Created At
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) =>
        row.original.createdAt ? (
          formatDate(new Date(row.original.createdAt))
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        ),
      meta: {
        label: "Created At",
        placeholder: "Filter by date...",
        variant: "dateRange",
        icon: Calendar,
        visible: false,
      },
      enableColumnFilter: true,
    },

    // ✅ Actions
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const scheduleDate = row.original.schedule
          ? new Date(row.original.schedule)
          : null;
        const now = new Date();
        const shouldDeleteInsteadOfCancel = scheduleDate && scheduleDate > now;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleViewEdit(row.original)}>
                View Details
              </DropdownMenuItem>

              {shouldDeleteInsteadOfCancel ? (
                <DropdownMenuItem
                  onClick={() => handleDelete(row.original)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              ) : scheduleDate ? (
                <DropdownMenuItem
                  onClick={() => handleCancel(row.original)}
                  className="text-destructive focus:text-destructive"
                >
                  Cancel
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleDelete(row.original)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
