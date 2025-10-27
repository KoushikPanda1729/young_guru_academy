// import { ColumnDef } from "@tanstack/react-table"
// import { format } from "date-fns"
// import { Checkbox } from "@t2p-admin/ui/components/checkbox"
// import { MemberType } from "../helpers/members-schema"
// import { MemberActionsCell } from "./member-action-cell"

// export const getMembersColumns = ({
//   handleView,
//   handleRemove,
//   handleEdit
// }: {
//   handleView: (member: MemberType) => void
//   handleRemove: (member: MemberType) => void
//   handleEdit: (member: MemberType) => void
// }): ColumnDef<MemberType>[] => [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       </div>
//     ),
//     cell: ({ row }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       </div>
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "user.name",
//     header: "Name",
//     cell: ({ row }) => (
//       <span className="font-medium">{row.original.user.name}</span>
//     ),
//   },
//   {
//     accessorKey: "user.email",
//     header: "Email",
//     cell: ({ row }) => <span>{row.original.user.email}</span>,
//   },
//   {
//     accessorKey: "role",
//     header: "Role",
//     cell: ({ row }) => (
//       <span className="capitalize">{row.original.role}</span>
//     ),
//   },
//   {
//     accessorKey: "createdAt",
//     header: "Joined",
//     cell: ({ row }) =>
//       row.original.createdAt
//         ? format(new Date(row.original.createdAt), "dd MMM yyyy")
//         : "N/A",
//   },
//   {
//     id: "actions",
//     header: "",
//     enableSorting: false,
//     enableHiding: false,
//     cell: ({ row }) => (
//       <MemberActionsCell
//         member={row.original}
//         onView={() => handleView(row.original)}
//         onEdit={() => handleEdit(row.original)}
//         onRemove={() => handleRemove(row.original)}
//       />
//     ),
//   },
// ]
