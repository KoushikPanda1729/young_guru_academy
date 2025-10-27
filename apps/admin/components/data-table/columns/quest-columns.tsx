import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { QuestActionsCell } from "../cell/questActionCell"
import { QuestType } from "@/features/quest/quest.schema"
import { Checkbox } from "@t2p-admin/ui/components/checkbox"

export const getQuestColumns = ({
  handleViewEdit,
  handleDelete,
  handleArchive,
  handleUnarchive,
}: {
  handleViewEdit: (quest: QuestType) => void
  handleDelete: (quest: QuestType) => void
  handleArchive: (quest: QuestType) => void
  handleUnarchive: (quest: QuestType) => void
}): ColumnDef<QuestType>[] => [
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
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
  accessorKey: "description",
  header: "Description",
  cell: ({ row }) => {
    const desc = row.original.description || "";
    const shortDesc = desc.length > 75 ? desc.slice(0, 50) + "..." : desc;
    return (
      <span className="text-sm text-muted-foreground">
        {shortDesc}
      </span>
    );
  },
},
  {
    accessorKey: "archived",
    header: "Status",
    cell: ({ row }) => (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        row.original.archived 
          ? "bg-gray-100 text-gray-800" 
          : "bg-green-100 text-green-800"
      }`}>
        {row.original.archived ? "Archived" : "Active"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) =>
      row.original.createdAt
        ? format(new Date(row.original.createdAt), "dd MMM yyyy")
        : "N/A",
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <QuestActionsCell
        quest={row.original}
        onView={() => handleViewEdit(row.original)}
        onEdit={() => handleViewEdit(row.original)}
        onDelete={() => handleDelete(row.original)}
        onArchive={() => handleArchive(row.original)}
        onUnarchive={() => handleUnarchive(row.original)}
      />
    ),
  },
]