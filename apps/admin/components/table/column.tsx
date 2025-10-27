import { ColumnDef } from "@tanstack/react-table";

export type FilterType = "text" | "select";

export interface CustomColumnMeta {
  filterType?: FilterType;
  options?: string[];
}

export type CustomColumnDef<TData> = ColumnDef<TData, unknown> & {
  meta?: CustomColumnMeta;
};