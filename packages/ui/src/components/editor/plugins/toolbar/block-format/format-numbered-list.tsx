import { INSERT_ORDERED_LIST_COMMAND } from "@lexical/list"
import { $setBlocksType } from "@lexical/selection"
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical"
import { useToolbarContext } from "../../../context/toolbar-context"
import { SelectItem } from "../../../../ui/select"
import { blockTypeToBlockName } from "./block-format-data"


const BLOCK_FORMAT_VALUE = "number"

export function FormatNumberedList() {
  const { activeEditor, blockType } = useToolbarContext()

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const formatNumberedList = () => {
    // This logic correctly toggles: if it's already a numbered list,
    // it converts to a paragraph; otherwise, it inserts a numbered list.
    if (blockType !== "number") {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      formatParagraph()
    }
  }

  // Add a guard for blockTypeToBlockName[BLOCK_FORMAT_VALUE]
  const numberedListFormatInfo = blockTypeToBlockName[BLOCK_FORMAT_VALUE];

  // Provide a fallback if numberedListFormatInfo is undefined
  const icon = numberedListFormatInfo?.icon || null; // Or a default icon component
  const label = numberedListFormatInfo?.label || "Numbered List"; // Or a default string

  return (
    <SelectItem value={BLOCK_FORMAT_VALUE} onPointerDown={formatNumberedList}>
      <div className="flex items-center gap-1 font-normal">
        {icon}
        {label}
      </div>
    </SelectItem>
  )
}