"use client";

import { useState, useCallback, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import type {
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import type {
  QuestType,
  QuestQueryType,
  QuestStatsSchema,
} from "@/features/quest/quest.schema";
import type { ApiSuccessType, TableQuery } from "@/lib/zod";
import type { PaginatedTableData } from "@/components/table/tanstack-table";
import { api } from "@/lib/api";

interface UseQuestOptions {
  initialPageSize?: number;
  enabled?: boolean;
}

export function useQuest(options: UseQuestOptions = {}) {
  const { initialPageSize = 10, enabled = true } = options;
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<{ pageIndex: number; pageSize: number }>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [query, setQuery] = useState({
    limit: 10,
    offset: 0,
    sortBy: "createdAt" as string,
    sortDirection: "desc" as "asc" | "desc",
    filterField: undefined as string | undefined,
    filterOperator: undefined as
      | "contains" | "lt" | "eq" | "ne" | "lte" | "gt" | "gte"
      | undefined,
    filterValue: undefined as string | number | boolean | undefined,
  });

  const updateQuery = useCallback((updates: Partial<TableQuery>) => {
    setQuery((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    updateQuery({
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
    });
  }, [pagination, updateQuery]);

  useEffect(() => {
    if (sorting.length > 0) {
      const sort = sorting[0]!;
      updateQuery({
        sortBy: sort.id as QuestQueryType["sortBy"],
        sortDirection: sort.desc ? "desc" : "asc",
        offset: 0,
      });
    } else {
      updateQuery({
        sortBy: "createdAt",
        sortDirection: "desc",
      });
    }
  }, [sorting, updateQuery]);

  useEffect(() => {
    if (columnFilters.length > 0 && columnFilters[0]) {
      const { id, value } = columnFilters[0];
      if (
        id &&
        (typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean")
      ) {
        updateQuery({
          filterField: id,
          filterValue: value,
          filterOperator: "contains",
          offset: 0,
        });
      }
    } else {
      updateQuery({
        filterField: undefined,
        filterValue: undefined,
        filterOperator: undefined,
      });
    }
  }, [columnFilters, updateQuery]);

  const questsQuery: UseQueryResult<PaginatedTableData<QuestType>> = useQuery({
    queryKey: ["quests", query],
    queryFn: async () => {
      const response = await api.quest.getQuests(query);
      const items = response.data ?? [];
      const totalCount = response.meta.pagination.total || 0;

      return {
        data: items,
        total_filtered: totalCount,
        limit: query.limit,
      };
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const statsQuery: UseQueryResult<ApiSuccessType<typeof QuestStatsSchema>> = useQuery({
    queryKey: ["questStats"],
    queryFn: () => api.quest.getQuestStats(),
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["quests"] });
    queryClient.invalidateQueries({ queryKey: ["questStats"] });
  }, [queryClient]);

  const { mutateAsync: deleteQuest } = useMutation({
    mutationFn: api.quest.deleteQuestById,
    onSuccess: invalidateAll,
  });

  const { mutateAsync: archiveQuest } = useMutation({
    mutationFn: api.quest.archiveQuestById,
    onSuccess: invalidateAll,
  });

  const { mutateAsync: unarchiveQuest } = useMutation({
    mutationFn: api.quest.unarchiveQuestById,
    onSuccess: invalidateAll,
  });

  const { mutateAsync: bulkDeleteQuests } = useMutation({
    mutationFn: api.quest.deleteQuests,
    onSuccess: invalidateAll,
  });

  const { mutateAsync: bulkArchiveQuests } = useMutation({
    mutationFn: api.quest.archiveQuests,
    onSuccess: invalidateAll,
  });

  const { mutateAsync: bulkUnarchiveQuests } = useMutation({
    mutationFn: api.quest.unarchiveQuests,
    onSuccess: invalidateAll,
  });

  const handleDelete = useCallback(
    async (quest: QuestType): Promise<void> => {
      await deleteQuest({ id: quest.id });
    },
    [deleteQuest]
  );

  const handleArchive = useCallback(
    async (quest: QuestType): Promise<void> => {
      await archiveQuest({ id: quest.id });
    },
    [archiveQuest]
  );

  const handleUnarchive = useCallback(
    async (quest: QuestType): Promise<void> => {
      await unarchiveQuest({ id: quest.id });
    },
    [unarchiveQuest]
  );

  const handleBulkDelete = useCallback(
    async (ids: string[]): Promise<void> => {
      await bulkDeleteQuests({ ids });
    },
    [bulkDeleteQuests]
  );

  const handleBulkArchive = useCallback(
    async (ids: string[]): Promise<void> => {
      await bulkArchiveQuests({ ids });
    },
    [bulkArchiveQuests]
  );

  const handleBulkUnarchive = useCallback(
    async (ids: string[]): Promise<void> => {
      await bulkUnarchiveQuests({ ids });
    },
    [bulkUnarchiveQuests]
  );

  return {
    data: questsQuery.data ?? null,
    stats: statsQuery.data?.data ?? null,

    isLoading: questsQuery.isLoading,
    isStatsLoading: statsQuery.isLoading,
    error: questsQuery.error?.message ?? null,
    statsError: statsQuery.error?.message ?? null,

    query,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,

    refetch: questsQuery.refetch,
    refetchStats: statsQuery.refetch,

    handleDelete,
    handleArchive,
    handleUnarchive,
    handleBulkDelete,
    handleBulkArchive,
    handleBulkUnarchive,
  };
}
