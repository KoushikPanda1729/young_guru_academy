import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { TestHistoryActionsCell } from "../cell/testHistoryActionsCell";
import { TestHistoryType } from "@/features/test/test.schema";
import { IdType } from "@/lib/zod";
import { Checkbox } from "@t2p-admin/ui/components/checkbox";

export const testHistoryColumns = ({
  handleView,
  handleDelete,
  handleArchive,
  handleUnarchive,
}: {
  handleView: (test: TestHistoryType) => void;
  handleDelete: (test: IdType) => void;
  handleArchive: (test: IdType) => void;
  handleUnarchive: (test: IdType) => void;
}): ColumnDef<TestHistoryType>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentName",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.studentName}</span>
    ),
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.score}/15</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Attempted At",
    cell: ({ row }) =>
      row.original.createdAt
        ? format(new Date(row.original.createdAt), "dd MMM yyyy, hh:mm a")
        : "N/A",
  },
  {
    accessorKey: "archived",
    header: "Archived",
    cell: ({ row }) => (row.original.archived ? "Yes" : "No"),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <TestHistoryActionsCell
        test={row.original}
        onView={handleView}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
      />
    ),
  },
];
