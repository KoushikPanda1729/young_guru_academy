"use client"

import { useState, useCallback, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table"

import type { PaginatedTableData } from "@/components/table/tanstack-table"
import type { QuestionType, questionStatsSchema } from "@/features/question/question.schema"
import { api } from "@/lib/api"
import type { ApiSuccessType, TableQuery } from "@/lib/zod"
import type { signedKeyParamsType } from "@/features/quest/quest.schema"

interface UseQuestionsOptions {
  initialPageSize?: number
  enabled?: boolean
}

export function useQuestions(options: UseQuestionsOptions = {}) {
  const { initialPageSize = 10, enabled = true } = options
  const queryClient = useQueryClient()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  // 🔹 Centralized TableQuery state
  const [query, setQuery] = useState<TableQuery>({
    limit: initialPageSize,
    offset: 0,
    sortBy: "createdAt",
    sortDirection: "desc",
    filterField: undefined,
    filterOperator: undefined,
    filterValue: undefined,
  })

  // 🔹 Helper to update query
  const updateQuery = useCallback((updates: Partial<TableQuery>) => {
    setQuery((prev) => ({
      ...prev,
      ...updates,
    }))
  }, [])

  useEffect(() => {
    updateQuery({
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
    })
  }, [pagination, updateQuery])

  // 🔹 Sync sorting
  useEffect(() => {
    if (sorting.length > 0) {
      const sort = sorting[0]!
      updateQuery({
        sortBy: sort.id,
        sortDirection: sort.desc ? "desc" : "asc",
        offset: 0,
      })
    } else {
      updateQuery({
        sortBy: "createdAt",
        sortDirection: "desc",
      })
    }
  }, [sorting, updateQuery])

  useEffect(() => {
    if (columnFilters.length > 0 && columnFilters[0]) {
      const { id, value } = columnFilters[0]
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
        })
      }
    } else {
      updateQuery({
        filterField: undefined,
        filterValue: undefined,
        filterOperator: undefined,
      })
    }
  }, [columnFilters, updateQuery])

  // 🔹 Fetch questions
  const {
    data: questionData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<PaginatedTableData<QuestionType>>({
    queryKey: ["questions", query],
    queryFn: async () => {
      const response = await api.question.getQuestions(query)
      const items = response.data ?? []
      const totalCount = response.meta.pagination.total || 0
      return {
        data: items,
        total_filtered: totalCount,
        limit: query.limit,
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // 🔹 Fetch stats
  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<ApiSuccessType<typeof questionStatsSchema>>({
    queryKey: ["question-stats"],
    queryFn: () => api.question.getQuestionStats(),
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })

  // 🔹 Mutations
  const { mutateAsync: uploadExcel } = useMutation({
    mutationFn: (data: signedKeyParamsType) => api.question.uploadExcel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["question-stats"] })
    },
  })

  const { mutateAsync: deleteQuestion } = useMutation({
    mutationFn: ({ id }: { id: string }) => api.question.deleteQuestionById({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["question-stats"] })
    },
  })

  const { mutateAsync: archiveQuestion } = useMutation({
    mutationFn: ({ id }: { id: string }) => api.question.archiveQuestionById({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["question-stats"] })
    },
  })

  const { mutateAsync: unarchiveQuestion } = useMutation({
    mutationFn: ({ id }: { id: string }) => api.question.unarchiveQuestionById({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["question-stats"] })
    },
  })

  const { mutateAsync: bulkDeleteQuestions } = useMutation({
    mutationFn: ({ ids }: { ids: string[] }) => api.question.deleteQuestions({ ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["question-stats"] })
    },
  })

  const { mutateAsync: bulkArchiveQuestions } = useMutation({
    mutationFn: ({ ids }: { ids: string[] }) => api.question.archiveQuestions({ ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["question-stats"] })
    },
  })

  const { mutateAsync: bulkUnarchiveQuestions } = useMutation({
    mutationFn: ({ ids }: { ids: string[] }) => api.question.unarchiveQuestions({ ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["question-stats"] })
    },
  })

  // 🔹 Handlers
  const handleDelete = useCallback(
    async (question: QuestionType) => {
      await deleteQuestion({ id: question.id })
    },
    [deleteQuestion],
  )

  const handleArchive = useCallback(
    async (question: QuestionType) => {
      await archiveQuestion({ id: question.id })
    },
    [archiveQuestion],
  )

  const handleUnarchive = useCallback(
    async (question: QuestionType) => {
      await unarchiveQuestion({ id: question.id })
    },
    [unarchiveQuestion],
  )

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      await bulkDeleteQuestions({ ids })
    },
    [bulkDeleteQuestions],
  )

  const handleBulkArchive = useCallback(
    async (ids: string[]) => {
      await bulkArchiveQuestions({ ids })
    },
    [bulkArchiveQuestions],
  )

  const handleBulkUnarchive = useCallback(
    async (ids: string[]) => {
      await bulkUnarchiveQuestions({ ids })
    },
    [bulkUnarchiveQuestions],
  )

  return {
    data: questionData || null,
    stats: stats?.data || null,

    isLoading,
    isStatsLoading,
    isFetching,
    error: error?.message || null,
    statsError: statsError?.message || null,

    query,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,

    refetch,
    refetchStats,

    uploadExcel,
    handleDelete,
    handleArchive,
    handleUnarchive,
    handleBulkDelete,
    handleBulkArchive,
    handleBulkUnarchive,
  }
}
