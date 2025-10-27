"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SortingState, PaginationState } from "@tanstack/react-table";

import { api } from "@/lib/api";
import type {
  ArrayOfFaqSchema,
  createFaqType,
  createPolicyType,
  updateFaqType,
} from "@/features/website/website.schema";
import { PolicyQueryType, updatePolicyType } from "../website.schema";
import { ApiSuccessType } from "@/lib/zod";

interface UseFaqOptions {
  initialPageSize?: number;
  enabled?: boolean;
}

export function useFaq(options: UseFaqOptions = {}) {
  const { initialPageSize = 10, enabled = true } = options;
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const queryKey = useMemo(
    () => ["faqs", pagination, sorting],
    [pagination, sorting]
  );

  const {
    data: faqData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<ApiSuccessType<typeof ArrayOfFaqSchema>>({
    queryKey,
    queryFn: async () => await api.faq.getFaqs(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { mutateAsync: createFaq, isPending: isCreating } = useMutation({
    mutationFn: (data: createFaqType) => api.faq.createFaq(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
  });

  const { mutateAsync: updateFaq, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: updateFaqType }) =>
      api.faq.updateFaqById({ id }, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
  });

  const { mutateAsync: deleteFaq, isPending: isDeleting } = useMutation({
    mutationFn: api.faq.deleteFaqById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
  });

  const { mutateAsync: archiveFaq, isPending: isArchiving } = useMutation({
    mutationFn: api.faq.archiveFaqById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
  });

  const { mutateAsync: unarchiveFaq, isPending: isUnarchiving } = useMutation({
    mutationFn: api.faq.unarchiveFaqById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
  });

  const { mutateAsync: bulkDeleteFaq, isPending: isBulkDeleting } = useMutation(
    {
      mutationFn: api.faq.deleteFaqs,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
    }
  );

  const { mutateAsync: bulkArchiveFaq, isPending: isBulkArchiving } =
    useMutation({
      mutationFn: api.faq.archiveFaqs,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
    });

  const { mutateAsync: bulkUnarchiveFaq, isPending: isBulkUnarchiving } =
    useMutation({
      mutationFn: api.faq.unarchiveFaqs,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
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

  const handleCreate = useCallback(
    (data: createFaqType) => createFaq(data),
    [createFaq]
  );
  const handleUpdate = useCallback(
    (id: string, data: updateFaqType) => updateFaq({ id, data }),
    [updateFaq]
  );
  const handleDelete = useCallback(
    (faq: { id: string }) => deleteFaq({ id: faq.id }),
    [deleteFaq]
  );
  const handleArchive = useCallback(
    (faq: { id: string }) => archiveFaq({ id: faq.id }),
    [archiveFaq]
  );
  const handleUnarchive = useCallback(
    (faq: { id: string }) => unarchiveFaq({ id: faq.id }),
    [unarchiveFaq]
  );
  const handleBulkDelete = useCallback(
    (ids: string[]) => bulkDeleteFaq({ ids }),
    [bulkDeleteFaq]
  );
  const handleBulkArchive = useCallback(
    (ids: string[]) => bulkArchiveFaq({ ids }),
    [bulkArchiveFaq]
  );
  const handleBulkUnarchive = useCallback(
    (ids: string[]) => bulkUnarchiveFaq({ ids }),
    [bulkUnarchiveFaq]
  );

  return {
    data: faqData || null,
    isLoading,
    isFetching,
    error: error?.message || null,

    sorting,
    setSorting: setSortingWithReset,
    pagination,
    setPagination,
    refetch,

    handleCreate,
    handleUpdate,
    handleDelete,
    handleArchive,
    handleUnarchive,
    handleBulkDelete,
    handleBulkArchive,
    handleBulkUnarchive,

    isCreating,
    isUpdating,
    isDeleting,
    isArchiving,
    isUnarchiving,
    isBulkDeleting,
    isBulkArchiving,
    isBulkUnarchiving,
  };
}

export function usePolicy(query: PolicyQueryType) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["policy", query],
    queryFn: () => api.policy.getPolicy(query),
  });

  const { mutateAsync: createPolicy } = useMutation({
    mutationFn: (data: createPolicyType) => api.policy.createPolicy(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["policy"] }),
  });

  const { mutateAsync: updatePolicy } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: updatePolicyType }) =>
      api.policy.updatePolicyById({ id }, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["policy"] }),
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    createPolicy,
    updatePolicy,
  };
}
