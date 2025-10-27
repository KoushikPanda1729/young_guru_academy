import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu"
import { Button } from "@t2p-admin/ui/components/button"
import { MoreHorizontal } from "lucide-react"
import { QuestionType } from "@/features/question/question.schema"

type Props = {
  question: QuestionType
  onViewEdit: (q: QuestionType) => void
  onDelete: (q: QuestionType) => void
  onArchive: (q: QuestionType) => void
  onUnarchive: (q: QuestionType) => void
}

export function QuestionActionsCell({
  question,
  onViewEdit,
  onDelete,
  onArchive,
  onUnarchive,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onViewEdit(question)}>
          View/Edit Question
        </DropdownMenuItem>
        {question.archived ? (
          <DropdownMenuItem onClick={() => onUnarchive(question)}>
            Unarchive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onArchive(question)}>
            Archive
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => onDelete(question)}
          className="text-destructive focus:text-destructive"
        >
          Delete Question
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
