import { INSERT_CHECK_LIST_COMMAND } from "@lexical/list"
import { $setBlocksType } from "@lexical/selection"
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical"
import { useToolbarContext } from "../../../context/toolbar-context"
import { blockTypeToBlockName } from "./block-format-data"
import { SelectItem } from "../../../../ui/select"

const BLOCK_FORMAT_VALUE = "check"

export function FormatCheckList() {
  const { activeEditor, blockType } = useToolbarContext()

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const formatCheckList = () => {
    if (blockType !== "check") { 
      activeEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
    } else {
      formatParagraph()
    }
  }

  const checkFormatInfo = blockTypeToBlockName[BLOCK_FORMAT_VALUE];

  const icon = checkFormatInfo?.icon || null;
  const label = checkFormatInfo?.label || "Check List";

  return (
    <SelectItem value={BLOCK_FORMAT_VALUE} onPointerDown={formatCheckList}>
      <div className="flex items-center gap-1 font-normal">
        {icon}
        {label}
      </div>
    </SelectItem>
  )
}