"use client";

import { useUser } from "../hooks/useUser";
import { IconShield, IconUserCancel, IconUsers } from "@tabler/icons-react";
import { Header } from "../../../components/dashboard/page-header";
import { Shell } from "@t2p-admin/ui/components/extra/shell";
import { DataTableSkeleton } from "@t2p-admin/ui/components/data-table/data-table-skeleton";
import React from "react";
import { FeatureFlagsProvider } from "../../../components/feature-flag-provider";
import { StatsCard } from "../../../components/stats-card";
import { UserTable } from "./user-table";

export default function UserPage() {
  const { isLoading, refetch, stats } = useUser();

  const statItems = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: <IconUsers className="text-muted-foreground" />,
      dotColor: "bg-blue-500",
    },
    {
      label: "Banned Users",
      value: stats?.totalBanned ?? 0,
      icon: <IconUserCancel className="text-muted-foreground" />,
      dotColor: "bg-red-500",
    },
    {
      label: "Admins",
      value: stats?.totalAdmins ?? 0,
      icon: <IconShield className="text-muted-foreground" />,
      dotColor: "bg-green-500",
    },
  ];

  return (
    <>
      <section className="pb-4">
        <Header
          icon={<IconUsers className="text-primary h-6 w-6" />}
          title="User Management"
          description="Manage your users"
          onRefresh={refetch}
          refreshing={isLoading}
        />
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pb-6">
        {stats
          ? statItems.map((item) => (
              <StatsCard
                key={item.label}
                icon={item.icon}
                dotColor={item.dotColor}
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
        <Shell className="gap-2" variant={"sidebar"}>
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
              <UserTable />
            </React.Suspense>
          </FeatureFlagsProvider>
        </Shell>
      </section>
    </>
  );
}
