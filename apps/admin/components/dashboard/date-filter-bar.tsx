"use client"

import * as React from "react"
import { Button } from "@t2p-admin/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@t2p-admin/ui/components/select"
import { Calendar } from "@t2p-admin/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@t2p-admin/ui/components/popover"
import { ToggleGroup, ToggleGroupItem } from "@t2p-admin/ui/components/toggle-group"
import { addDays, format } from "date-fns"
import { useIsMobile } from "@t2p-admin/ui/hooks/use-mobile"

export type FilterPreset = "7d" | "30d" | "90d" | "total" | "custom"

export interface DateRange {
  preset: FilterPreset
  from: Date | null
  to: Date | null
}

interface Props {
  value: DateRange
  onChange: (range: DateRange) => void
}

export function DateFilterBar({ value, onChange }: Props) {
  const isMobile = useIsMobile()
  const handlePresetChange = (preset: FilterPreset) => {
    let from: Date | null = null
    let to: Date | null = new Date()

    switch (preset) {
      case "7d":
        from = addDays(new Date(), -7)
        break
      case "30d":
        from = addDays(new Date(), -30)
        break
      case "90d":
        from = addDays(new Date(), -90)
        break
      case "total":
        from = null
        to = null
        break
      case "custom":
        from = value.from
        to = value.to
        break
    }

    onChange({ preset, from, to })
  }

  const handleCustomRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      onChange({
        preset: "custom",
        from: range.from || null,
        to: range.to || null,
      })
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <ToggleGroup
  type="single"
  value={value.preset}
  onValueChange={handlePresetChange}
  variant="outline"
  className="hidden md:flex w-[500px]"
>
  <ToggleGroupItem value="7d" className="px-3 py-1.5">7 days</ToggleGroupItem>
  <ToggleGroupItem value="30d" className="px-3 py-1.5">30 days</ToggleGroupItem>
  <ToggleGroupItem value="90d" className="px-3 py-1.5">90 days</ToggleGroupItem>
  <ToggleGroupItem value="total" className="px-3 py-1.5">Total</ToggleGroupItem>
  <ToggleGroupItem value="custom" className="px-3 py-1.5">Custom</ToggleGroupItem>
</ToggleGroup>


      {
        isMobile && (
          <Select value={value.preset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-40 md:hidden">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="total">Total</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        )
      }

      {value.preset === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[260px] justify-start text-left">
              {value.from && value.to ? (
                <span>
                  {format(value.from, "MMM d, yyyy")} – {format(value.to, "MMM d, yyyy")}
                </span>
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: value.from || undefined, to: value.to || undefined }}
              onSelect={handleCustomRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}