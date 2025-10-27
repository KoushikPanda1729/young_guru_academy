import { $createCodeNode } from "@lexical/code"
import { $setBlocksType } from "@lexical/selection"
import { $getSelection, $isRangeSelection } from "lexical"
import { useToolbarContext } from "../../../context/toolbar-context"
import { blockTypeToBlockName } from "./block-format-data"
import { SelectItem } from "../../../../ui/select"


const BLOCK_FORMAT_VALUE = "code"

export function FormatCodeBlock() {
  const { activeEditor, blockType } = useToolbarContext()

  const formatCode = () => {
    if (blockType !== "code") {
      activeEditor.update(() => {
        let selection = $getSelection()

        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode())
          } else {
            const textContent = selection.getTextContent()
            const codeNode = $createCodeNode()
            selection.insertNodes([codeNode])
            selection = $getSelection()
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent)
            }
          }
        }
      })
    }
  }

  const codeBlockFormatInfo = blockTypeToBlockName[BLOCK_FORMAT_VALUE];


  const icon = codeBlockFormatInfo?.icon || null;
  const label = codeBlockFormatInfo?.label || "Code Block"; 

  return (
    <SelectItem value={BLOCK_FORMAT_VALUE} onPointerDown={formatCode}>
      <div className="flex items-center gap-1 font-normal">
        {icon}
        {label}
      </div>
    </SelectItem>
  )
}