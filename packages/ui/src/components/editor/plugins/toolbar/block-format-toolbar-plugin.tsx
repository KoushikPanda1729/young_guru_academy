"use client"

import { $isListNode, ListNode } from "@lexical/list"
import { $isHeadingNode } from "@lexical/rich-text"
import { $findMatchingParent, $getNearestNodeOfType } from "@lexical/utils"
import { $isRangeSelection, $isRootOrShadowRoot, BaseSelection } from "lexical"
import { useToolbarContext } from "../../context/toolbar-context"
import { useUpdateToolbarHandler } from "../../editor-hooks/use-update-toolbar"
import { blockTypeToBlockName } from "./block-format/block-format-data"


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
} from "../../../ui/select"


export function BlockFormatDropDown({
  children,
}: {
  children: React.ReactNode
}) {
  const { activeEditor, blockType, setBlockType } = useToolbarContext()

  function $updateToolbar(selection: BaseSelection) {
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent()
              return parent !== null && $isRootOrShadowRoot(parent)
            })

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDOM = activeEditor.getElementByKey(elementKey)

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          )
          const type = parentList
            ? parentList.getListType()
            : element.getListType()
          setBlockType(type)
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType()
          // Ensure the type is a valid key before setting
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName)
          } else {
            // Fallback to a default block type if the current type is not recognized
            setBlockType("paragraph"); // Or another suitable default
          }
        }
      }
    }
  }

  useUpdateToolbarHandler($updateToolbar)

  // Add a guard for blockTypeToBlockName[blockType]
  const currentBlockInfo = blockTypeToBlockName[blockType];

  return (
    <Select
      value={blockType}
      onValueChange={(value) => {
        setBlockType(value as keyof typeof blockTypeToBlockName)
      }}
    >
      <SelectTrigger className="!h-8 w-min gap-1">
        {/* Only render if currentBlockInfo is defined */}
        {currentBlockInfo?.icon}
        <span>{currentBlockInfo?.label}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}
