"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { StudentFeedbackItem } from "../helpers/reviews.schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu";
import { Button } from "@t2p-admin/ui/components/button";
import { IconDotsVertical } from "@tabler/icons-react";

export const getReviewColumns = ({
  handleView,
  handleDelete,
}: {
  handleView: (feedback: StudentFeedbackItem) => void;
  handleDelete: (feedback: StudentFeedbackItem) => void;
}): ColumnDef<StudentFeedbackItem>[] => [
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span>{row.original.reviewer.user.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span>{row.original.student.user.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    id: 'category',
    header: "Type",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          row.original.type === "REPORT"
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.rating} / 5</span>
    ),
  },
  {
    accessorKey: "review",
    header: "Review",
    cell: ({ row }) => {
      const text = row.original.review || "";
      const shortText = text.length > 75 ? text.slice(0, 75) + "..." : text;
      return <span className="text-sm text-muted-foreground">{shortText}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      row.original.createdAt
        ? format(new Date(row.original.createdAt), "dd MMM yyyy")
        : "N/A",
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleView(row.original)}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDelete(row.original)}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
