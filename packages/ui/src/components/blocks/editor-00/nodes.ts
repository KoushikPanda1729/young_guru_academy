import{ HeadingNode, QuoteNode } from "@lexical/rich-text"
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
  LineBreakNode
} from "lexical"
import { ListItemNode, ListNode } from "@lexical/list"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { CodeNode } from "@lexical/code";

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  AutoLinkNode,
  CodeNode,
  ParagraphNode,
  TextNode,
  LineBreakNode
  ]
