import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@t2p-admin/ui/components/checkbox"
import { CreateCouponOutput } from "@/features/coupon/helpers/coupon.schema"
import { CouponActionsCell } from "../cell/couponActionCell"

export const couponColumns = ({
  handleView,
  handleEdit,
  handleDelete,
}: {
  handleView: (coupon: CreateCouponOutput) => void
  handleEdit: (coupon: CreateCouponOutput) => void
  handleDelete: (id: string) => void
}): ColumnDef<CreateCouponOutput>[] => [
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
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <span className="font-mono font-medium">{row.original.code}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "discountValue",
    header: "Discount",
    cell: ({ row }) =>
      row.original.discountType === "PERCENTAGE"
        ? `${row.original.discountValue}%`
        : `₹${row.original.discountValue}`,
  },
  {
    accessorKey: "usageCount",
    header: "Usage",
    cell: ({ row }) => {
      const { usageCount, usageLimit } = row.original
      return usageLimit ? `${usageCount}/${usageLimit}` : `${usageCount}`
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (
      <span className={row.original.isActive ? "text-green-600" : "text-red-600"}>
        {row.original.isActive ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "validUntil",
    header: "Valid Until",
    cell: ({ row }) =>
      row.original.validUntil
        ? new Date(row.original.validUntil).toLocaleDateString()
        : "-",
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <CouponActionsCell
        coupon={row.original}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ),
  },
]
