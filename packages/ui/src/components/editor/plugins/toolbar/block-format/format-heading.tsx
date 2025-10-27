import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import { $getSelection } from "lexical"
import { useToolbarContext } from "../../../context/toolbar-context"
import { SelectItem } from "../../../../ui/select"
import { blockTypeToBlockName } from "./block-format-data"


export function FormatHeading({ levels = [] }: { levels: HeadingTagType[] }) {
  const { activeEditor, blockType } = useToolbarContext()

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      activeEditor.update(() => {
        const selection = $getSelection()
        // Ensure selection is not null before proceeding
        if (selection) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize))
        }
      })
    }
  }

  return levels.map((level) => {
    // Add a guard for blockTypeToBlockName[level]
    const headingFormatInfo = blockTypeToBlockName[level as keyof typeof blockTypeToBlockName];

    // Provide fallback values if headingFormatInfo is undefined
    const icon = headingFormatInfo?.icon || null;
    const label = headingFormatInfo?.label || `Heading ${level.replace('h', '')}`; // Dynamic fallback label

    return (
      <SelectItem
        key={level}
        value={level}
        onPointerDown={() => formatHeading(level)}
      >
        <div className="flex items-center gap-1 font-normal">
          {icon}
          {label}
        </div>
      </SelectItem>
    )
  })
}