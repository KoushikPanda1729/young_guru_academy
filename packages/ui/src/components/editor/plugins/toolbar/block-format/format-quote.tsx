import { $createQuoteNode } from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import { $getSelection } from "lexical"
import { useToolbarContext } from "../../../context/toolbar-context"
import { blockTypeToBlockName } from "./block-format-data"
import { SelectItem } from "../../../../ui/select"


const BLOCK_FORMAT_VALUE = "quote"

export function FormatQuote() {
  const { activeEditor, blockType } = useToolbarContext()

  const formatQuote = () => {
    // This logic correctly toggles: if it's already a quote, it does nothing
    // (assuming you only want to convert to a quote, not toggle back to paragraph).
    // If you wanted to toggle back to a paragraph, you'd add an else block.
    if (blockType !== "quote") {
      activeEditor.update(() => {
        const selection = $getSelection()
        // Ensure selection is not null before proceeding
        if (selection) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    }
  }

  // Add a guard for blockTypeToBlockName[BLOCK_FORMAT_VALUE]
  const quoteFormatInfo = blockTypeToBlockName[BLOCK_FORMAT_VALUE];

  // Provide a fallback if quoteFormatInfo is undefined (highly unlikely for a hardcoded value)
  const icon = quoteFormatInfo?.icon || null; // Or a default icon component
  const label = quoteFormatInfo?.label || "Quote"; // Or a default string

  return (
    <SelectItem value={BLOCK_FORMAT_VALUE} onPointerDown={formatQuote}>
      <div className="flex items-center gap-1 font-normal">
        {icon}
        {label}
      </div>
    </SelectItem>
  )
}