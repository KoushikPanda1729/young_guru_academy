"use client";
import React from "react";
import { Header } from "../../../components/dashboard/page-header";
import { IconCircleDashedPlus } from "@tabler/icons-react";
import { useTransaction } from "../../transaction/hooks/useTransaction";
import { Shell } from "@t2p-admin/ui/components/extra/shell";
import { DataTableSkeleton } from "@t2p-admin/ui/components/data-table/data-table-skeleton";
import { FeatureFlagsProvider } from "../../../components/feature-flag-provider";
import { TransactionsTable } from "../../transaction/components/transaction-table";
import { Button } from "@t2p-admin/ui/components/button";
import { Circle } from "lucide-react";
import { StatsCard } from "../../../components/stats-card";

export default function AnalyticsClient() {
  const { isLoading, refetch, stats } = useTransaction();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const enhancedStats = [
    {
      label: "Total Transactions",
      value: stats?.totalTransactions ?? 0,
      icon: <Circle className="size-4 text-muted-foreground" />,
      isLoading: isLoading,
    },
    {
      label: "Total Revenue",
      value: stats?.totalAmount?.toLocaleString() ?? 0,
      icon: <Circle className="size-4 text-green-500" />,
      isLoading: isLoading,
    },
    {
      label: "Average Order Value",
      value: stats?.averageOrderValue?.toLocaleString() ?? 0,
      icon: <Circle className="size-4 text-blue-500" />,
      isLoading: isLoading,
    },
    {
      label: "Lifetime Revenue",
      value: stats?.lifetimeRevenue?.toLocaleString() ?? 0,
      icon: <Circle className="size-4 text-yellow-500" />,
      isLoading: isLoading,
    },
    {
      label: "Transactions Count",
      value: stats?.count ?? 0,
      icon: <Circle className="size-4 text-purple-500" />,
      isLoading: isLoading,
    },
  ];

  return (
    <>
      <section className="pb-4">
        <Header
          icon={<IconCircleDashedPlus className="text-primary h-6 w-6" />}
          title="Analytics"
          description="View history of transactions and generate reports"
          onRefresh={refetch}
          refreshing={isLoading}
          actions={
            <Button onClick={() => setIsSheetOpen(true)} size={"sm"}>
              Generate Report
            </Button>
          }
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
              <TransactionsTable />
            </React.Suspense>
          </FeatureFlagsProvider>
        </Shell>
      </section>
    </>
  );
}
