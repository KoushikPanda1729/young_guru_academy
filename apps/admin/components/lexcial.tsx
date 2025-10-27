import type { SerializedEditorState } from "lexical";

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

function tryParse(val: unknown): unknown {
  if (typeof val !== "string") return val;
  try {
    return JSON.parse(val);
  } catch {
    return val;
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

export function serializeLexicalToString(
  state: SerializedEditorState | undefined
): string {
  if (!state) return "{}";
  try {
    return JSON.stringify(state);
  } catch {
    return "{}";
  }
}
