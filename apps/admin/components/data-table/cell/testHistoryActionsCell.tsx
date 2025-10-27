"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@t2p-admin/ui/components/dropdown-menu"
import { Button } from "@t2p-admin/ui/components/button"
import { IconDotsVertical } from "@tabler/icons-react"
import { TestHistoryType } from "@/features/test/test.schema"
import { IdType } from "@/lib/zod"

export function TestHistoryActionsCell({
  test,
  onView,
  onDelete,
  onArchive,
  onUnarchive,
}: {
  test: TestHistoryType
  onView: (test: TestHistoryType) => void
  onDelete: (test: IdType) => void
  onArchive: (test: IdType) => void
  onUnarchive: (test: IdType) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <IconDotsVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onView(test)}>View Details</DropdownMenuItem>
        {test.archived ? (
          <DropdownMenuItem onClick={() => onUnarchive(test)}>Unarchive</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onArchive(test)}>Archive</DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => onDelete(test)}
          className="text-destructive focus:text-destructive"
        >
          Delete Record
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

