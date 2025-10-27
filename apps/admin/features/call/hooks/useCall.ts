"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  callSearchParams,
  callSearchParamsSchema,
  type callStatsSchema,
} from "@/features/call/helpers/call.schema";
import type { ApiSuccessType } from "@/lib/zod";
import { useQueryStates } from "nuqs";

interface UseCallOptions {
  initialPageSize?: number;
  enabled?: boolean;
}

export function useCall(options: UseCallOptions = {}) {
  const { enabled = true } = options;
  const queryClient = useQueryClient();
  const [searchState] = useQueryStates(callSearchParams, {
    history: "push",
    shallow: true,
  });

  const query = callSearchParamsSchema.parse(searchState);

  // 🔹 Queries
  const {
    data: callData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["calls", query],
    queryFn: async () => await api.call.getCalls(query),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<ApiSuccessType<typeof callStatsSchema>>({
    queryKey: ["call-stats"],
    queryFn: () => api.call.getCallStats(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { mutateAsync: deleteCall } = useMutation({
    mutationFn: api.call.deleteCallById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      queryClient.invalidateQueries({ queryKey: ["call-stats"] });
    },
  });

  const { mutateAsync: archiveCall } = useMutation({
    mutationFn: api.call.archiveCallById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      queryClient.invalidateQueries({ queryKey: ["call-stats"] });
    },
  });

  const { mutateAsync: unarchiveCall } = useMutation({
    mutationFn: api.call.unarchiveCallById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      queryClient.invalidateQueries({ queryKey: ["call-stats"] });
    },
  });

  const { mutateAsync: bulkDeleteCalls } = useMutation({
    mutationFn: api.call.deleteCalls,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      queryClient.invalidateQueries({ queryKey: ["call-stats"] });
    },
  });

  const { mutateAsync: bulkArchiveCalls } = useMutation({
    mutationFn: api.call.archiveCalls,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      queryClient.invalidateQueries({ queryKey: ["call-stats"] });
    },
  });

  const { mutateAsync: bulkUnarchiveCalls } = useMutation({
    mutationFn: api.call.unarchiveCalls,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      queryClient.invalidateQueries({ queryKey: ["call-stats"] });
    },
  });

  const handleDelete = useCallback(
    async (call: { id: string }) => {
      await deleteCall({ id: call.id });
    },
    [deleteCall]
  );

  const handleArchive = useCallback(
    async (call: { id: string }) => {
      await archiveCall({ id: call.id });
    },
    [archiveCall]
  );

  const handleUnarchive = useCallback(
    async (call: { id: string }) => {
      await unarchiveCall({ id: call.id });
    },
    [unarchiveCall]
  );

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      await bulkDeleteCalls({ ids });
    },
    [bulkDeleteCalls]
  );

  const handleBulkArchive = useCallback(
    async (ids: string[]) => {
      await bulkArchiveCalls({ ids });
    },
    [bulkArchiveCalls]
  );

  const handleBulkUnarchive = useCallback(
    async (ids: string[]) => {
      await bulkUnarchiveCalls({ ids });
    },
    [bulkUnarchiveCalls]
  );

  return {
    data: callData || null,
    stats: stats?.data || null,

    isLoading,
    isStatsLoading,
    isFetching,
    error: error?.message || null,
    statsError: statsError?.message || null,

    query,

    refetch,
    refetchStats,

    handleDelete,
    handleArchive,
    handleUnarchive,
    handleBulkDelete,
    handleBulkArchive,
    handleBulkUnarchive,
  };
}
