import { ColumnDef } from "@tanstack/react-table"
import { QuestionActionsCell } from "../cell/questionActionCell"
import { QuestionType } from "@/features/question/question.schema"
import { Checkbox } from "@t2p-admin/ui/components/checkbox"

export const getQuestionColumns = ({
  handleViewEdit,
  handleDelete,
  handleArchive,
  handleUnarchive,
}: {
  handleViewEdit: (q: QuestionType) => void
  handleDelete: (q: QuestionType) => void
  handleArchive: (q: QuestionType) => void
  handleUnarchive: (q: QuestionType) => void
}): ColumnDef<QuestionType>[] => [
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
    accessorKey: "question",
    header: "Question",
    cell: ({ row }) => (
      <div className="max-w-md">
        <span className="font-medium line-clamp-2">{row.original.question}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="capitalize font-medium">{row.original.category}</span>
    ),
  },
  {
    accessorKey: "options",
    header: "Options",
    cell: ({ row }) => {
      const options = row.original.options
      return (
        <div className="flex flex-col space-y-1">
          {Object.entries(options).map(([key, value]) => (
            <span key={key} className="text-sm">
              {key.toUpperCase()}: {value}
            </span>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "answer",
    header: "Correct Answer",
    cell: ({ row }) => (
      <span className="font-medium text-green-600">{row.original.answer}</span>
    ),
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
      <QuestionActionsCell
        question={row.original}
        onViewEdit={handleViewEdit}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
    />
    ),
  },
]
