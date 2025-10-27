/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import type { SerializedEditorState } from "lexical";
import { createHeadlessEditor } from "@lexical/headless";
import { $convertToMarkdownString, TRANSFORMERS, ELEMENT_TRANSFORMERS,  MULTILINE_ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS} from "@lexical/markdown";
import { nodes } from "@t2p-admin/ui/blocks/editor-00/editor"

export const EMPTY_SERIALIZED: SerializedEditorState = {
  root: {
    children: [
      {
        children: [],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph", 
        version: 1,
      },
    ], 
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

function tryParse(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}



export function deserializeContentToLexical(
  content: string | null | undefined
): SerializedEditorState {
  if (!content) return EMPTY_SERIALIZED;
  let parsed: unknown = tryParse(content);
  parsed = tryParse(parsed);

  if (
    parsed &&
    typeof parsed === "object" &&
    (parsed as any).root &&
    typeof (parsed as any).root === "object"
  ) {
    return parsed as SerializedEditorState;
  }

  return EMPTY_SERIALIZED;
}

export function lexicalStateToMarkdown(serialized: SerializedEditorState): string {
  try {
    const editor = createHeadlessEditor({
      namespace: 'policy-md',
      nodes
    });

    let md = "";
    editor.update(() => {
      const editorState = editor.parseEditorState(serialized);
      editor.setEditorState(editorState);
      const ALL_TRANSFORMERS = [
      ...TRANSFORMERS,
      ...ELEMENT_TRANSFORMERS,
      ...MULTILINE_ELEMENT_TRANSFORMERS,
      ...TEXT_FORMAT_TRANSFORMERS,
      ...TEXT_MATCH_TRANSFORMERS,
    ];
      md = $convertToMarkdownString(ALL_TRANSFORMERS);
    });
    return md.trim();
  } catch {
    try {
      const editor = createHeadlessEditor({
        namespace: "policy-md",
        nodes
      });
      let text = "";
      editor.update(() => {
        const editorState = editor.parseEditorState(serialized);
        editor.setEditorState(editorState);
        text = editor.getEditorState().read(() => {
          return (serialized.root?.children ?? [])
            .map((n: any) => (typeof n?.text === "string" ? n.text : ""))
            .join("\n\n");
        });
      });
      return text.trim();
    } catch {
      return "";
    }
  }
}

export function policyContentToMarkdown(raw: string): string {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

    const editor = createHeadlessEditor({
      namespace: "policy-md",
      nodes,
    });

    const editorState = editor.parseEditorState(parsed);
    editor.setEditorState(editorState);

    const ALL_TRANSFORMERS = [
      ...TRANSFORMERS,
      ...ELEMENT_TRANSFORMERS,
      ...MULTILINE_ELEMENT_TRANSFORMERS,
      ...TEXT_FORMAT_TRANSFORMERS,
      ...TEXT_MATCH_TRANSFORMERS,
    ];

    let md = "";
    editor.getEditorState().read(() => {
      md = $convertToMarkdownString(ALL_TRANSFORMERS);
    });
    return md
  } catch (err) {
    console.error("Markdown conversion failed:", err);
    return "";
  }
}
