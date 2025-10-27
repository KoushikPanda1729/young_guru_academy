"use client";
import {
  transactionSearchParams,
  transactionSearchParamsSchema,
} from "../helpers/transaction-schema";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { useQueryStates } from "nuqs";
import { getValidFilters } from "@t2p-admin/ui/lib/data-table";
import { useMemo } from "react";
import SuperJSON from "superjson";

export function useTransaction() {
  const [searchState] = useQueryStates(transactionSearchParams, {
    history: "push",
    shallow: false,
  });

  const search = transactionSearchParamsSchema.parse(searchState);

  const validFilters = getValidFilters(searchState.filters);

  const query = useMemo(() => {
    return {
      ...search,
      filters: SuperJSON.stringify(validFilters),
    };
  }, [search, validFilters]);

  const {
    data: transactionList,
    isLoading: isLoadingList,
    error: errorList,
    refetch: refetchList,
  } = useQuery({
    queryKey: ["transactions", query],
    queryFn: () => api.transaction.getTransactionList(query),
  });

  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["transactionStats", query],
    queryFn: () => api.transaction.getStats(query),
  });

  return {
    query,
    transactionList,
    statsError,
    errorList,
    stats: stats?.data,
    isLoading: isLoadingList || isLoadingStats,
    refetch: () => {
      refetchList();
      refetchStats();
    },
  };
}
