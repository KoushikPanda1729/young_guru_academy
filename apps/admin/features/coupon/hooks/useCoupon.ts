"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import type { TableQuery } from "@/lib/zod";
import type { PaginatedTableData } from "@/components/table/tanstack-table";
import { api } from "@/lib/api";
import { CreateCouponInput, CreateCouponOutput, UpdateCouponInput } from "../helpers/coupon.schema";

interface UseCouponOptions {
  initialPageSize?: number;
  enabled?: boolean;
}

export function useCoupon(options: UseCouponOptions = {}) {
  const { initialPageSize = 10, enabled = true } = options;
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: initialPageSize });

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
      const sort = sorting[0]!;
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

  // Fetch Coupons
  const couponsQuery: UseQueryResult<PaginatedTableData<CreateCouponOutput>> = useQuery({
    queryKey: ["coupons", query],
    queryFn: async () => {
      const response = await api.coupons.getCoupons(query);
      const items = response.data ?? [];
      const totalCount = response.meta?.pagination?.total || 0;

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
    queryClient.invalidateQueries({ queryKey: ["coupons"] });
  }, [queryClient]);

  const { mutateAsync: deleteCoupon } = useMutation({
    mutationFn: (id: string) => api.coupons.deleteCouponById({ id }),
    onSuccess: invalidateAll,
  });

  const { mutateAsync: createCoupon } = useMutation({
    mutationFn: (data: CreateCouponInput) => api.coupons.createCoupon(data),
    onSuccess: invalidateAll,
  });

  const { mutateAsync: updateCoupon } = useMutation({
  mutationFn: ({ id, data }: { id: string; data: UpdateCouponInput }) =>
    api.coupons.updateCouponById({ id }, data),
  onSuccess: invalidateAll,
});

  const handleDelete = useCallback(async (id: string) => {
    await deleteCoupon(id);
  }, [deleteCoupon]);

  const handleCreate = useCallback(async (data: CreateCouponInput) => {
    await createCoupon(data);
  }, [createCoupon]);

  const handleUpdate = useCallback(async (id: string, data: UpdateCouponInput) => {
  await updateCoupon({ id, data });
}, [updateCoupon]);

  return {
    data: couponsQuery.data ?? null,
    isLoading: couponsQuery.isLoading,
    error: couponsQuery.error?.message ?? null,

    query,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,

    refetch: couponsQuery.refetch,

    handleDelete,
    handleCreate,
    handleUpdate,
  };
}
