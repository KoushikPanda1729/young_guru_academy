"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

import { api } from "@/lib/api";
import type {
  TestHistoryType,
  TestStatsSchema,
} from "@/features/test/test.schema";
import type { PaginatedTableData } from "@/components/table/tanstack-table";
import { ApiSuccessType, TableQuery } from "@/lib/zod";

interface UseTestOptions {
  initialPageSize?: number;
  enabled?: boolean;
}

export function useTest(options: UseTestOptions = {}) {
  const { initialPageSize = 10, enabled = true } = options;
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [query, setQuery] = useState<TableQuery>({
    limit: initialPageSize,
    offset: 0,
    sortBy: "createdAt",
    sortDirection: "desc",
    filterField: undefined,
    filterOperator: undefined,
    filterValue: undefined,
  });

  const updateQuery = useCallback((updates: Partial<TableQuery>) => {
    setQuery((prev) => ({
      ...prev,
      ...updates,
    }));
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
        sortBy: sort.id,
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

  const {
    data: queryData,
    isLoading,
    error: queryError,
    refetch,
    isFetching: fetchStatus,
  } = useQuery<PaginatedTableData<TestHistoryType>>({
    queryKey: ["query", query],
    queryFn: async () => {
      try {
        const response = await api.test.getTests(query);
        const items = response.data ?? [];
        const totalCount = response.meta.pagination.total || 0;

        const result = {
          data: items,
          total_filtered: totalCount,
          limit: query.limit,
        };

        return result;
      } catch (error) {
        console.error("Error in queryFn:", error);
        throw error;
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<ApiSuccessType<typeof TestStatsSchema>>({
    queryKey: ["test-stats"],
    queryFn: () => api.test.getTestStats(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: api.test.deleteTestById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["testStats"] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: api.test.archiveTestById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["testStats"] });
    },
  });

  const unarchiveMutation = useMutation({
    mutationFn: api.test.unarchiveTestById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["testStats"] });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: api.test.deleteTests,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["testStats"] });
    },
  });

  const bulkArchiveMutation = useMutation({
    mutationFn: api.test.archiveTests,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["testStats"] });
    },
  });

  const bulkUnarchiveMutation = useMutation({
    mutationFn: api.test.unarchiveTests,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["testStats"] });
    },
  });

  const resetPagination = useCallback(() => {
    setPagination((prev) =>
      prev.pageIndex === 0 ? prev : { pageIndex: 0, pageSize: prev.pageSize }
    );
  }, []);

  const setSortingWithReset = useCallback(
    (val: React.SetStateAction<SortingState>) => {
      setSorting(val);
      resetPagination();
    },
    [resetPagination]
  );

  const setColumnFiltersWithReset = useCallback(
    (val: React.SetStateAction<ColumnFiltersState>) => {
      setColumnFilters(val);
      resetPagination();
    },
    [resetPagination]
  );

  const { mutateAsync: deleteTest } = deleteMutation;
  const { mutateAsync: archiveTest } = archiveMutation;
  const { mutateAsync: unarchiveTest } = unarchiveMutation;
  const { mutateAsync: bulkDeleteTests } = bulkDeleteMutation;
  const { mutateAsync: bulkArchiveTests } = bulkArchiveMutation;
  const { mutateAsync: bulkUnarchiveTests } = bulkUnarchiveMutation;

  const handleDelete = useCallback(
    async (test: { id: string }) => {
      await deleteTest({ id: test.id });
    },
    [deleteTest]
  );

  const handleArchive = useCallback(
    async (test: { id: string }) => {
      await archiveTest({ id: test.id });
    },
    [archiveTest]
  );

  const handleUnarchive = useCallback(
    async (test: { id: string }) => {
      await unarchiveTest({ id: test.id });
    },
    [unarchiveTest]
  );

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      await bulkDeleteTests({ ids });
    },
    [bulkDeleteTests]
  );

  const handleBulkArchive = useCallback(
    async (ids: string[]) => {
      await bulkArchiveTests({ ids });
    },
    [bulkArchiveTests]
  );

  const handleBulkUnarchive = useCallback(
    async (ids: string[]) => {
      await bulkUnarchiveTests({ ids });
    },
    [bulkUnarchiveTests]
  );

  return {
    data: queryData || null,
    stats: stats?.data || null,
    isLoading,
    isStatsLoading,
    isFetching: fetchStatus,
    error: queryError?.message || null,
    statsError: statsError?.message || null,

    sorting,
    setSorting: setSortingWithReset,
    columnFilters,
    setColumnFilters: setColumnFiltersWithReset,
    pagination,
    setPagination,

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
