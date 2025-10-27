// "use client"

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@t2p-admin/ui/components/dropdown-menu"
// import { Button } from "@t2p-admin/ui/components/button"
// import { IconDotsVertical } from "@tabler/icons-react"
// import { MemberType } from "../helpers/members-schema"

// interface MemberActionsCellProps {
//   member: MemberType
//   onView: (member: MemberType) => void
//   onEdit: (member: MemberType) => void
//   onRemove: (member: MemberType) => void
// }

// export function MemberActionsCell({
//   member,
//   onView,
//   onEdit,
//   onRemove,
// }: MemberActionsCellProps) {

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className="h-8 w-8">
//           <IconDotsVertical className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-48">
//         <DropdownMenuItem onClick={() => onView(member)}>
//           View Details
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => onEdit(member)}>
//           Edit Member
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={() => onRemove(member)}
//           className="text-destructive focus:text-destructive"
//         >
//           Remove Member
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
