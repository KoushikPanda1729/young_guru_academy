"use client";

import * as React from "react";
import { DataTable } from "@t2p-admin/ui/components/data-table/data-table";
import { DataTableToolbar } from "@t2p-admin/ui/components/data-table/data-table-toolbar";
import { useDataTable } from "../../../hooks/use-data-table";
import { DataTableSortList } from "../../../components/data-table-sort-list";
import { getNotificationColumns } from "../../../components/data-table/columns/notification-columns";
import { useNotification } from "../hooks/useNotification";
import { useNotificationSheet } from "../hooks/useNotificationSheet";
import {
  PushNotificationType,
  ScheduleNotificationFormType,
} from "../notification.schema";
import { NotificationSheet } from "./notification-sheet";
import { NotificationsTableActionBar } from "./notication-table-action-bar";

export interface QueryKeys {
  page: string;
  perPage: string;
  sort: string;
  filters: string;
  joinOperator: string;
}

export function NotificationTable() {
  const {
    data,
    refetchSegments,
    handleDelete,
    handleCancel,
    segments,
    isSegmentsLoading,
    segmentsError,
  } = useNotification({ initialPageSize: 10, enabled: true });
  const [isMounted, setIsMounted] = React.useState(false);
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

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleViewEdit = React.useCallback(
    (n: PushNotificationType) => openSheet("view", n),
    [openSheet]
  );

  const columns = React.useMemo(
    () =>
      getNotificationColumns({
        handleDelete,
        handleCancel,
        handleViewEdit,
      }),
    [handleCancel, handleDelete, handleViewEdit]
  );

  const handleSheetSave = async (data: ScheduleNotificationFormType) => {
    await handleSave(data);
  };

  const { table } = useDataTable({
    data: data?.data ?? [],
    columns,
    initialState: {
      columnPinning: { right: ["actions"] },
    },
    pageCount: data?.total_filtered ?? 1,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <DataTable
        table={table}
        actionBar={<NotificationsTableActionBar table={table} />}
      >
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} align="end" />
        </DataTableToolbar>
      </DataTable>
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
