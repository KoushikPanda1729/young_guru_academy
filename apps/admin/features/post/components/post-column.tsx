import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Checkbox } from "@t2p-admin/ui/components/checkbox"
import { PostType } from "../helpers/post.schema"
import { PostActionsCell } from "./post-action-cell"

export const getPostColumns = ({
  handleView,
  handleEdit,
  handleDelete,
}: {
  handleView: (post: PostType) => void
  handleEdit: (post: PostType) => void
  handleDelete: (post: PostType) => void
}): ColumnDef<PostType>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
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
    accessorKey: "startsAt",
    header: "Starts",
    cell: ({ row }) =>
      row.original.startsAt
        ? format(new Date(row.original.startsAt), "dd MMM yyyy")
        : "N/A",
  },
  {
    accessorKey: "endsAt",
    header: "Ends",
    cell: ({ row }) =>
      row.original.endsAt
        ? format(new Date(row.original.endsAt), "dd MMM yyyy")
        : "N/A",
  },
  {
    accessorKey: "_count",
    header: "Stats",
    cell: ({ row }) => (
      <span className="text-sm text-foreground">
        Likes: {row.original.likesCount}, Comments: {row.original.commentsCount}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <PostActionsCell
        post={row.original}
        onView={() => handleView(row.original)}
        onEdit={() => handleEdit(row.original)}
        onDelete={() => handleDelete(row.original)}
      />
    ),
  },
]
