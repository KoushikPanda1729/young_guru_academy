"use client";

import { IconPhoneCall } from "@tabler/icons-react";
import { Circle } from "lucide-react";
import { useCall } from "@/features/call/hooks/useCall";
import { Header } from "../../../components/dashboard/page-header";
import { StatsCard } from "../../../components/stats-card";
import { Shell } from "@t2p-admin/ui/components/extra/shell";
import { FeatureFlagsProvider } from "../../../components/feature-flag-provider";
import React from "react";
import { DataTableSkeleton } from "@t2p-admin/ui/components/data-table/data-table-skeleton";
import { CallTable } from "./call-table";

export default function CallClient() {
  const { stats, isLoading, isStatsLoading, refetch, refetchStats } = useCall({
    initialPageSize: 10,
    enabled: true,
  });

  const enhancedStats = stats
    ? [
        {
          label: "Total Calls",
          value: stats.totalCount,
          icon: <Circle className="size-4 text-muted-foreground" />,
          isLoading: isStatsLoading,
        },
        {
          label: "This Week",
          value: stats.weeklyCalls,
          icon: <Circle className="size-4 text-blue-500" />,
          isLoading: isStatsLoading,
        },
        {
          label: "This Month",
          value: stats.monthlyCalls,
          icon: <Circle className="size-4 text-green-500" />,
          isLoading: isStatsLoading,
        },
        {
          label: "Today",
          value: stats.todaysCalls,
          icon: <Circle className="size-4 text-yellow-500" />,
          isLoading: isStatsLoading,
        },
      ]
    : [];

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchStats()]);
  };

  return (
    <>
      <section className="pb-4">
        <Header
          icon={<IconPhoneCall className="size-6 text-primary" />}
          title="Call Management"
          description="Monitor and manage all audio calls"
          onRefresh={handleRefresh}
          refreshing={isLoading || isStatsLoading}
        />
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pb-6">
        {stats
          ? enhancedStats.map((item) => (
              <StatsCard
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value}
              />
            ))
          : Array.from({ length: 3 }).map((_, idx) => (
              <StatsCard
                key={idx}
                label="Loading..."
                value="-"
                dotColor="bg-gray-200"
              />
            ))}
      </section>
      <section className="px-6 pb-4">
        <Shell className="gap-2">
          <FeatureFlagsProvider>
            <React.Suspense
              fallback={
                <DataTableSkeleton
                  columnCount={7}
                  filterCount={2}
                  cellWidths={[
                    "10rem",
                    "30rem",
                    "10rem",
                    "10rem",
                    "6rem",
                    "6rem",
                    "6rem",
                  ]}
                  shrinkZero
                />
              }
            >
              <CallTable />
            </React.Suspense>
          </FeatureFlagsProvider>
        </Shell>
      </section>
    </>
  );
}
