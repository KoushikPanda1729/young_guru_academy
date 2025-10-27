"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu"
import { Button } from "@t2p-admin/ui/components/button"
import { IconDotsVertical } from "@tabler/icons-react"
import { QuestType } from "@/features/quest/quest.schema"

interface QuestActionsCellProps {
  quest: QuestType
  onView: (quest: QuestType) => void
  onEdit: (quest: QuestType) => void
  onDelete: (quest: QuestType) => void
  onArchive: (quest: QuestType) => void
  onUnarchive: (quest: QuestType) => void
}

export function QuestActionsCell({
  quest,
  onView,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
}: QuestActionsCellProps) {
  const handleArchiveToggle = () => {
    if (quest.archived) {
      onUnarchive(quest)
    } else {
      onArchive(quest)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <IconDotsVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onView(quest)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(quest)}>
          Edit Quest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleArchiveToggle}>
          {quest.archived ? "Unarchive" : "Archive"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(quest)}
          className="text-destructive focus:text-destructive"
        >
          Delete Quest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
