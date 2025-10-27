"use client";

import React, { useEffect, useState, useCallback } from "react";
import { addDays } from "date-fns";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards";
import { DateFilterBar, DateRange } from "@/components/dashboard/date-filter-bar";
import { IconDashboard } from "@tabler/icons-react";
import { Header } from "@/components/dashboard/page-header";
import { api } from "@/lib/api"
import { overviewQueryType, OverviewResponse } from "@/features/overview/overview.schema";

export default function OverviewPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    preset: "30d",
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const [data, setData] = useState<OverviewResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const fetchOverview = useCallback(async (query: overviewQueryType) => {
    try {
      setStatus("loading");
      const response = await api.overview.getOverview(query);
      setData(response.data);
      setStatus("success");
    } catch (error) {
      console.error("Failed to fetch overview:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
  fetchOverview({
    range: dateRange.preset,
    from: dateRange.from ? dateRange.from.toISOString() : undefined,
    to: dateRange.to ? dateRange.to.toISOString() : undefined,
  });
}, [dateRange, fetchOverview]);

const handleRefresh = () => {
  fetchOverview({
    range: dateRange.preset,
    from: dateRange.from ? dateRange.from.toISOString() : undefined,
    to: dateRange.to ? dateRange.to.toISOString() : undefined,
  });
};


  const isLoading = status === "loading";

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <Header
          icon={<IconDashboard className="size-6 text-primary" />}
          title="Overview"
          description="Analyze activity, trends, and key performance indicators"
          onRefresh={handleRefresh}
          refreshing={isLoading}
        />

        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <DateFilterBar value={dateRange} onChange={setDateRange} />
          </div>

          {status === "error" && (
            <div className="text-center text-red-500 font-semibold px-4">
              Failed to load overview data.
            </div>
          )}

          {status === "success" && data && (
            <>
              <SectionCards dateRange={dateRange} data={data} status={status} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive dateRange={dateRange} data={data} status={status} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
