"use client";

import { IconBell, IconPlus } from "@tabler/icons-react";
import { Circle } from "lucide-react";
import { useNotification } from "@/features/notification/hooks/useNotification";
import { useNotificationSheet } from "@/features/notification/hooks/useNotificationSheet";
import { Header } from "../../../components/dashboard/page-header";
import { StatsCard } from "../../../components/stats-card";
import { Button } from "@t2p-admin/ui/components/button";
import { Shell } from "@t2p-admin/ui/components/extra/shell";
import React from "react";
import { DataTableSkeleton } from "@t2p-admin/ui/components/data-table/data-table-skeleton";
import { NotificationTable } from "./notification-table";
import { NotificationSheet } from "./notification-sheet";
import { ScheduleNotificationFormType } from "../notification.schema";

export default function NotificationsClient() {
  const {
    stats,
    isLoading,
    isStatsLoading,
    refetch,
    refetchStats,
    segments,
    isSegmentsLoading,
    segmentsError,
    refetchSegments,
  } = useNotification({ initialPageSize: 10, enabled: true });

  const {
    isOpen,
    currentNotification,
    mode,
    isLoading: isSheetLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  } = useNotificationSheet();

  const enhancedStats = [
    {
      label: "Total Notifications",
      value: stats?.totalNotification ?? 0,
      icon: <Circle className="size-4 text-muted-foreground" />,
      isLoading: isStatsLoading,
    },
    {
      label: "Scheduled Notifications",
      value: stats?.totalNotificationScheduled ?? 0,
      icon: <Circle className="size-4 text-red-500" />,
      isLoading: isStatsLoading,
    },
    {
      label: "Sent Notifications",
      value: stats?.totalNotificationSent ?? 0,
      icon: <Circle className="size-4 text-green-500" />,
      isLoading: isStatsLoading,
    },
  ];

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchStats()]);
  };

  const handleSheetSave = async (data: ScheduleNotificationFormType) => {
    await handleSave(data);
  };

  return (
    <>
      <section className="pb-4">
        <Header
          icon={<IconBell className="size-6 text-primary" />}
          title="Notification Management"
          description="Manage and organize notifications"
          onRefresh={handleRefresh}
          refreshing={isLoading || isStatsLoading}
          actions={
            <Button
              size="sm"
              className="gap-2"
              onClick={() => openSheet("create")}
            >
              <IconPlus className="size-4" />
              Add Notification
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
      <section>
        <Shell className="gap-2">
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
            <NotificationTable />
          </React.Suspense>
        </Shell>
      </section>
      <NotificationSheet
        notification={currentNotification}
        isOpen={isOpen}
        onClose={closeSheet}
        mode={mode}
        onModeChange={setMode}
        onSave={handleSheetSave}
        isLoading={isSheetLoading}
        segments={segments!}
        isSegmentsLoading={isSegmentsLoading}
        segmentsError={segmentsError}
        refetchSegments={refetchSegments}
      />
    </>
  );
}
