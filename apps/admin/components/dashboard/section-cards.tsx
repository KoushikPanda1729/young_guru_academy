"use client"

import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { DateRange } from "@/components/dashboard/date-filter-bar"
import { SectionCardWrapper } from "./section-card-wrapper"

interface SectionCardData {
  count: number
  trend: number
}

interface SectionData {
  user: SectionCardData
  download: SectionCardData
  feedback: SectionCardData
  audioCall: SectionCardData
}

interface Props {
  dateRange: DateRange
  data?: SectionData
  status: "idle" | "loading" | "error" | "success"
}

export function SectionCards({ dateRange, data, status }: Props) {
  const getDateRangeLabel = () => {
    switch (dateRange.preset) {
      case "7d":
        return "last 7 days"
      case "30d":
        return "last 30 days"
      case "90d":
        return "last 3 months"
      case "total":
        return "all time"
      case "custom":
        return dateRange.from && dateRange.to
          ? `${new Date(dateRange.from).toLocaleDateString()} - ${new Date(dateRange.to).toLocaleDateString()}`
          : "custom period"
      default:
        return "selected period"
    }
  }

  if (status !== "success" || !data) return null

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <SectionCardWrapper
        title="Total Users"
        value={data.user.count.toLocaleString()}
        description="Users for current period"
        badgeIcon={<IconTrendingUp />}
        badgeText={`${data.user.trend}%`}
        footerText="User growth"
        footerSubtext={`User stats for ${getDateRangeLabel()}`}
        trendingIcon={<IconTrendingUp />}
      />
      <SectionCardWrapper
        title="Total Downloads"
        value={data.download.count.toLocaleString()}
        description="Downloads this period"
        badgeIcon={<IconTrendingDown />}
        badgeText={`${data.download.trend}%`}
        footerText="App downloads"
        footerSubtext="Download performance"
        trendingIcon={<IconTrendingDown />}
      />
      <SectionCardWrapper
        title="Total Reviews & Ratings"
        value={data.feedback.count.toLocaleString()}
        description="Feedback engagement"
        badgeIcon={<IconTrendingUp />}
        badgeText={`${data.feedback.trend}%`}
        footerText="Active feedback from users"
        footerSubtext="Satisfaction score trend"
        trendingIcon={<IconTrendingUp />}
      />
      <SectionCardWrapper
        title="Total Audio Calls"
        value={data.audioCall.count.toLocaleString()}
        description="Calls this period"
        badgeIcon={<IconTrendingUp />}
        badgeText={`${data.audioCall.trend}%`}
        footerText="Call volume trend"
        footerSubtext="Audio communication usage"
        trendingIcon={<IconTrendingUp />}
      />
    </div>
  )
}
