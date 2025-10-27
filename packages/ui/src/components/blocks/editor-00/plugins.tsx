import { useState } from "react"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ToolbarPlugin } from "../../editor/plugins/toolbar/toolbar-plugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { ContentEditable } from "../../editor/editor-ui/content-editable"
import { BlockFormatDropDown } from "../../editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatParagraph } from "../../editor/plugins/toolbar/block-format/format-paragraph"
import { FormatHeading } from "../../editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "../../editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatBulletedList } from "../../editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "../../editor/plugins/toolbar/block-format/format-check-list"
import { FormatQuote } from "../../editor/plugins/toolbar/block-format/format-quote"
import { ClearFormattingToolbarPlugin } from "../../editor/plugins/toolbar/clear-formatting-toolbar-plugin"
import { ElementFormatToolbarPlugin } from "../../editor/plugins/toolbar/element-format-toolbar-plugin"
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin"
import { FontBackgroundToolbarPlugin } from "../../editor/plugins/toolbar/font-background-toolbar-plugin"
import { FontColorToolbarPlugin } from "../../editor/plugins/toolbar/font-color-toolbar-plugin"
import { FontFamilyToolbarPlugin } from "../../editor/plugins/toolbar/font-family-toolbar-plugin"
import { FontFormatToolbarPlugin } from "../../editor/plugins/toolbar/font-format-toolbar-plugin"
import { FontSizeToolbarPlugin } from "../../editor/plugins/toolbar/font-size-toolbar-plugin"
import { HistoryToolbarPlugin } from "../../editor/plugins/toolbar/history-toolbar-plugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LinkToolbarPlugin } from "../../editor/plugins/toolbar/link-toolbar-plugin"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { LinkPlugin } from "../../editor/plugins/toolbar/link-plugin"
import { AutoLinkPlugin } from "../../editor/plugins/toolbar/auto-link-plugin"
import { FloatingLinkEditorPlugin } from "../../editor/plugins/toolbar/floating-link-editor-plugin"
import { SubSuperToolbarPlugin } from "../../editor/plugins/toolbar/subsuper-toolbar-plugin"
import { ActionsPlugin } from "../../editor/plugins/actions/actions-plugin"
import { ClearEditorActionPlugin } from "../../editor/plugins/actions/clear-editor-plugin"
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin"
import { CounterCharacterPlugin } from "../../editor/plugins/actions/counter-character-plugin"
import { EditModeTogglePlugin } from "../../editor/plugins/actions/edit-mode-toggle-plugin"
import { ImportExportPlugin } from "../../editor/plugins/actions/import-export-plugin"
import { Separator } from "../../ui/separator"


export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
        <ToolbarPlugin>
        {( { blockType }) => (
          <div className="vertical-align-middle sticky z-10 flex items-center gap-2 overflow-auto border-b p-1">
            <HistoryToolbarPlugin />
            <Separator orientation="vertical" className="!h-7" />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatQuote />
            </BlockFormatDropDown>
            <Separator orientation="vertical" className="!h-7"/>
            <FontFamilyToolbarPlugin />
            <FontFormatToolbarPlugin format="bold" />
            <FontFormatToolbarPlugin format="italic" />
            <FontFormatToolbarPlugin format="underline" />
            <FontFormatToolbarPlugin format="strikethrough" />
            <Separator orientation="vertical" className="!h-7"/>
            <ClearFormattingToolbarPlugin />
            <FontSizeToolbarPlugin />
            <FontColorToolbarPlugin />
            <FontBackgroundToolbarPlugin />
            <Separator orientation="vertical" className="!h-7"/>
            <ElementFormatToolbarPlugin />
            <LinkToolbarPlugin />
            <SubSuperToolbarPlugin />
          </div>
        )}
      </ToolbarPlugin>
        <div className="relative">
          <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  className="ContentEditable__root relative block h-[calc(100vh-320px)] min-h-72 overflow-auto px-8 py-4 focus:outline-none"
                  placeholder={"Start typing ..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        </div>
        {/* editor plugins */}
        <ListPlugin />
        <CheckListPlugin />
        <TabIndentationPlugin />
        <HistoryPlugin />
        <ClickableLinkPlugin />
        <AutoLinkPlugin />
        <LinkPlugin />
        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
      {/* actions plugins */}
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="flex flex-1 justify-start">
            {/* left side action buttons */}
          </div>
          <div>
            {/* center action buttons */}
            <CounterCharacterPlugin charset="UTF-16" />
          </div>
          <div className="flex flex-1 justify-end">
            {/* right side action buttons */}
            <>
              <ClearEditorActionPlugin />
              <ClearEditorPlugin />
              <EditModeTogglePlugin />
              <ImportExportPlugin />
            </>
          </div>
        </div>
      </ActionsPlugin>
    </div>
  )
}


