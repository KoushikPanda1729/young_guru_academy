"use client";

import { useState, useCallback } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";

import { PageQueryType } from "@/lib/zod";
import type { PaginatedTableData } from "@/components/table/tanstack-table";
import { api } from "@/lib/api";
import { CreatePollInput, PollResponse } from "../helpers/polls.schema";

interface UsePollsOptions {
  initialPageSize?: number;
  enabled?: boolean;
}

export function usePolls(options: UsePollsOptions = {}) {
  const queryClient = useQueryClient();

  const [query, setQuery] = useState<PageQueryType>({
    page: 1,
    limit: options.initialPageSize || 20,
  });

  const pollsQuery: UseQueryResult<PaginatedTableData<PollResponse>> = useQuery(
    {
      queryKey: ["polls", query],
      queryFn: async () => {
        const response = await api.poll.getPolls(query);
        const items = response.data ?? [];
        const totalCount = response.meta.pagination.total || 0;

        return {
          data: items,
          total_filtered: totalCount,
          limit: query.limit,
        };
      },
      enabled: options.enabled || true,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );

  // Invalidate cache
  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["polls"] });
  }, [queryClient]);

  // Mutations
  const { mutateAsync: deletePoll } = useMutation({
    mutationFn: api.poll.deletePollById,
    onSuccess: invalidateAll,
  });

  const { mutateAsync: createPoll } = useMutation({
    mutationFn: api.poll.createPoll,
    onSuccess: invalidateAll,
  });

  const { mutateAsync: updatePoll } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreatePollInput }) =>
      api.poll.updatePollById({ id }, data),
    onSuccess: invalidateAll,
  });

  const { mutateAsync: openPoll } = useMutation({
    mutationFn: (id: string) => api.poll.openPollById({ id }),
    onSuccess: invalidateAll,
  });

  const { mutateAsync: closePoll } = useMutation({
    mutationFn: (id: string) => api.poll.closePollById({ id }),
    onSuccess: invalidateAll,
  });

  const handleOpen = useCallback(
    async (poll: PollResponse) => {
      await openPoll(poll.id);
    },
    [openPoll]
  );

  const handleClose = useCallback(
    async (poll: PollResponse) => {
      await closePoll(poll.id);
    },
    [closePoll]
  );

  const handleCreate = useCallback(
    async (data: CreatePollInput): Promise<void> => {
      await createPoll(data);
    },
    [createPoll]
  );

  const handleUpdate = useCallback(
    async (id: string, data: CreatePollInput): Promise<void> => {
      await updatePoll({ id, data });
    },
    [updatePoll]
  );

  // Handlers
  const handleDelete = useCallback(
    async (poll: PollResponse): Promise<void> => {
      await deletePoll({ id: poll.id });
    },
    [deletePoll]
  );

  return {
    data: pollsQuery.data ?? null,
    isLoading: pollsQuery.isLoading,
    error: pollsQuery.error?.message ?? null,

    query,
    refetch: pollsQuery.refetch,
    handleDelete,
    handleCreate,
    handleUpdate,
    handleOpen,
    handleClose,
    setQuery,
  };
}
