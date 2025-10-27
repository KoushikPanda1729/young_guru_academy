"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CalendarIcon,
  User,
  Mail,
  Phone,
  BookOpen,
  MapPin,
} from "lucide-react";

import { Checkbox } from "@t2p-admin/ui/components/checkbox";
import { Badge } from "@t2p-admin/ui/components/badge";
import { DataTableColumnHeader } from "@t2p-admin/ui/components/data-table/data-table-column-header";
import { formatDate } from "@t2p-admin/ui/lib/format";
import { UserType } from "../user.schema";
import { EnglishLevel } from "../../../components/data-table/schema";

export function getUserColumns(): ColumnDef<UserType>[] {
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

    // ✅ Name
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const name = row.getValue<string>("name");
        return name ? (
          <div className="truncate w-40">{name}</div>
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        );
      },
      meta: {
        label: "Name",
        placeholder: "Search name...",
        variant: "text",
        icon: User,
        visible: false,
      },
      enableColumnFilter: true,
    },

    // ✅ Email
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        const email = row.getValue<string>("email");
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

    // ✅ Phone
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
        label: "Search",
        placeholder: "Search users...",
        variant: "text",
        icon: Phone,
        visible: true,
      },
      enableColumnFilter: true,
    },

    // ✅ Level
    {
      id: "level",
      accessorKey: "level",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Level" />
      ),
      cell: ({ row }) => {
        const level = row.getValue<string | null>("level");
        return level ? (
          <Badge className="uppercase">{level}</Badge>
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        );
      },
      meta: {
        label: "Level",
        placeholder: "Filter by level...",
        variant: "multiSelect",
        options: Object.values(EnglishLevel).map((l) => ({
          label:
            String(l).charAt(0).toUpperCase() +
            String(l).slice(1).toLowerCase(),
          value: String(l),
        })),
        visible: true,
      },
      enableColumnFilter: true,
    },

    // ✅ Preferred Time
    {
      id: "preferredTime",
      accessorKey: "preferredTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Preferred Time" />
      ),
      cell: ({ row }) => {
        const time = row.getValue<string | null>("preferredTime");
        return time ? (
          <div>{time}</div>
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        );
      },
      meta: {
        label: "Preferred Time",
        placeholder: "Filter by time...",
        variant: "text",
        visible: false,
        advanceVisible: false,
      },
      enableColumnFilter: true,
    },

    {
      id: "averageRating",
      accessorKey: "averageRating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Average Rating" />
      ),
      cell: ({ row }) => {
        const rating = row.getValue<number | null>("averageRating");
        return rating ? (
          <div>{rating.toFixed(1)} ⭐</div>
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        );
      },
      meta: {
        label: "Average Rating",
        placeholder: "Filter by rating...",
        variant: "range",
        range: [1, 5],

        visible: true,
      },
      enableColumnFilter: true,
    },

    {
      id: "dob",
      accessorKey: "dob",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="DOB" />
      ),
      cell: ({ cell }) =>
        cell.getValue<Date | null>() ? (
          formatDate(cell.getValue<Date>())
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        ),
      meta: {
        label: "Date of Birth",
        advanceVisible: false,
        visible: false,
      },
      enableColumnFilter: true,
    },

    {
      id: "education",
      accessorKey: "education",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Education" />
      ),
      cell: ({ row }) => {
        const edu = row.getValue<string | null>("education");
        return edu ? (
          <div className="truncate w-40">{edu}</div>
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        );
      },
      meta: {
        label: "Education",
        visible: false,
        advanceVisible: false,
      },
      enableColumnFilter: true,
    },

    {
      id: "location",
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => <div>{row.getValue<string>("location")}</div>,
      meta: {
        label: "Location",
        icon: MapPin,
        visible: false,
        advanceVisible: false,
      },
      enableColumnFilter: true,
    },

    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue<"active" | "inactive">("status");
        const variant = status === "active" ? "default" : "outline";
        return <Badge variant={variant}>{status.toUpperCase()}</Badge>;
      },
      meta: {
        label: "Status",
        placeholder: "Filter by status...",
        variant: "select",
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ],
        visible: true,
      },
      enableColumnFilter: true,
    },

    {
      id: "courseEnrolled",
      accessorKey: "courseEnrolled",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Courses" />
      ),
      cell: ({ row }) => {
        const courses =
          row.getValue<(typeof row)["original"]["courseEnrolled"]>(
            "courseEnrolled"
          );
        return courses && courses.length ? (
          <div className="flex flex-wrap gap-1 max-w-[16rem]">
            {courses.map((c) => (
              <Badge key={c.courseId} variant="secondary">
                {c.courseName} {/* Display the course name */}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground italic">None</span>
        );
      },
      meta: {
        label: "Courses",
        placeholder: "Filter by courses...",
        icon: BookOpen,
        visible: false,
      },
      enableColumnFilter: false,
    },
  ];
}
