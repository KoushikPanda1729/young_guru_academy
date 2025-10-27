"use client"

import { Button } from "@t2p-admin/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu"
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react"
import { PostType } from "../helpers/post.schema"

export function PostActionsCell({
  post,
  onView,
  onEdit,
  onDelete,
}: {
  post: PostType
  onView: (post: PostType) => void
  onEdit: (post: PostType) => void
  onDelete: (post: PostType) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(post)}>
          <Eye className="mr-2 h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(post)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(post)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
