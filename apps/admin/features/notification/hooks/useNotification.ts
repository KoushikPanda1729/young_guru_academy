"use client";
import { useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type notificationStatsSchema,
  type PushNotificationType,
  type ScheduleNotificationFormType,
  type CreateSegmentType,
  type DeleteSegmentType,
  type SegmentsResponseSchema,
  notificationSearchParams,
  notificationSearchQuery,
  NotificationQuery,
} from "@/features/notification/notification.schema";
import type { ApiSuccessType } from "@/lib/zod";
import type { PaginatedTableData } from "@/components/table/tanstack-table";
import { api } from "@/lib/api";
import { useQueryStates } from "nuqs";

interface UseNotificationOptions {
  initialPageSize?: number;
  enabled?: boolean;
}

export function useNotification(options: UseNotificationOptions = {}) {
  const [searchState] = useQueryStates(notificationSearchParams, {
    history: "push",
    shallow: true,
  });

  const search = notificationSearchQuery.parse(searchState);

  const query = useMemo(() => {
    return search;
  }, [search]);

  const queryClient = useQueryClient();

  const queryKey: [string, NotificationQuery] = ["notifications", query];

  const {
    data: queryData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<PaginatedTableData<PushNotificationType>>({
    queryKey,
    queryFn: async () => {
      const response = await api.notification.getNotifications(query);
      const items = response.data ?? [];
      const totalCount = response.meta.pagination.totalPages || 0;
      return {
        data: items,
        total_filtered: totalCount,
        limit: query.perPage,
      };
    },
    enabled: options.enabled || true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<ApiSuccessType<typeof notificationStatsSchema>>({
    queryKey: ["notificationStats"],
    queryFn: () => api.notification.getNotificationStats(),
    enabled: options.enabled || true,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const {
    data: segments,
    isLoading: isSegmentsLoading,
    error: segmentsError,
    refetch: refetchSegments,
  } = useQuery<ApiSuccessType<typeof SegmentsResponseSchema>>({
    queryKey: ["notificationSegments"],
    queryFn: () => api.notification.getSegments(),
    enabled: options.enabled || true,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (data: ScheduleNotificationFormType) =>
      api.notification.createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationStats"] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: api.notification.cancelNotificationById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationStats"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.notification.deleteNotificationById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationStats"] });
    },
  });

  const createSegmentMutation = useMutation({
    mutationFn: (data: CreateSegmentType) =>
      api.notification.createSegment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSegments"] });
    },
  });

  const deleteSegmentMutation = useMutation({
    mutationFn: (params: DeleteSegmentType) =>
      api.notification.deleteSegmentById(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSegments"] });
    },
  });

  const { mutateAsync: createNotification, isPending: isCreating } =
    createMutation;
  const { mutateAsync: cancelNotification, isPending: isCancelling } =
    cancelMutation;
  const { mutateAsync: deleteNotification, isPending: isDeleting } =
    deleteMutation;
  const { mutateAsync: createSegment, isPending: isCreatingSegment } =
    createSegmentMutation;
  const { mutateAsync: deleteSegment, isPending: isDeletingSegment } =
    deleteSegmentMutation;

  const handleCancel = useCallback(
    async (notification: PushNotificationType) => {
      await cancelNotification({ message_id: notification.id });
    },
    [cancelNotification]
  );

  const handleDelete = useCallback(
    async (notification: PushNotificationType) => {
      await deleteNotification({ message_id: notification.id });
    },
    [deleteNotification]
  );

  const handleCreateSegment = useCallback(
    async (data: CreateSegmentType) => {
      await createSegment(data);
    },
    [createSegment]
  );

  const handleDeleteSegment = useCallback(
    async (segmentId: string) => {
      await deleteSegment({ segment_id: segmentId });
    },
    [deleteSegment]
  );

  const handleCreateNotification = useCallback(
    async (data: ScheduleNotificationFormType) => {
      return await createNotification(data);
    },
    [createNotification]
  );

  return {
    data: queryData || null,
    stats: stats?.data || null,
    segments: segments?.data || null,

    isLoading,
    isStatsLoading,
    isSegmentsLoading,
    isCreating,
    isCancelling,
    isDeleting,
    isCreatingSegment,
    isDeletingSegment,

    error: queryError?.message || null,
    statsError: statsError?.message || null,
    segmentsError: segmentsError?.message || null,

    refetch,
    refetchStats,
    refetchSegments,

    handleCancel,
    handleDelete,
    handleCreateSegment,
    handleDeleteSegment,
    handleCreateNotification,

    mutations: {
      create: createMutation,
      cancel: cancelMutation,
      delete: deleteMutation,
      createSegment: createSegmentMutation,
      deleteSegment: deleteSegmentMutation,
    },
  };
}
