"use client"

import * as React from "react"
import { Header } from "@/components/dashboard/page-header"
import { StatsCard } from "@/components/stats-card"
import { TanstackTable, WithId, type TanstackTableProps } from "@/components/table/tanstack-table"
import { StatsCardSkeleton } from "@/components/stats-card-skeleton"
interface StatCardItem {
  label: string
  value: number | string
  icon?: React.ReactNode
  dotColor?: string
}

interface DashboardTemplateProps<TData extends WithId> {
  icon?: React.ReactNode
  title: string
  description?: string
  onRefresh?: () => void
  refreshing?: boolean
  actions?: React.ReactNode
  stats?: StatCardItem[]
  isStatsLoading?: boolean
  tableProps?: TanstackTableProps<TData> 
  children?: React.ReactNode 
}

export const DashboardTemplate = <TData extends WithId>({
  icon,
  title,
  description,
  onRefresh,
  refreshing,
  actions,
  stats = [],
  tableProps,
  isStatsLoading,
  children,
}: DashboardTemplateProps<TData>) => {
  return (
    <>
      <section className="pb-4">
        <Header
          icon={icon}
          title={title}
          description={description}
          onRefresh={onRefresh}
          refreshing={refreshing}
          actions={actions}
        />
      </section>

      <section className="px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isStatsLoading
            ? Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
            : stats.map((stat) => (
                <StatsCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  dotColor={stat.dotColor}
                />
              ))}
        </div>
      </section>

      <section className="pb-10">
        {tableProps && <TanstackTable {...tableProps} />}
      </section>

      {children}
    </>
  )
}
