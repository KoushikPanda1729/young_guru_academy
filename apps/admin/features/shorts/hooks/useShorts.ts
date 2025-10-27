import { useState, useCallback, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import type { PaginatedTableData } from "@/components/table/tanstack-table";
import { api } from "@/lib/api";
import type { PageQueryType, TableQuery } from "@/lib/zod";
import type {
  ShortsOutput,
  VideoOutput,
  DeleteShortsOutput,
  CreateShortsInput,
  ReorderShortsInput,
} from "../helpers/shorts.schema";

interface UseShortsOptions {
  initialPageSize?: number;
  enabled?: boolean;
}

export function useShorts(options: UseShortsOptions = {}) {
  const { initialPageSize = 20, enabled = true } = options;
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState<PageQueryType>({
    limit: initialPageSize,
    page: 0,
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
        sortBy: sort.id,
        sortDirection: sort.desc ? "desc" : "asc",
        offset: 0,
      });
    } else {
      updateQuery({ sortBy: "createdAt", sortDirection: "desc" });
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

  const shortsQuery: UseQueryResult<PaginatedTableData<ShortsOutput>> =
    useQuery({
      queryKey: ["shorts", query],
      queryFn: async () => {
        try {
          const response = await api.shorts.getShorts(query);
          return {
            data: response.data ?? [],
            total_filtered: response.meta?.pagination?.total ?? 0,
            limit: query.limit,
          };
        } catch (err) {
          setError((err as Error).message || "Failed to fetch shorts");
          throw err;
        }
      },
      enabled,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  const invalidateShorts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["shorts"] });
  }, [queryClient]);

  const { mutateAsync: createShort } = useMutation<
    VideoOutput,
    Error,
    CreateShortsInput
  >({
    mutationFn: async (body) => {
      const response = await api.shorts.createShort(body);
      if (!response.data) throw new Error("No video data returned");
      return response.data;
    },
    onSuccess: invalidateShorts,
    onError: (err) => {
      setError(err.message || "Failed to create short");
    },
  });

  const { mutateAsync: deleteShortById } = useMutation<
    DeleteShortsOutput,
    Error,
    { id: string }
  >({
    mutationFn: async ({ id }) => {
      const response = await api.shorts.deleteShortById({ id });
      if (!response.data) throw new Error("Delete failed");
      return response.data;
    },
    onSuccess: invalidateShorts,
    onError: (err) => {
      setError(err.message || "Failed to delete short");
    },
  });

  const { mutateAsync: updateShortById } = useMutation<
    DeleteShortsOutput,
    Error,
    { id: string; body: CreateShortsInput }
  >({
    mutationFn: async ({ id, body }) => {
      const response = await api.shorts.updateShortById({ id }, body);
      if (!response.data) throw new Error("Update failed");
      return response.data;
    },
    onSuccess: invalidateShorts,
    onError: (err) => {
      setError(err.message || "Failed to update short");
    },
  });

  const { mutateAsync: reorderShorts } = useMutation<
    number,
    Error,
    { body: ReorderShortsInput }
  >({
    mutationFn: async ({ body }) => {
      const response = await api.shorts.reorderShorts(body);
      console.log("Reorder response:", response.data);
      if (response.data === undefined || response.data === null) {
        console.error("Reorder response is empty");
        throw new Error("Reorder failed");
      }
      return response.data;
    },
    onSuccess: invalidateShorts,
    onError: (err) => {
      setError(err.message || "Failed to reorder shorts");
    },
  });

  // --- handlers ---

  const handleReorder = useCallback(
    async (reorderedShorts: ShortsOutput[]) => {
      try {
        const body: ReorderShortsInput = {
          shortOrders: reorderedShorts.map((short) => ({
            id: short.videoId,
            order: short.order,
          })),
        };
        await reorderShorts({ body });
      } catch (err) {
        setError((err as Error).message || "Reorder failed");
      }
    },
    [reorderShorts]
  );

  const handleDelete = useCallback(
    async (short: ShortsOutput) => {
      try {
        await deleteShortById({ id: short.videoId });
      } catch (err) {
        setError((err as Error).message || "Delete failed");
      }
    },
    [deleteShortById]
  );

  const handleUpdate = useCallback(
    async (short: ShortsOutput, body: CreateShortsInput) => {
      try {
        await updateShortById({ id: short.videoId, body });
      } catch (err) {
        setError((err as Error).message || "Update failed");
      }
    },
    [updateShortById]
  );

  const handleCreate = useCallback(
    async (body: CreateShortsInput) => {
      try {
        await createShort(body);
      } catch (err) {
        setError((err as Error).message || "Create failed");
      }
    },
    [createShort]
  );

  return {
    data: shortsQuery.data?.data ?? [],
    total: shortsQuery.data?.total_filtered ?? 0,
    isLoading: shortsQuery.isLoading,
    error,
    setError,
    query,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    refetch: shortsQuery.refetch,

    handleDelete,
    handleUpdate,
    handleCreate,
    handleReorder,
  };
}
