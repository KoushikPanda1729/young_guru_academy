"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@t2p-admin/ui/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@t2p-admin/ui/components/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@t2p-admin/ui/components/chart"
import { isWithinInterval, parseISO } from "date-fns"
import { DateRange } from "@/components/dashboard/date-filter-bar"
import { overviewSchema } from "@/features/overview/overview.schema"
import z from "zod"

type ChartEntry = z.infer<typeof overviewSchema.shape.chart>[number]

interface Props {
  dateRange: DateRange
  data: {
    chart: ChartEntry[]
  } | null
  status: "loading" | "error" | "success" | "idle"
}

const chartConfig = {
  mobile: { label: "Mobile Users", color: "var(--color-android)" },
} satisfies ChartConfig

export function ChartAreaInteractive({ dateRange, data, status }: Props) {
  const isMobile = useIsMobile()

  const chartData = React.useMemo<ChartEntry[]>(() => {
    if (!data?.chart) return []
    if (dateRange.preset === "total" || (!dateRange.from && !dateRange.to)) {
      return data.chart
    }
    if (!dateRange.from || !dateRange.to) return data.chart

    return data.chart.filter((item) => {
      const itemDate = parseISO(item.date)
      return isWithinInterval(itemDate, {
        start: dateRange.from!,
        end: dateRange.to!,
      })
    })
  }, [data, dateRange])

  const getChartTitle = () => {
    switch (dateRange.preset) {
      case "7d":
        return "Last 7 days"
      case "30d":
        return "Last 30 days"
      case "90d":
        return "Last 3 months"
      case "total":
        return "All time"
      case "custom":
        return dateRange.from && dateRange.to
          ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
          : "Custom period"
      default:
        return "Selected period"
    }
  }

  if (status !== "success" || !chartData.length) return null

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>{getChartTitle()}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-primary)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
