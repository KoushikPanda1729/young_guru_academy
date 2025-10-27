import { INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"
import { $setBlocksType } from "@lexical/selection"
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical"
import { useToolbarContext } from "../../../context/toolbar-context"
import { blockTypeToBlockName } from "./block-format-data"
import { SelectItem } from "../../../../ui/select"


const BLOCK_FORMAT_VALUE = "bullet"

export function FormatBulletedList() {
  const { activeEditor, blockType } = useToolbarContext()

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const formatBulletedList = () => {
    // Current logic: If not a numbered list, insert unordered list. Else, make it a paragraph.
    // Consider if you want to toggle between bullet and paragraph directly:
    // if (blockType !== BLOCK_FORMAT_VALUE) { // If not already a bullet list
    //   activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    // } else { // If already a bullet list, convert to paragraph
    //   formatParagraph();
    // }
    // For now, retaining original logic as provided:
    if (blockType !== "number") {
      activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      formatParagraph()
    }
  }

  // Add a guard for blockTypeToBlockName[BLOCK_FORMAT_VALUE]
  const bulletFormatInfo = blockTypeToBlockName[BLOCK_FORMAT_VALUE];

  // Provide a fallback if bulletFormatInfo is undefined (highly unlikely for a hardcoded value)
  const icon = bulletFormatInfo?.icon || null; // Or a default icon component
  const label = bulletFormatInfo?.label || "Bulleted List"; // Or a default string

  return (
    <SelectItem value={BLOCK_FORMAT_VALUE} onPointerDown={formatBulletedList}>
      <div className="flex items-center gap-1 font-normal">
        {icon}
        {label}
      </div>
    </SelectItem>
  )
}