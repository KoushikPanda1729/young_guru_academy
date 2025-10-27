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
import type { TableQuery } from "@/lib/zod";
import type { CourseType } from "../helpers/course.schema";

interface UseCourseOptions {
  initialPageSize?: number;
  enabled?: boolean;
}

export function useCourse(options: UseCourseOptions = {}) {
  const { initialPageSize = 20, enabled = true } = options;
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [error, setError] = useState<string | null>(null);

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

  const coursesQuery: UseQueryResult<PaginatedTableData<CourseType>> = useQuery(
    {
      queryKey: ["courses", query],
      queryFn: async () => {
        try {
          const response = await api.courses.getCourses(query);
          return {
            data: response.data ?? [],
            total_filtered: response.meta?.pagination?.total ?? 0,
            limit: query.limit,
          };
        } catch (err) {
          setError((err as Error).message || "Failed to fetch courses");
          throw err;
        }
      },
      enabled,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );

  const invalidateCourses = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["courses"],
      refetchType: "active",
    });
  }, [queryClient]);

  const { mutateAsync: deleteCourseById } = useMutation({
    mutationFn: api.courses.deleteCourseById,
    onSuccess: invalidateCourses,
    onError: (err) => {
      setError((err as Error).message || "Failed to delete course");
    },
  });

  const { mutateAsync: publishCourseById } = useMutation({
    mutationFn: api.courses.publishCourseById,
    onSuccess: invalidateCourses,
    onError: (err) => {
      setError((err as Error).message || "Failed to publish course");
    },
  });

  const { mutateAsync: unPublishCourseById } = useMutation({
    mutationFn: api.courses.unPublishCourseById,
    onSuccess: invalidateCourses,
    onError: (err) => {
      setError((err as Error).message || "Failed to unpublish course");
    },
  });

  const { mutateAsync: popularCourseById } = useMutation({
    mutationFn: api.courses.popularCourseById,
    onSuccess: invalidateCourses,
    onError: (err) =>
      setError((err as Error).message || "Failed to mark course as popular"),
  });

  const { mutateAsync: unPopularCourseById } = useMutation({
    mutationFn: api.courses.unPopularCourseById,
    onSuccess: invalidateCourses,
    onError: (err) =>
      setError((err as Error).message || "Failed to unmark course as popular"),
  });

  const handleDelete = useCallback(
    async (course: CourseType) => {
      try {
        await deleteCourseById({ id: course.id });
      } catch (err) {
        setError((err as Error).message || "Delete failed");
      }
    },
    [deleteCourseById]
  );

  const handlePublish = useCallback(
    async (course: CourseType) => {
      try {
        await publishCourseById({ id: course.id });
      } catch (err) {
        setError((err as Error).message || "Publish failed");
      }
    },
    [publishCourseById]
  );

  const handleUnpublish = useCallback(
    async (course: CourseType) => {
      try {
        await unPublishCourseById({ id: course.id });
      } catch (err) {
        setError((err as Error).message || "Unpublish failed");
      }
    },
    [unPublishCourseById]
  );

  const handlePopular = useCallback(
    async (course: CourseType) => {
      try {
        await popularCourseById({ id: course.id });
      } catch (err) {
        setError((err as Error).message || "Mark popular failed");
      }
    },
    [popularCourseById]
  );

  const handleUnpopular = useCallback(
    async (course: CourseType) => {
      try {
        await unPopularCourseById({ id: course.id });
      } catch (err) {
        setError((err as Error).message || "Unmark popular failed");
      }
    },
    [unPopularCourseById]
  );

  return {
    data: coursesQuery.data?.data ?? [],
    total: coursesQuery.data?.total_filtered ?? 0,
    isLoading: coursesQuery.isLoading,
    error,
    setError,
    query,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    refetch: coursesQuery.refetch,

    handleDelete,
    handlePublish,
    handleUnpublish,
    handlePopular,
    handleUnpopular,
  };
}
