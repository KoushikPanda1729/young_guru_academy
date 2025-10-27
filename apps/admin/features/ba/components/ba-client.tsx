"use client";
import React from "react";
import { Header } from "../../../components/dashboard/page-header";
import { IconCircleDashedPlus } from "@tabler/icons-react";
import { useTransaction } from "../../transaction/hooks/useTransaction";
import { Shell } from "@t2p-admin/ui/components/extra/shell";
import { DataTableSkeleton } from "@t2p-admin/ui/components/data-table/data-table-skeleton";
import { FeatureFlagsProvider } from "../../../components/feature-flag-provider";
import { TransactionsTable } from "../../transaction/components/transaction-table";
import { BackendAdditionSheet } from "./add-student-sheet";
import { BackendAdditionInput } from "../helpers/ba-schema";
import { useBa } from "../hooks/useBa";
import { Button } from "@t2p-admin/ui/components/button";

export default function BaClient() {
  const { isLoading, refetch } = useTransaction();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const { addAccess } = useBa();

  const handleCreateBackendAddition = async (data: BackendAdditionInput) => {
    try {
      setIsCreating(true);
      addAccess(data);
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Failed to create backend addition:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <section className="pb-4">
        <Header
          icon={<IconCircleDashedPlus className="text-primary h-6 w-6" />}
          title="Backend Addition"
          description="Give and manage access to users course"
          onRefresh={refetch}
          refreshing={isLoading}
          actions={
            <Button onClick={() => setIsSheetOpen(true)} size={"sm"}>
              Add Student
            </Button>
          }
        />
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
              <TransactionsTable />
            </React.Suspense>
          </FeatureFlagsProvider>
        </Shell>
        <BackendAdditionSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          onCreate={handleCreateBackendAddition}
          isLoading={isCreating}
          availableCourses={[]}
        />
      </section>
    </>
  );
}
