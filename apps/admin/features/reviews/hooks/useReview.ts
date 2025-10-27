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
import type { StudentFeedbackItem } from "@/features/reviews/helpers/reviews.schema";
import type { TableQuery } from "@/lib/zod";
import type { PaginatedTableData } from "@/components/table/tanstack-table";
import { api } from "@/lib/api";

interface UseReviewOptions {
  initialPageSize?: number;
  enabled?: boolean;
}

export function useReview(options: UseReviewOptions = {}) {
  const { initialPageSize = 10, enabled = true } = options;
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<{ pageIndex: number; pageSize: number }>({
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
      const sort = sorting[0];
      updateQuery({
        sortBy: sort.id as string,
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
      if (id && (typeof value === "string" || typeof value === "number" || typeof value === "boolean")) {
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

  const reviewsQuery: UseQueryResult<PaginatedTableData<StudentFeedbackItem>> = useQuery({
    queryKey: ["reviews", query],
    queryFn: async () => {
      const response = await api.review.getReviews(query);
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

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
  }, [queryClient]);

  const { mutateAsync: deleteReview } = useMutation({
    mutationFn: api.review.deleteReviewById,
    onSuccess: invalidateAll,
  });

  const handleDelete = useCallback(
    async (review: StudentFeedbackItem): Promise<void> => {
      await deleteReview({ id: review.id });
    },
    [deleteReview]
  );

  return {
    data: reviewsQuery.data ?? null,
    isLoading: reviewsQuery.isLoading,
    error: reviewsQuery.error?.message ?? null,

    query,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,

    refetch: reviewsQuery.refetch,
    handleDelete,
  };
}
