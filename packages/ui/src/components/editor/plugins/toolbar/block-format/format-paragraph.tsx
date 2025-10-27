import { $setBlocksType } from "@lexical/selection"
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical"
import { useToolbarContext } from "../../../context/toolbar-context"
import { blockTypeToBlockName } from "./block-format-data"
import { SelectItem } from "../../../../ui/select"

const BLOCK_FORMAT_VALUE = "paragraph"

export function FormatParagraph() {
  const { activeEditor } = useToolbarContext()

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  // Add a guard for blockTypeToBlockName[BLOCK_FORMAT_VALUE]
  const paragraphFormatInfo = blockTypeToBlockName[BLOCK_FORMAT_VALUE];

  // Provide a fallback if paragraphFormatInfo is undefined
  const icon = paragraphFormatInfo?.icon || null; // Or a default icon component
  const label = paragraphFormatInfo?.label || "Paragraph"; // Or a default string

  return (
    <SelectItem value={BLOCK_FORMAT_VALUE} onPointerDown={formatParagraph}>
      <div className="flex items-center gap-1 font-normal">
        {icon}
        {label}
      </div>
    </SelectItem>
  )
}