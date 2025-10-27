import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../lib/api";
import { useQueryStates } from "nuqs";
import { userSearchParams, userSearchQuery } from "../user.schema";
import SuperJSON from "superjson";
import { getValidFilters } from "@t2p-admin/ui/lib/data-table";

export function useUser() {
  const [searchState] = useQueryStates(userSearchParams, {
    history: "push",
    shallow: true,
  });

  const [searchUser, setSearchUser] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const search = userSearchQuery.parse(searchState);

  const validFilters = getValidFilters(searchState.filters);

  const query = useMemo(() => {
    return {
      ...search,
      filters: SuperJSON.stringify(validFilters),
    };
  }, [search, validFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchUser);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchUser]);

  const {
    data: users,
    isLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", query],
    queryFn: async () => await api.user.getUserList(query),
  });

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["users-stats"],
    queryFn: async () => await api.user.getUserStats(),
  });

  const { data: searchUserData, isLoading: searchUserLoading } = useQuery({
    queryKey: ["user-search", debouncedSearch],
    queryFn: async () =>
      await api.user.getUserSearch({ search: debouncedSearch }),
    enabled: !!debouncedSearch.trim(),
  });

  return {
    users: users,
    stats: stats?.data,
    isLoading,
    searchUserData,
    searchUserLoading,
    searchUser,
    setSearchUser,
    refetch: () => {
      refetchUsers();
      refetchStats();
    },
  };
}
