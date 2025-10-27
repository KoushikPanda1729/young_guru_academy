"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@t2p-admin/ui/components/sheet"
import { cn } from "@t2p-admin/ui/lib/utils"

interface KeyValueProps {
  label: string
  value?: string | number | boolean | null
  className?: string
}

const KeyValue = ({ label, value, className }: KeyValueProps) => (
  <div className={cn("space-y-1", className)}>
    <p className="text-muted-foreground text-sm font-medium leading-none">
      {label}
    </p>
    <p className="text-sm">
      {typeof value === "boolean" ? (value ? "Yes" : "No") : value ?? "N/A"}
    </p>
  </div>
)

export type FieldConfig<TData> = {
  label: string
  key: keyof TData
  format?: (value: TData[keyof TData]) => string | number
}

interface DetailSheetProps<TData extends object> {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: TData | null
  title: string
  fields: FieldConfig<TData>[]
  chartData?: { name: string; value: number }[]
  chartLabel?: string
}

export function DetailSheet<TData extends object>({
  open,
  onOpenChange,
  data,
  title,
  fields,
}: DetailSheetProps<TData>) {
  if (!data) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] sm:w-[500px] px-4">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4 text-sm">
          {fields.map(({ label, key, format }) => (
            <KeyValue
              key={String(key)}
              label={label}
              value={format ? format(data[key]) : (data[key] as string | number | boolean | null)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
